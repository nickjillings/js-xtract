/*globals Float32Array, Float64Array */
/*globals xtract_init_dct, xtract_init_mfcc, xtract_init_bark */

// Create the Singleton
var jsXtract = (function () {

    function searchMapProperties(map, properties) {
        var match = this.map.find(function (e) {
            for (var prop in properties) {
                if (e[prop] !== properties[prop]) {
                    return false;
                }
            }
            return true;
        });
        return match;
    }

    var dct_map = {
        parent: this,
        store: [],
        createCoefficients: function (N) {
            var match = searchMapProperties(this.store, {
                N: N
            });
            if (!match) {
                match = {
                    N: N,
                    data: xtract_init_dct(N)
                };
                this.store.push(match);
            }
            return match.data;
        }
    };

    var mfcc_map = {
        parent: this,
        store: [],
        createCoefficients: function (N, nyquist, style, freq_min, freq_max, freq_bands) {
            var search = {
                N: N,
                nyquist: nyquist,
                style: style,
                freq_min: freq_min,
                freq_max: freq_max,
                freq_bands: freq_bands
            };
            var match = searchMapProperties(this.store, search);
            if (!match) {
                match = search;
                match.data = xtract_init_mfcc(N, nyquist, style, freq_min, freq_max, freq_bands);
                this.store.push(match);
            }
            return match.data;
        }
    };

    var bark_map = {
        parent: this,
        store: [],
        createCoefficients: function (N, sampleRate, numBands) {
            var search = {
                N: N,
                sampleRate: sampleRate,
                numBands: numBands
            };
            var match = searchMapProperties(this.store, search);
            if (!match) {
                match = search;
                match.data = xtract_init_bark(N, sampleRate, numBands);
                this.store.push(match);
            }
            return match.data;
        }
    };
    var pub_obj = {};
    Object.defineProperties(pub_obj, {
        "createDctCoefficients": {
            "value": function (N) {
                return dct_map.createCoefficients(N);
            }
        },
        "createMfccCoefficients": {
            "value": function (N, nyquist, style, freq_min, freq_max, freq_bands) {
                return mfcc_map.createCoefficients(N, nyquist, style, freq_min, freq_max, freq_bands);
            }
        },
        "createBarkCoefficients": {
            "value": function (N, sampleRate, numBands) {
                if (typeof numBands !== "number" || numBands < 0 || numBands > 26) {
                    numBands = 26;
                }
                return bark_map.createCoefficients(N, sampleRate, numBands);
            }
        }
    });
    return pub_obj;
})();
var DataProto = function () {
    var _result = {};
    this.clearResult = function () {
        _result = {};
    };

    Object.defineProperty(this, "result", {
        'get': function () {
            return _result;
        },
        'set': function () {}
    });

    this.toJSON = function () {
        var json = '{';
        for (var property in _result) {
            var lastchar = json[json.length - 1];
            if (!lastchar == '{' && !lastchar == ',') {
                json = json + ', ';
            }
            if (typeof _result[property] === "number" && isFinite(_result[property])) {
                json = json + '"' + property + '": ' + _result[property];
            } else if (typeof _result[property] === "object") {
                switch (_result[property].constructor) {
                    case Array:
                    case Float32Array:
                    case Float64Array:
                    case TimeData:
                    case SpectrumData:
                    case PeakSpectrumData:
                    case HarmonicSpectrumData:
                        // Array
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
    jsXtract.createDctCoefficients(Number(N));
};
DataProto.prototype.createMfccCoefficients = function (N, nyquist, style, freq_min, freq_max, freq_bands) {
    N = Number(N);
    nyquist = Number(nyquist);
    freq_min = Number(freq_min);
    freq_max = Number(freq_max);
    freq_bands = Number(freq_bands);
    jsXtract.createMfccCoefficients(N, nyquist, style, freq_min, freq_max, freq_bands);
};
DataProto.prototype.createBarkCoefficients = function (N, sampleRate, numBands) {
    N = Number(N);
    sampleRate = Number(sampleRate);
    numBands = Number(numBands);
    jsXtract.createBarkCoefficients(N, sampleRate, numBands);
};
