var jsXtract = new function () {

    var FeaturesProto = {
        __proto__: this,
        features: {
            TimeData: [
                {
                    name: "Minimum",
                    function: "minimum",
                    sub_features: [],
                    parameters: [],
                    returns: "number"
                }, {
                    name: "Maximum",
                    function: "maximum",
                    sub_features: [],
                    parameters: [],
                    returns: "number"
                }, {
                    name: "Sum",
                    function: "sum",
                    sub_features: [],
                    parameters: [],
                    returns: "number"
                }, {
                    name: "Mean",
                    function: "mean",
                    sub_features: [],
                    parameters: [],
                    returns: "number"
                }, {
                    name: "Temporal Centroid",
                    function: "temporal_centroid",
                    sub_features: ["energy"],
                    parameters: [{
                        name: "Window Time",
                        unit: "ms",
                        type: "number",
                        minimum: 1,
                        maximum: undefined
                    }],
                    returns: "number"
                }, {
                    name: "Variance",
                    function: "variance",
                    sub_features: ["mean"],
                    parameters: [],
                    returns: "number"
                }, {
                    name: "Standard Deviation",
                    function: "standard_deviation",
                    sub_features: ["variance"],
                    parameters: [],
                    returns: "number"
                }, {
                    name: "Average Deviation",
                    function: "average_deviation",
                    sub_features: ["mean"],
                    parameters: [],
                    returns: "number"
                }, {
                    name: "Skewness",
                    function: "skewness",
                    sub_features: ["mean", "standard_deviation"],
                    parameters: [],
                    returns: "number"
                }, {
                    name: "Kurtosis",
                    function: "kurtosis",
                    sub_features: ["mean", "standard_deviation"],
                    parameters: [],
                    returns: "number"
                }, {
                    name: "Zero Crossing Rate",
                    function: "zcr",
                    sub_features: [],
                    parameters: [],
                    returns: "number"
                }, {
                    name: "Crest Factor",
                    function: "crest_factor",
                    sub_features: ["maximum", "mean"],
                    parameters: [],
                    returns: "number"
                }, {
                    name: "RMS Amplitude",
                    function: "rms_amplitude",
                    sub_features: [],
                    parameters: [],
                    returns: "number"
                }, {
                    name: "Lowest Value",
                    function: "lowest_value",
                    sub_features: [],
                    parameters: [{
                        name: "Threshold",
                        unit: "",
                        type: "number",
                        minimum: undefined,
                        maximum: undefined
                     }],
                    returns: "number"
                }, {
                    name: "Highest Value",
                    function: "highest_value",
                    sub_features: [],
                    parameters: [{
                        name: "Threshold",
                        unit: "",
                        type: "number",
                        minimum: undefined,
                        maximum: undefined
                    }],
                    returns: "number"
                }, {
                    name: "Non-Zero Count",
                    function: "nonzero_count",
                    sub_features: [],
                    parameters: [],
                    returns: "number"
                }, {
                    name: "Fundamental Frequency",
                    function: "f0",
                    sub_features: [],
                    parameters: [],
                    returns: "number"
                }, {
                    name: "Energy",
                    function: "energy",
                    sub_features: [],
                    parameters: [{
                        name: "Window",
                        unit: "ms",
                        type: "number",
                        minimum: 1,
                        maximum: undefined
                    }],
                    returns: "object"
                }, {
                    name: "Spectrum",
                    function: "spectrum",
                    sub_features: [],
                    parameters: [],
                    returns: "SpectrumData"
                }, {
                    name: "DCT",
                    function: "dct",
                    sub_features: [],
                    parameters: [],
                    returns: "array"
                }, {
                    name: "Autocorrelation",
                    function: "autocorrelation",
                    sub_features: [],
                    parameters: [],
                    returns: "array"
                }, {
                    name: "AMDF",
                    function: "amdf",
                    sub_features: [],
                    parameters: [],
                    returns: "array"
                }, {
                    name: "ASDF",
                    function: "asdf",
                    sub_features: [],
                    parameters: [],
                    returns: "array"
                }, {
                    name: "YIN Pitch",
                    function: "yin",
                    sub_features: [],
                    parameters: [],
                    returns: "array"
                }, {
                    name: "Onset Detection",
                    function: "onset",
                    sub_features: [],
                    parameters: [],
                    returns: "array"
                }, {
                    name: "Resample",
                    function: "resample",
                    sub_features: [],
                    parameters: [{
                        name: "Target Sample Rate",
                        unit: "Hz",
                        type: "number",
                        minimum: 0,
                        maximum: undefined
                    }],
                    returns: "TimeData"
                }
            ],
            SpectrumData: [
                {
                    name: "Minimum",
                    function: "minimum",
                    sub_features: [],
                    parameters: [],
                    returns: "number"
                }, {
                    name: "Maximum",
                    function: "maximum",
                    sub_features: [],
                    parameters: [],
                    returns: "number"
                }, {
                    name: "Sum",
                    function: "sum",
                    sub_features: [],
                    parameters: [],
                    returns: "number"
                }, {
                    name: "Spectral Centroid",
                    function: "spectral_centroid",
                    sub_features: [],
                    parameters: [],
                    returns: "number"
                }, {
                    name: "Spectral Mean",
                    function: "spectral_mean",
                    sub_features: [],
                    parameters: [],
                    returns: "number"
                }, {
                    name: "Spectral Variance",
                    function: "spectral_variance",
                    sub_features: ["spectral_mean"],
                    parameters: [],
                    returns: "number"
                }, {
                    name: "Spectral Spread",
                    function: "spectral_spread",
                    sub_features: ["spectral_centroid"],
                    parameters: [],
                    returns: "number"
                }, {
                    name: "Spectral Standard Deviation",
                    function: "spectral_standard_deviation",
                    sub_features: ["spectral_variance"],
                    parameters: [],
                    returns: "number"
                }, {
                    name: "Spectral Skewness",
                    function: "spectral_skewness",
                    sub_features: ["spectral_mean", "spectral_standard_deviation"],
                    parameters: [],
                    returns: "number"
                }, {
                    name: "Spectral Kurtosis",
                    function: "spectral_kurtosis",
                    sub_features: ["spectral_mean", "speactral_standard_deviation"],
                    parameters: [],
                    returns: "number"
                }, {
                    name: "Irregularity K",
                    function: "irregularity_k",
                    sub_features: [],
                    parameters: [],
                    returns: "number"
                }, {
                    name: "Irregularity J",
                    function: "irregularity_j",
                    sub_features: [],
                    parameters: [],
                    returns: "number"
                }, {
                    name: "Tristimulus 1",
                    function: "tristimulus_1",
                    sub_features: ["f0"],
                    parameters: [],
                    returns: "number"
                }, {
                    name: "Tristimulus 2",
                    function: "tristimulus_2",
                    sub_features: ["f0"],
                    parameters: [],
                    returns: "number"
                }, {
                    name: "Tristimulus 3",
                    function: "tristimulus_3",
                    sub_features: ["f0"],
                    parameters: [],
                    returns: "number"
                }, {
                    name: "Smoothness",
                    function: "smoothness",
                    sub_features: [],
                    parameters: [],
                    returns: "number"
                }, {
                    name: "Rolloff",
                    function: "rolloff",
                    sub_features: [],
                    parameters: [{
                        name: "Threshold",
                        unit: "",
                        type: "number",
                        minimum: 0,
                        maximum: 100
                    }],
                    returns: "number"
                }, {
                    name: "Loudness",
                    function: "loudness",
                    sub_features: ["bark_coefficients"],
                    parameters: [],
                    returns: "number"
                }, {
                    name: "Sharpness",
                    function: "sharpness",
                    sub_features: ["bark_coefficients"],
                    parameters: [],
                    returns: "number"
                }, {
                    name: "Flatness",
                    function: "flatness",
                    sub_features: [],
                    parameters: [],
                    returns: "number"
                }, {
                    name: "Flatness DB",
                    function: "flatness_db",
                    sub_features: ["flatness"],
                    parameters: [],
                    returns: "number"
                }, {
                    name: "Tonality",
                    function: "tonality",
                    sub_features: ["flatness_db"],
                    parameters: [],
                    returns: "number"
                }, {
                    name: "Spectral Crest Factory",
                    function: "spectral_crest_factor",
                    sub_features: ["maximum", "spectral_mean"],
                    parameters: [],
                    returns: "number"
                }, {
                    name: "Spectral Slope",
                    function: "spectral_slope",
                    sub_features: [],
                    parameters: [],
                    returns: "number"
                }, {
                    name: "Non-Zero count",
                    function: "nonzero_count",
                    sub_features: [],
                    parameters: [],
                    returns: "number"
                }, {
                    name: "HPS",
                    function: "hps",
                    sub_features: [],
                    parameters: [],
                    returns: "number"
                }, {
                    name: "MFCC",
                    function: "mfcc",
                    sub_features: [],
                    parameters: [{
                        name: "Band Count",
                        unit: "",
                        type: "number",
                        minimum: 0,
                        maximum: undefined,
                        default: 26
                    }, {
                        name: "Minimum Frequency",
                        unit: "Hz",
                        type: "number",
                        minimum: 0,
                        maximum: undefined,
                        default: 400
                    }, {
                        name: "Maximum Frequency",
                        unit: "Hz",
                        minimum: 0,
                        maximum: undefined,
                        default: 20000
                    }],
                    returns: "array"
                }, {
                    name: "DCT",
                    function: "dct",
                    sub_features: [],
                    parameters: [],
                    returns: "array"
                }, {
                    name: "Bark Coefficients",
                    function: "bark_coefficients",
                    sub_features: [],
                    parameters: [],
                    returns: "array"
                }, {
                    name: "Peak Spectrum",
                    function: "peak_spectrum",
                    sub_features: [],
                    parameters: [{
                        name: "Threshold",
                        unit: "",
                        type: "number",
                        minimum: 0,
                        maximum: 100
                    }],
                    returns: "PeakSpectrumData"
                }
            ],
            PeakSpectrumData: [
                {
                    name: "Spectral Inharmonicity",
                    function: "spectral_inharmonicity",
                    sub_features: ["f0"],
                    parameters: [],
                    returns: "number"
                }, {
                    name: "Harmonic Spectrum",
                    function: "harmonic_spectrum",
                    sub_features: [],
                    parameters: [{
                        name: "Threshold",
                        unit: "",
                        type: "number",
                        minimum: 0,
                        maximum: 100,
                        default: undefined
                    }],
                    returns: "HarmonicSpectrumData"
                }
            ],
            HarmonicSpectrumData: [
                {
                    name: "Odd Even Ration",
                    function: "odd_even_ratio",
                    sub_features: [],
                    parameters: [],
                    returns: "number"
                }
            ]
        },
        getFeatures(obj) {
            var feature = []
            switch (obj.constructor) {
                case TimeData:
                    feature = feature.concat(this.features.TimeData);
                    break;
                case HarmonicSpectrumData:
                    feature = feature.concat(this.features.HarmonicSpectrumData);
                case PeakSpectrumData:
                    feature = feature.concat(this.features.PeakSpectrumData);
                case SpectrumData:
                    feature = feature.concat(this.features.SpectrumData);
                    break;
                default:
                    break;
            }
            return feature;
        }
    }

    var DataProto = function (parent) {
        var _result = {};
        this.__proto__ = FeaturesProto;
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
                    default:
                        break;
                }
            } else {
                json = json + '"' + property + '": "' + _result[property].toString() + '"';
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
