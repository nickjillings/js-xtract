var jsXtract = new function () {

    var DataProto = function (parent) {
        var _result = {};
        //this.__proto__ = parent;
        this.clearResult = function () {
            _result = {};
        }

        Object.defineProperty(this, "result", {
            'get': function () {
                return _result;
            },
            'set': function () {}
        });

        Object.defineProperty(this, "toJSON", {
            'value': function () {
                return this.__proto__.toJSON(_result);
            }
        });
    };
    DataProto.prototype = this;
    DataProto.prototype.constructor = DataProto;

    this.toJSON = function (result) {
        var json = '{';
        for (var property in result) {
            if (!json.endsWith('{') && !json.endsWith(',')) {
                json = json + ', ';
            }
            if (typeof result[property] == "number" && isFinite(result[property])) {
                json = json + '"' + property + '": ' + result[property];
            } else if (typeof result[property] == "object") {
                switch (result[property].constructor) {
                    case Array:
                    case Float32Array:
                    case Float64Array:
                    case TimeData:
                    case SpectrumData:
                    case PeakSpectrumData:
                    case HarmonicSpectrumData:
                        // Array
                        json = json + '"' + property + '": ' + result[property].toJSON(result[property]);
                        break;
                    default:
                        json = json + '"' + property + '": ' + this.toJSON(result[property]);
                        break;
                }
            } else {
                json = json + '"' + property + '": "' + result[property].toString() + '"';
            }
        }
        return json + '}';
    }

    function recursiveDelta(a, b) {
        //a and b are objects of Time/Spectrum/PeakS/HarmonicS Data
        //a and b are the .result object
        var param, delta = {};
        for (param in a) {
            if (b[param]) {
                if (typeof a[param] == "number") {
                    delta[param] = a[param] - b[param];
                } else {
                    switch (a[param].constructor) {
                        case Array:
                        case Float32Array:
                        case Float64Array:
                            if (a[param].length == b[param].length) {
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
    }

    this.computeDeltaDelta = function (compare) {
        if (!compare.result.delta || !this.result.delta) {
            throw ("Cannot compute delta-delta without both objects having deltas");
        }
        this.result.delta.delta = recursiveDelta(this.result.delta, compare.result.delta);
        return this.result.delta.delta;
    }

    var dct_map = {
        parent: this,
        store: [],
        createCoefficients: function (N) {
            var match = this.store.find(function (element) {
                if (element.N == this) {
                    return true;
                }
                return false;
            }, N);
            if (!match) {
                match = {
                    N: N,
                    data: xtract_init_dct(N)
                }
                this.store.push(match);
            }
            return match.data;
        }
    }

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
            }
            var match = this.store.find(function (element) {
                for (var prop in this) {
                    if (element[prop] != this[prop]) {
                        return false;
                    }
                }
                return true;
            }, search);
            if (!match) {
                match = search;
                match.data = xtract_init_mfcc(N, nyquist, style, freq_min, freq_max, freq_bands);
                this.store.push(match);
            }
            return match.data;
        }
    }

    var bark_map = {
        parent: this,
        store: [],
        createCoefficients: function (N, sampleRate) {
            var search = {
                N: N,
                sampleRate: sampleRate
            }
            var match = this.store.find(function (element) {
                for (var prop in element) {
                    if (element[prop] != this[prop]) {
                        return false;
                    }
                }
                return true;
            }, search);
            if (!match) {
                match = search;
                match.data = xtract_init_bark(N, sampleRate);
                this.store.push(match);
            }
            return match.data;
        }
    }

    this.createDctCoefficients = function (N) {
        return dct_map.createCoefficients(N);
    }

    this.createMfccCoefficients = function (N, nyquist, style, freq_min, freq_max, freq_bands) {
        return mfcc_map.createCoefficients(N, nyquist, style, freq_min, freq_max, freq_bands);
    }

    this.createBarkCoefficients = function (N, sampleRate) {
        return bark_map.createCoefficients(N, sampleRate);
    }

    this.createTimeDataProto = function () {
        var node = new DataProto();
        return node;
    }

    this.createSpectrumDataProto = function () {
        var node = new DataProto();
        return node;
    }
}
