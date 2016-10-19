// Prototpye for the Spectrum data type
var SpectrumData = function (N, sampleRate, parent) {
    // N specifies the number of elements to create. Actually creates 2N to hold amplitudes and frequencies.
    // If sampleRate is null, calculate using radians per second [0, pi/2]
    if (N == undefined || N <= 0) {
        console.error("SpectrumData constructor requires N to be a defined, whole number");
        return;
    }
    if (sampleRate == undefined) {
        sampleRate = Math.PI;
    }
    this.__proto__ = jsXtract.createSpectrumDataProto();
    this.__proto__.constructor = SpectrumData;
    var _data = new Float64Array(2 * N);
    var _amps = _data.subarray(0, N);
    var _freqs = _data.subarray(N, 2 * N);
    var _length = N;
    var _Fs = sampleRate;
    var _f0 = undefined;
    var _mfcc, _bark, _dct = this.createDctCoefficients(_length);

    function computeFrequencies() {
        for (var i = 0; i < N; i++) {
            _freqs[i] = (i / N) * (_Fs / 2);
        }
    }

    computeFrequencies();

    this.getData = function () {
        return _data;
    }

    this.zeroData = function () {
        if (_amps.fill) {
            _amps.fill(0);
        } else {
            for (var n = 0; n < _data.length; n++) {
                _amps[n] = 0;
            }
        }
        this.clearResult();
    }

    this.copyDataFrom = function (src, N, offset) {
        if (typeof src != "object" || src.length == undefined) {
            console.error("copyDataFrom requires src to be an Array or TypedArray");
        }
        if (offset == undefined) {
            offset = 0;
        }
        if (N == undefined) {
            N = Math.min(src.length, _amps.length);
        }
        N = Math.min(N + offset, _amps.length);
        for (var n = 0; n < N; n++) {
            _amps[n + offset] = src[n];
        }
        this.clearResult();
    }

    this.duplicate = function () {
        var copy = this.prototype.constructor(_length);
        copy.copyDataFrom(_amps);
    }

    Object.defineProperty(this, "features", {
        'get': function () {
            return this.constructor.prototype.features;
        },
        'set': function () {}
    });

    Object.defineProperty(this, "sampleRate", {
        'get': function () {
            return _Fs
        },
        'set': function (sampleRate) {
            if (_Fs == Math.PI) {
                _Fs = sampleRate;
                computeFrequencies();
                _barkBands = xtract_init_bark(N, _Fs);
            } else {
                console.error("Cannot set one-time variable");
            }
        }
    });

    Object.defineProperty(this, "f0", {
        'get': function () {
            return _f0
        },
        'set': function (f0) {
            if (typeof f0 == "number") {
                _f0 = f0;
            }
            return _f0;
        }
    });

    Object.defineProperty(this, "init_mfcc", {
        "value": function (num_bands, freq_min, freq_max, style) {
            _mfcc = this.createMfccCoefficients(_length, _Fs * 0.5, style, freq_min, freq_max, num_bands);
            this.result.mfcc = undefined;
            return _mfcc;
        }
    });

    Object.defineProperty(this, "init_bark", {
        "value": function () {
            _bark = this.createBarkCoefficients(_length, _Fs)
            return _bark;
        }
    });

    Object.defineProperty(this, "length", {
        'value': _length,
        'writable': false,
        'enumerable': true
    });

    // Array Properties
    Object.defineProperty(this, "minimum", {
        'value': function () {
            if (this.result.minimum == undefined) {
                this.result.minimum = xtract_array_min(_amps);
            }
            return this.result.minimum;
        }
    });
    Object.defineProperty(this, "maximum", {
        'value': function () {
            if (this.result.maximum == undefined) {
                this.result.maximum = xtract_array_max(_amps);
            }
            return this.result.maximum;
        }
    });
    Object.defineProperty(this, "sum", {
        'value': function () {
            if (this.result.sum == undefined) {
                this.result.sum = xtract_array_sum(_amps);
            }
            return this.result.sum;
        }
    });

    // Features

    Object.defineProperty(this, "spectral_centroid", {
        'value': function () {
            if (this.result.spectral_centroid == undefined) {
                this.result.spectral_centroid = xtract_spectral_centroid(_data);
            }
            return this.result.spectral_centroid;
        }
    });

    Object.defineProperty(this, "spectral_mean", {
        'value': function () {
            if (this.result.spectral_mean == undefined) {
                this.result.spectral_mean = xtract_spectral_mean(_data);
            }
            return this.result.spectral_mean;
        }
    });

    Object.defineProperty(this, "spectral_variance", {
        'value': function () {
            if (this.result.spectral_variance == undefined) {
                this.result.spectral_variance = xtract_spectral_variance(_data, this.spectral_mean());
            }
            return this.result.spectral_variance;
        }
    });

    Object.defineProperty(this, "spectral_spread", {
        'value': function () {
            if (this.result.spectral_spread == undefined) {
                this.result.spectral_spread = xtract_spectral_spread(_data, this.spectral_centroid());
            }
            return this.result.spectral_spread;
        }
    });

    Object.defineProperty(this, "spectral_standard_deviation", {
        'value': function () {
            if (this.result.spectral_standard_deviation == undefined) {
                this.result.spectral_standard_deviation = xtract_spectral_standard_deviation(_data, this.spectral_variance());
            }
            return this.result.spectral_standard_deviation;
        }
    });

    Object.defineProperty(this, "spectral_skewness", {
        'value': function () {
            if (this.result.spectral_skewness == undefined) {
                this.result.spectral_skewness = xtract_spectral_skewness(_data, this.spectral_mean(), this.spectral_standard_deviation());
            }
            return this.result.spectral_skewness;
        }
    });

    Object.defineProperty(this, "spectral_kurtosis", {
        'value': function () {
            if (this.result.spectral_kurtosis == undefined) {
                this.result.spectral_kurtosis = xtract_spectral_kurtosis(_data, this.spectral_mean(), this.spectral_standard_deviation());
            }
            return this.result.spectral_kurtosis;
        }
    });

    Object.defineProperty(this, "irregularity_k", {
        'value': function () {
            if (this.result.irregularity_k == undefined) {
                this.result.irregularity_k = xtract_irregularity_k(_data);
            }
            return this.result.irregularity_k;
        }
    });

    Object.defineProperty(this, "irregularity_j", {
        'value': function () {
            if (this.result.irregularity_j == undefined) {
                this.result.irregularity_j = xtract_irregularity_j(_data);
            }
            return this.result.irregularity_j;
        }
    });

    Object.defineProperty(this, "tristimulus_1", {
        'value': function () {
            if (this.result.tristimulus_1 == undefined) {
                this.result.tristimulus_1 = xtract_tristimulus_1(_data, _f0);
            }
            return this.result.tristimulus_1;
        }
    });

    Object.defineProperty(this, "tristimulus_2", {
        'value': function () {
            if (this.result.tristimulus_2 == undefined) {
                this.result.tristimulus_2 = xtract_tristimulus_2(_data, _f0);
            }
            return this.result.tristimulus_2;
        }
    });

    Object.defineProperty(this, "tristimulus_3", {
        'value': function () {
            if (this.result.tristimulus_3 == undefined) {
                this.result.tristimulus_3 = xtract_tristimulus_3(_data, _f0);
            }
            return this.result.tristimulus_3;
        }
    });

    Object.defineProperty(this, "smoothness", {
        'value': function () {
            if (this.result.smoothness == undefined) {
                this.result.smoothness = xtract_smoothness(_data);
            }
            return this.result.smoothness;
        }
    });

    Object.defineProperty(this, "rolloff", {
        'value': function (threshold) {
            if (this.result.rolloff == undefined) {
                this.result.rolloff = xtract_rolloff(_data, _Fs, threshold);
            }
            return this.result.rolloff;
        }
    });

    Object.defineProperty(this, "loudness", {
        'value': function () {
            if (this.result.loudness == undefined) {
                this.result.loudness = xtract_loudness(this.bark_coefficients());
            }
            return this.result.loudness;
        }
    });

    Object.defineProperty(this, "sharpness", {
        'value': function () {
            if (this.result.sharpness == undefined) {
                this.result.sharpness = xtract_sharpness(this.bark_coefficients());
            }
            return this.result.sharpness;
        }
    });

    Object.defineProperty(this, "flatness", {
        'value': function () {
            if (this.result.flatness == undefined) {
                this.result.flatness = xtract_flatness(_data);
            }
            return this.result.flatness;
        }
    });

    Object.defineProperty(this, "flatness_db", {
        'value': function () {
            if (this.result.flatness_db == undefined) {
                this.result.flatness_db = xtract_flatness_db(_data, this.flatness());
            }
            return this.result.flatness_db;
        }
    });

    Object.defineProperty(this, "tonality", {
        'value': function () {
            if (this.result.tonality == undefined) {
                this.result.tonality = xtract_tonality(_data, this.flatness_db());
            }
            return this.result.tonality;
        }
    });

    Object.defineProperty(this, "spectral_crest_factor", {
        'value': function () {
            if (this.result.spectral_crest_factor == undefined) {
                this.result.spectral_crest_factor = xtract_crest(_amps, this.maximum(), this.spectral_mean());
            }
            return this.result.spectral_crest_factor;
        }
    })

    Object.defineProperty(this, "spectral_slope", {
        'value': function () {
            if (this.result.spectral_slope == undefined) {
                this.result.spectral_slope = xtract_spectral_slope(_data);
            }
            return this.result.spectral_slope;
        }
    });
    
    Object.defineProperty(this, "spectral_fundamental", {
        'value': function () {
            if (this.result.spectral_fundamental == undefined) {
                this.result.spectral_fundamental = xtract_spectral_fundamental(_data, _Fs);
                this.f0 = this.result.spectral_fundamental;
            }
            return this.result.spectral_fundamental;
        }
    })

    Object.defineProperty(this, "nonzero_count", {
        'value': function () {
            if (this.result.nonzero_count == undefined) {
                this.result.nonzero_count = xtract_nonzero_count(_amps);
            }
            return this.result.nonzero_count;
        }
    });

    Object.defineProperty(this, "hps", {
        'value': function () {
            if (this.result.hps == undefined) {
                this.result.hps = xtract_hps(_data);
            }
            return this.result.hps;
        }
    });

    Object.defineProperty(this, "mfcc", {
        'value': function (num_bands, freq_min, freq_max) {
            if (_mfcc == undefined) {
                if (freq_min == undefined) {
                    console.error("Run init_mfcc(num_bands, freq_min, freq_max, style) first");
                    return null;
                } else {
                    this.init_mfcc(num_bands, freq_min, freq_max);
                }
            }
            if (this.result.mfcc == undefined) {
                this.result.mfcc = xtract_mfcc(_data, _mfcc);
            }
            return this.result.mfcc;
        }
    });

    Object.defineProperty(this, "dct", {
        'value': function () {
            if (this.result.dct == undefined) {
                this.result.dct = xtract_dct_2(_amps, _dct);
            }
            return this.result.dct;
        }
    });

    Object.defineProperty(this, "bark_coefficients", {
        'value': function () {
            if (this.result.bark_coefficients == undefined) {
                if (_bark == undefined) {
                    this.init_bark(_length, _Fs);
                }
                this.result.bark_coefficients = xtract_bark_coefficients(_data, _bark);
            }
            return this.result.bark_coefficients;
        }
    })

    Object.defineProperty(this, "peak_spectrum", {
        'value': function (threshold) {
            if (this.result.peak_spectrum == undefined) {
                this.result.peak_spectrum = new PeakSpectrumData(_length, _Fs, this);
                var ps = xtract_peak_spectrum(_data, _Fs / _length, threshold);
                this.result.peak_spectrum.copyDataFrom(ps.subarray(0, _length));
            }
            return this.result.peak_spectrum;
        }
    });

}
