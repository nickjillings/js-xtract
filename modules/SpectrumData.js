// Prototpye for the Spectrum data type
/*globals Float64Array */
var SpectrumData = function (N, sampleRate, parent) {
    // N specifies the number of elements to create. Actually creates 2N to hold amplitudes and frequencies.
    // If sampleRate is null, calculate using radians per second [0, pi/2]
    if (N === undefined || N <= 0) {
        throw ("SpectrumData constructor requires N to be a defined, whole number");
    }
    if (sampleRate === undefined) {
        sampleRate = Math.PI;
    }
    DataProto.call(this, 2 * N, sampleRate);
    var _amps = this.data.subarray(0, N);
    var _freqs = this.data.subarray(N, 2 * N);
    var _length = N;
    var _Fs = sampleRate;
    var _f0;
    var _mfcc, _bark, _dct = this.createDctCoefficients(_length);

    function computeFrequencies() {
        for (var i = 0; i < N; i++) {
            _freqs[i] = (i / N) * (_Fs / 2);
        }
    }

    computeFrequencies();

    this.zeroData = function () {
        this.zeroDataRange(0, N);
    };

    Object.defineProperties(this, {
        "features": {
            'get': function () {
                return this.constructor.prototype.features;
            },
            'set': function () {}
        },
        "sampleRate": {
            'get': function () {
                return _Fs;
            },
            'set': function (sampleRate) {
                if (_Fs === Math.PI) {
                    _Fs = sampleRate;
                    computeFrequencies();
                    _bark = xtract_init_bark(N, _Fs);
                } else {
                    throw ("Cannot set one-time variable");
                }
            }
        },
        "f0": {
            'get': function () {
                return _f0;
            },
            'set': function (f0) {
                if (typeof f0 === "number") {
                    _f0 = f0;
                }
                return _f0;
            }
        },
        "init_mfcc": {
            "value": function (num_bands, freq_min, freq_max, style) {
                _mfcc = this.createMfccCoefficients(_length, _Fs * 0.5, style, freq_min, freq_max, num_bands);
                this.result.mfcc = undefined;
                return _mfcc;
            }
        },
        "init_bark": {
            "value": function (numBands) {
                if (typeof numBands !== "number" || numBands < 0 || numBands > 26) {
                    numBands = 26;
                }
                _bark = this.createBarkCoefficients(_length, _Fs, numBands);
                return _bark;
            }
        },
        "length": {
            'value': _length,
            'writable': false,
            'enumerable': true
        },
        "minimum": {
            'value': function () {
                if (this.result.minimum === undefined) {
                    this.result.minimum = xtract_array_min(_amps);
                }
                return this.result.minimum;
            }
        },
        "maximum": {
            'value': function () {
                if (this.result.maximum === undefined) {
                    this.result.maximum = xtract_array_max(_amps);
                }
                return this.result.maximum;
            }
        },
        "sum": {
            'value': function () {
                if (this.result.sum === undefined) {
                    this.result.sum = xtract_array_sum(_amps);
                }
                return this.result.sum;
            }
        },
        "spectral_centroid": {
            'value': function () {
                if (this.result.spectral_centroid === undefined) {
                    this.result.spectral_centroid = xtract_spectral_centroid(this.data);
                }
                return this.result.spectral_centroid;
            }
        },
        "spectral_mean": {
            'value': function () {
                if (this.result.spectral_mean === undefined) {
                    this.result.spectral_mean = xtract_spectral_mean(this.data);
                }
                return this.result.spectral_mean;
            }
        },
        "spectral_variance": {
            'value': function () {
                if (this.result.spectral_variance === undefined) {
                    this.result.spectral_variance = xtract_spectral_variance(this.data, this.spectral_mean());
                }
                return this.result.spectral_variance;
            }
        },
        "spectral_spread": {
            'value': function () {
                if (this.result.spectral_spread === undefined) {
                    this.result.spectral_spread = xtract_spectral_spread(this.data, this.spectral_centroid());
                }
                return this.result.spectral_spread;
            }
        },
        "spectral_standard_deviation": {
            'value': function () {
                if (this.result.spectral_standard_deviation === undefined) {
                    this.result.spectral_standard_deviation = xtract_spectral_standard_deviation(this.data, this.spectral_variance());
                }
                return this.result.spectral_standard_deviation;
            }
        },
        "spectral_skewness": {
            'value': function () {
                if (this.result.spectral_skewness === undefined) {
                    this.result.spectral_skewness = xtract_spectral_skewness(this.data, this.spectral_mean(), this.spectral_standard_deviation());
                }
                return this.result.spectral_skewness;
            }
        },
        "spectral_kurtosis": {
            'value': function () {
                if (this.result.spectral_kurtosis === undefined) {
                    this.result.spectral_kurtosis = xtract_spectral_kurtosis(this.data, this.spectral_mean(), this.spectral_standard_deviation());
                }
                return this.result.spectral_kurtosis;
            }
        },
        "irregularity_k": {
            'value': function () {
                if (this.result.irregularity_k === undefined) {
                    this.result.irregularity_k = xtract_irregularity_k(this.data);
                }
                return this.result.irregularity_k;
            }
        },
        "irregularity_j": {
            'value': function () {
                if (this.result.irregularity_j === undefined) {
                    this.result.irregularity_j = xtract_irregularity_j(this.data);
                }
                return this.result.irregularity_j;
            }
        },
        "tristimulus_1": {
            'value': function () {
                if (_f0 === undefined) {
                    this.spectral_fundamental();
                }
                if (this.result.tristimulus_1 === undefined) {
                    this.result.tristimulus_1 = xtract_tristimulus_1(this.data, _f0);
                }
                return this.result.tristimulus_1;
            }
        },
        "tristimulus_2": {
            'value': function () {
                if (_f0 === undefined) {
                    this.spectral_fundamental();
                }
                if (this.result.tristimulus_2 === undefined) {
                    this.result.tristimulus_2 = xtract_tristimulus_2(this.data, _f0);
                }
                return this.result.tristimulus_2;
            }
        },
        "tristimulus_3": {
            'value': function () {
                if (_f0 === undefined) {
                    this.spectral_fundamental();
                }
                if (this.result.tristimulus_3 === undefined) {
                    this.result.tristimulus_3 = xtract_tristimulus_3(this.data, _f0);
                }
                return this.result.tristimulus_3;
            }
        },
        "smoothness": {
            'value': function () {
                if (this.result.smoothness === undefined) {
                    this.result.smoothness = xtract_smoothness(this.data);
                }
                return this.result.smoothness;
            }
        },
        "rolloff": {
            'value': function (threshold) {
                if (this.result.rolloff === undefined) {
                    this.result.rolloff = xtract_rolloff(this.data, _Fs, threshold);
                }
                return this.result.rolloff;
            }
        },
        "loudness": {
            'value': function () {
                if (this.result.loudness === undefined) {
                    this.result.loudness = xtract_loudness(this.bark_coefficients());
                }
                return this.result.loudness;
            }
        },
        "sharpness": {
            'value': function () {
                if (this.result.sharpness === undefined) {
                    this.result.sharpness = xtract_sharpness(this.bark_coefficients());
                }
                return this.result.sharpness;
            }
        },
        "flatness": {
            'value': function () {
                if (this.result.flatness === undefined) {
                    this.result.flatness = xtract_flatness(this.data);
                }
                return this.result.flatness;
            }
        },
        "flatness_db": {
            'value': function () {
                if (this.result.flatness_db === undefined) {
                    this.result.flatness_db = xtract_flatness_db(this.data, this.flatness());
                }
                return this.result.flatness_db;
            }
        },
        "tonality": {
            'value': function () {
                if (this.result.tonality === undefined) {
                    this.result.tonality = xtract_tonality(this.data, this.flatness_db());
                }
                return this.result.tonality;
            }
        },
        "spectral_crest_factor": {
            'value': function () {
                if (this.result.spectral_crest_factor === undefined) {
                    this.result.spectral_crest_factor = xtract_crest(_amps, this.maximum(), this.spectral_mean());
                }
                return this.result.spectral_crest_factor;
            }
        },
        "spectral_slope": {
            'value': function () {
                if (this.result.spectral_slope === undefined) {
                    this.result.spectral_slope = xtract_spectral_slope(this.data);
                }
                return this.result.spectral_slope;
            }
        },
        "spectral_fundamental": {
            'value': function () {
                if (this.result.spectral_fundamental === undefined) {
                    this.result.spectral_fundamental = xtract_spectral_fundamental(this.data, _Fs);
                    this.f0 = this.result.spectral_fundamental;
                }
                return this.result.spectral_fundamental;
            }
        },
        "nonzero_count": {
            'value': function () {
                if (this.result.nonzero_count === undefined) {
                    this.result.nonzero_count = xtract_nonzero_count(_amps);
                }
                return this.result.nonzero_count;
            }
        },
        "hps": {
            'value': function () {
                if (this.result.hps === undefined) {
                    this.result.hps = xtract_hps(this.data);
                }
                return this.result.hps;
            }
        },
        "mfcc": {
            'value': function (num_bands, freq_min, freq_max) {
                if (_mfcc === undefined) {
                    if (freq_min === undefined) {
                        throw ("Run init_mfcc(num_bands, freq_min, freq_max, style) first");
                    } else {
                        _mfcc = this.init_mfcc(num_bands, freq_min, freq_max);
                    }
                }
                if (this.result.mfcc === undefined) {
                    this.result.mfcc = xtract_mfcc(this.data, _mfcc);
                }
                return this.result.mfcc;
            }
        },
        "dct": {
            'value': function () {
                if (this.result.dct === undefined) {
                    this.result.dct = xtract_dct_2(_amps, _dct);
                }
                return this.result.dct;
            }
        },
        "bark_coefficients": {
            'value': function (num_bands) {
                if (this.result.bark_coefficients === undefined) {
                    if (_bark === undefined) {
                        _bark = this.init_bark(num_bands);
                    }
                    this.result.bark_coefficients = xtract_bark_coefficients(this.data, _bark);
                }
                return this.result.bark_coefficients;
            }
        },
        "peak_spectrum": {
            'value': function (threshold) {
                if (this.result.peak_spectrum === undefined) {
                    this.result.peak_spectrum = new PeakSpectrumData(_length, _Fs, this);
                    var ps = xtract_peak_spectrum(this.data, _Fs / _length, threshold);
                    this.result.peak_spectrum.copyDataFrom(ps.subarray(0, _length));
                }
                return this.result.peak_spectrum;
            }
        }
    });

};
SpectrumData.prototype = Object.create(DataProto.prototype);
SpectrumData.prototype.constructor = SpectrumData;
