// Prototype for Time Domain based data
var TimeData = function (N, sampleRate, parent) {
    if (sampleRate <= 0) {
        sampleRate = undefined;
        console.log("Invalid parameter for 'sampleRate' for TimeData");
    }

    var _data, _length, _Fs, _wavelet, _dct;

    if (typeof N == "object") {
        var src, src_data;
        if (N.constructor == TimeData) {
            src = N;
            src_data = src.getData();
        } else if (N.constructor == Float32Array || N.constructor == Float64Array) {
            src = N;
            src_data = N;
        } else {
            console.error("TimeData: Invalid object passed as first argument.");
        }
        _length = src.length;
        _data = new Float64Array(_length);
        for (var n = 0; n < _length; n++) {
            _data[n] = src_data[n];
        }
    } else if (typeof N == "number") {
        if (N <= 0 || N != Math.floor(N)) {
            console.error("TimeData: Invalid number passed as first argument.");
        } else {
            _length = N;
            _data = new Float64Array(_length);
        }
    } else {
        console.error("TimeData: Constructor has invalid operators!");
    }
    this.__proto__ = jsXtract.createTimeDataProto();
    this.__proto__.constructor = TimeData;

    _Fs = sampleRate;
    _dct = this.createDctCoefficients(_length);
    _wavelet = xtract_init_wavelet();

    this.getData = function () {
        return _data;
    }

    this.zeroData = function () {
        if (_data.fill) {
            _data.fill(0);
        } else {
            for (var n = 0; n < _data.length; n++) {
                _data[n] = 0;
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
            N = Math.min(src.length, _data.length);
        }
        N = Math.min(N + offset, _data.length);
        for (var n = 0; n < N; n++) {
            _data[n + offset] = src[n];
        }
        this.clearResult();
    }

    this.duplicate = function () {
        var copy = this.prototype.constructor(_data.length, _Fs);
        copy.copyDataFrom(_data);
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
            if (_Fs == undefined) {
                _Fs = sampleRate;
            } else {
                console.error("Cannot set one-time variable");
            }
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
                this.result.minimum = xtract_array_min(_data);
            }
            return this.result.minimum;
        }
    });
    Object.defineProperty(this, "maximum", {
        'value': function () {
            if (this.result.maximum == undefined) {
                this.result.maximum = xtract_array_max(_data);
            }
            return this.result.maximum;
        }
    });
    Object.defineProperty(this, "sum", {
        'value': function () {
            if (this.result.sum == undefined) {
                this.result.sum = xtract_array_sum(_data);
            }
            return this.result.sum;
        }
    });

    Object.defineProperty(this, "getFrames", {
        'value': function (frameSize, hopSize) {
            if (typeof frameSize != "number" || frameSize <= 0 || frameSize != Math.floor(frameSize)) {
                console.error("frameSize must be a defined, positive integer");
            }
            if (typeof hopSize != "number") {
                hopSize = frameSize;
            }
            var num_frames = Math.ceil(_length / frameSize);
            var result_frames = [];
            for (var i = 0; i < num_frames; i++) {
                var frame = new TimeData(hopSize, _Fs);
                frame.copyDataFrom(_data.subarray(frameSize * i, frameSize * i + hopSize));
                result_frames.push(frame);
            }
            return result_frames;
        }
    })

    // Features

    Object.defineProperty(this, "mean", {
        'value': function () {
            if (this.result.mean == undefined) {
                this.result.mean = xtract_mean(_data);
            }
            return this.result.mean;
        }
    });

    Object.defineProperty(this, "temporal_centroid", {
        'value': function (window_ms) {
            if (this.result.temporal_centroid == undefined) {
                this.energy(window_ms);
                this.result.temporal_centroid = xtract_temporal_centroid(this.result.energy.data, _Fs, window_ms);
            }
            return this.result.temporal_centroid;
        }
    });

    Object.defineProperty(this, "variance", {
        'value': function () {
            if (this.result.variance == undefined) {
                this.result.variance = xtract_variance(_data, this.mean());
            }
            return this.result.variance;
        }
    });
    Object.defineProperty(this, "standard_deviation", {
        'value': function () {
            if (this.result.standard_deviation == undefined) {
                this.result.standard_deviation = xtract_standard_deviation(_data, this.variance());
            }
            return this.result.standard_deviation;
        }
    });
    Object.defineProperty(this, "average_deviation", {
        'value': function () {
            if (this.result.average_deviation == undefined) {
                this.result.average_deviation = xtract_average_deviation(_data, this.mean());
            }
            return this.result.average_deviation;
        }
    });
    Object.defineProperty(this, "skewness", {
        'value': function () {
            if (this.result.skewness == undefined) {
                this.result.skewness = xtract_skewness(_data, this.mean(), this.standard_deviation());
            }
            return this.result.skewness;
        }
    });
    Object.defineProperty(this, "kurtosis", {
        'value': function () {
            if (this.result.kurtosis == undefined) {
                this.result.kurtosis = xtract_kurtosis(_data, this.mean(), this.standard_deviation());
            }
            return this.result.kurtosis;
        }
    });
    Object.defineProperty(this, "zcr", {
        'value': function () {
            if (this.result.zcr == undefined) {
                this.result.zcr = xtract_zcr(_data);
            }
            return this.result.zcr;
        }
    });
    Object.defineProperty(this, "crest_factor", {
        'value': function () {
            if (this.result.crest_factor == undefined) {
                this.result.crest_factor = xtract_crest(_data, this.maximum(), this.mean());
            }
            return this.result.crest_factor;
        }
    });
    Object.defineProperty(this, "rms_amplitude", {
        'value': function () {
            if (this.result.rms_amplitude == undefined) {
                this.result.rms_amplitude = xtract_rms_amplitude(_data);
            }
            return this.result.rms_amplitude;
        }
    });
    Object.defineProperty(this, "lowest_value", {
        'value': function (threshold) {
            if (this.result.lowest_value == undefined) {
                this.result.lowest_value = xtract_lowest_value(_data, threshold);
            }
            return this.result.lowest_value;
        }
    });
    Object.defineProperty(this, "highest_value", {
        'value': function (threshold) {
            if (this.result.highest_value == undefined) {
                this.result.highest_value = xtract_highest_value(_data, threshold);
            }
            return this.result.highest_value;
        }
    });
    Object.defineProperty(this, "nonzero_count", {
        'value': function () {
            if (this.result.nonzero_count == undefined) {
                this.result.nonzero_count = xtract_nonzero_count(_data);
            }
            return this.result.nonzero_count;
        }
    });
    Object.defineProperty(this, "f0", {
        'value': function () {
            if (_wavelet == undefined) {
                _wavelet = this.init_wavelet();
            }
            if (this.result.f0 == undefined) {
                this.result.f0 = xtract_wavelet_f0(_data, _Fs, _wavelet);
            }
            return this.result.f0;
        }
    });

    // Vector features
    Object.defineProperty(this, "energy", {
        'value': function (window_ms) {
            if (this.result.energy == undefined || this.result.energy.window_ms != window_ms) {
                this.result.energy = {
                    'data': xtract_energy(_data, _Fs, window_ms),
                    'window_ms': window_ms
                };
            }
            return this.result.energy;
        }
    });

    Object.defineProperty(this, "spectrum", {
        'value': function () {
            if (this.result.spectrum == undefined) {
                var _spec = xtract_spectrum(_data, _Fs, true, false);
                this.result.spectrum = new SpectrumData(_spec.length / 2, _Fs);
                this.result.spectrum.copyDataFrom(_spec);
                return this.result.spectrum;
            }
        }
    });

    Object.defineProperty(this, "dct", {
        'value': function () {
            if (this.result.dct == undefined) {
                this.result.dct = xtract_dct_2(_data, _dct);
            }
            return this.result.dct;
        }
    });

    Object.defineProperty(this, "autocorrelation", {
        'value': function () {
            if (this.result.autocorrelation == undefined) {
                this.result.autocorrelation = xtract_autocorrelation(_data);
            }
            return this.result.autocorrelation;
        }
    });

    Object.defineProperty(this, "amdf", {
        'value': function () {
            if (this.result.amdf == undefined) {
                this.result.amdf = xtract_amdf(_data);
            }
            return this.result.amdf;
        }
    });

    Object.defineProperty(this, "asdf", {
        'value': function () {
            if (this.result.asdf == undefined) {
                this.result.asdf = xtract_asdf(_data);
            }
            return this.result.asdf;
        }
    });

    Object.defineProperty(this, "yin", {
        'value': function () {
            if (this.result.yin == undefined) {
                this.result.yin = xtract_yin(_data);
            }
            return this.result.yin;
        }
    });

    Object.defineProperty(this, "onset", {
        'value': function (frameSize) {
            if (this.result.onset == undefined || this.result.onset.frameSize != frameSize) {
                this.result.onset = {
                    'data': xtract_onset(_data, frameSize),
                    'frameSize': frameSize
                };
            }
            return this.result.onset;
        }
    });

    Object.defineProperty(this, "resample", {
        'value': function (targetSampleRate) {
            if (_Fs == undefined) {
                console.error("Source sampleRate must be defined");
            }
            if (typeof targetSampleRate != "number" || targetSampleRate <= 0) {
                console.error("Target sampleRate must be a positive number");
            }
            var resampled = xtract_resample(_data, targetSampleRate, _Fs);
            var reply = new TimeData(resampled.length, targetSampleRate);
            reply.copyDataFrom(resampled);
            this.result.resample = reply;
            return reply;
        }
    });

    Object.defineProperty(this, "pitch", {
        'value': function () {
            if (_Fs == undefined) {
                console.error("Sample rate must be defined");
            }
            if (this.result.pitch == undefined) {
                this.result.pitch = xtract_pitch_FB(_data, _Fs);
            }
            return this.result.pitch;
        }
    });
}
