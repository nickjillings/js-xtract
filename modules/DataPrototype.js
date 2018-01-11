/*globals Float32Array, Float64Array */
/*globals xtract_init_dct, xtract_init_mfcc, xtract_init_bark */

// Create the Singleton
var DataProto = function (N, sampleRate) {
    var _result = {},
        _data = new Float64Array(N);
    this.clearResult = function () {
        _result = {};
    };

    Object.defineProperties(this, {
        "result": {
            'get': function () {
                return _result;
            },
            'set': function () {}
        },
        "data": {
            'value': _data
        },
        "getData": {
            'value': function () {
                return _data;
            }
        }
    });

    this.zeroDataRange = function (start, end) {
        if (_data.fill) {
            _data.fill(0, start, end);
        } else {
            for (var n = start; n < end; n++) {
                _data[n] = 0;
            }
        }
        this.clearResult();
    };

    this.copyDataFrom = function (src, N, offset) {
        if (typeof src !== "object" || src.length === undefined) {
            throw ("copyDataFrom requires src to be an Array or TypedArray");
        }
        if (offset === undefined) {
            offset = 0;
        }
        if (N === undefined) {
            N = Math.min(src.length, _data.length);
        }
        N = Math.min(N + offset, _data.length);
        for (var n = 0; n < N; n++) {
            _data[n + offset] = src[n];
        }
        this.clearResult();
    };

    this.duplicate = function () {
        var copy = this.prototype.constructor(N, sampleRate);
        copy.copyDataFrom(_data);
    };

    this.toJSON = function () {
        function lchar(str) {
            var lastchar = str[str.length - 1];
            if (lastchar !== '{' && lastchar !== ',') {
                str = str + ', ';
            }
            return str;
        }

        function getJSONString(p, n) {
            var str = "";
            if (typeof p === "number" && isFinite(p)) {
                str = '"' + n + '": ' + p;
            } else if (typeof p === "object") {
                if (p.toJSON) {
                    str = '"' + n + '": ' + p.toJSON(p);
                } else if (p.length) {
                    str = '"' + n + '": ' + xtract_array_to_JSON(p);
                } else {
                    str = '"' + n + '": ' + this.toJSON(p);
                }
            } else {
                str = '"' + n + '": "' + p.toString() + '"';
            }
            return str;
        }
        var json = '{';
        for (var property in _result) {
            if (_result.hasOwnProperty(property)) {
                json = lchar(json);
                json = json + getJSONString(_result[property], property);
            }
        }
        return json + '}';
    };

    function recursiveDelta(a, b) {
        //a and b are objects of Time/Spectrum/PeakS/HarmonicS Data
        //a and b are the .result object
        var param, delta = {};
        for (param in a) {
            if (b[param]) {
                if (typeof a[param] === "number") {
                    delta[param] = a[param] - b[param];
                } else {
                    delta[param] = deltaObject(a, b, param);
                }
            }
        }
        return delta;
    }

    function deltaObject(a, b, param) {
        if (a.result && b.result) {
            return recursiveDelta(a[param].result, b[param].result);
        } else if (a.length && b.length) {
            return deltaArray(a[param], b[param])
        }
        return undefined;
    }

    function deltaArray(a, b) {
        var d;
        if (a.length === b.length) {
            d = new Float64Array(a.length);
        } else {
            d = [];
        }
        var n = 0;
        while (n < a.length && n < b.length) {
            d[n] = a[n] - b[n];
            n++;
        }
        return d;
    }

    this.computeDelta = function (compare) {
        this.result.delta = recursiveDelta(this.result, compare.result);
        return this.result.delta;
    };

    this.computeDeltaDelta = function (compare) {
        if (!compare.result.delta || !this.result.delta) {
            throw ("Cannot compute delta-delta without both objects having deltas");
        }
        this.result.delta.delta = recursiveDelta(this.result.delta, compare.result.delta);
        return this.result.delta.delta;
    };
};
DataProto.prototype.createDctCoefficients = function (N) {
    return jsXtract.createDctCoefficients(Number(N));
};
DataProto.prototype.createMfccCoefficients = function (N, nyquist, style, freq_min, freq_max, freq_bands) {
    N = Number(N);
    nyquist = Number(nyquist);
    freq_min = Number(freq_min);
    freq_max = Number(freq_max);
    freq_bands = Number(freq_bands);
    return jsXtract.createMfccCoefficients(N, nyquist, style, freq_min, freq_max, freq_bands);
};
DataProto.prototype.createBarkCoefficients = function (N, sampleRate, numBands) {
    N = Number(N);
    sampleRate = Number(sampleRate);
    numBands = Number(numBands);
    return jsXtract.createBarkCoefficients(N, sampleRate, numBands);
};
DataProto.prototype.createChromaCoefficients = function (N, sampleRate, nbins, A440, f_ctr, octwidth) {
    N = Number(N);
    sampleRate = Number(sampleRate);
    nbins = Number(nbins);
    A440 = Number(A440);
    f_ctr = Number(f_ctr);
    octwidth = Number(octwidth);
    return jsXtract.createChromaCoefficients(N, sampleRate, nbins, A440, f_ctr, octwidth);
};
