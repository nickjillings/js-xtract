var jsXtract = new function () {

    var DataProto = function (parent) {
        var _result = {};
        this.__proto__ = parent;
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
        var node = new DataProto(this);
        return node;
    }

    this.createSpectrumDataProto = function () {
        var node = new DataProto(this);
        return node;
    }
}
