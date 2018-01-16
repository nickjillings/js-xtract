/*globals Float32Array, Float64Array */
/*globals TimeData, SpectrumData, PeakSpectrumData, HarmonicSpectrumData */
TimeData.prototype.features = [
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
            maximum: undefined,
            default: 100
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
            maximum: undefined,
            default: undefined
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
            maximum: undefined,
            default: undefined
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
            maximum: undefined,
            default: 100
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
        parameters: [{
            name: "Frame Size",
            unit: "samples",
            type: "number",
            minimum: 1,
            maximum: undefined,
            default: 1024
        }],
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
            maximum: undefined,
            default: 8000
        }],
        returns: "TimeData"
    }];


SpectrumData.prototype.features = [
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
        sub_features: ["spectral_mean", "spectral_standard_deviation"],
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
        sub_features: ["spectral_fundamental"],
        parameters: [],
        returns: "number"
}, {
        name: "Tristimulus 2",
        function: "tristimulus_2",
        sub_features: ["spectral_fundamental"],
        parameters: [],
        returns: "number"
}, {
        name: "Tristimulus 3",
        function: "tristimulus_3",
        sub_features: ["spectral_fundamental"],
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
            unit: "%",
            type: "number",
            minimum: 0,
            maximum: 100,
            default: 90
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
        name: "Spectral Crest Factor",
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
        name: "Fundamental Frequency",
        function: "spectral_fundamental",
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
        name: "Chroma",
        function: "chroma",
        sub_features: [],
        parameters: [{
            name: "nbins",
            unit: "",
            type: "number",
            minimum: 2,
            maximum: undefined,
            default: 12
    }, {
            name: "A440",
            unit: "",
            type: "number",
            minimum: 220,
            maximum: 880,
            default: 440
    }, {
            name: "f_ctr",
            unit: "",
            type: "number",
            minimum: undefined,
            maximum: undefined,
            default: 1000
    }, {
            name: "octwidth",
            unit: "",
            type: "number",
            minimum: undefined,
            maximum: undefined,
            default: 1
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
        parameters: [{
            name: "Band Count",
            unit: "",
            type: "number",
            minimum: 0,
            maximum: 26,
            default: 26
    }],
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
            maximum: 100,
            default: 30
    }],
        returns: "PeakSpectrumData"
}];

PeakSpectrumData.prototype.features = SpectrumData.prototype.features.concat([
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
            default: 30
    }],
        returns: "HarmonicSpectrumData"
}]);

HarmonicSpectrumData.prototype.features = PeakSpectrumData.prototype.features.concat([
    {
        name: "Odd Even Ration",
        function: "odd_even_ratio",
        sub_features: [],
        parameters: [],
        returns: "number"
    }
]);
