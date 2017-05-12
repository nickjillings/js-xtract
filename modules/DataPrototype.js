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
        var json = '{';
        for (var property in _result) {
            if (_result.hasOwnProperty(property)) {
                var lastchar = json[json.length - 1];
                if (lastchar !== '{' && lastchar !== ',') {
                    json = json + ', ';
                }
                if (typeof _result[property] === "number" && isFinite(_result[property])) {
                    json = json + '"' + property + '": ' + _result[property];
                } else if (typeof _result[property] === "object") {
                    switch (_result[property].constructor) {
                        case Array:
                        case Float32Array:
                        case Float64Array:
                            //Array data type
                            json = json + '"' + property + '": ' + xtract_array_to_JSON(_result[property]);
                            break;
                        case TimeData:
                        case SpectrumData:
                        case PeakSpectrumData:
                        case HarmonicSpectrumData:
                            // JSXtract Data type
                            json = json + '"' + property + '": ' + _result[property].toJSON(_result[property]);
                            break;
                        default:
                            json = json + '"' + property + '": ' + this.toJSON(_result[property]);
                            break;
                    }
                } else {
                    json = json + '"' + property + '": "' + _result[property].toString() + '"';
                }
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
                    switch (a[param].constructor) {
                        case Array:
                        case Float32Array:
                        case Float64Array:
                            if (a[param].length === b[param].length) {
                                delta[param] = new Float64Array(a[param].length);
                            } else {
                                delta[param] = [];
                            }
                            var n = 0;
                            while (n < a[param].length && n < b[param].length) {
                                delta[param][n] = a[param][n] - b[param][n];
                                n++;
                            }
                            break;
                        case TimeData:
                        case SpectrumData:
                        case PeakSpectrumData:
                        case HarmonicSpectrumData:
                            delta[param] = recursiveDelta(a[param].result, b[param].result);
                            break;
                        default:
                            break;
                    }
                }
            }
        }
        return delta;
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
