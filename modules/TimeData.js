// Prototype for Time Domain based data
/*globals console, Float32Array, Float64Array */
var TimeData = function (N, sampleRate, parent) {
    if (sampleRate <= 0) {
        sampleRate = undefined;
        console.log("Invalid parameter for 'sampleRate' for TimeData");
    }

    var _length, _Fs, _wavelet, _dct;

    if (typeof N === "object") {
        var src, src_data;
        if (N.constructor === TimeData) {
            src = src.getData();
            _length = src.length;
            DataProto.call(this, _length);
            N = _length;
            this.copyDataFrom(src, N, 0);
        } else if (N.constructor === Float32Array || N.constructor === Float64Array) {
            src = N;
            N = _length = src.length;
            DataProto.call(this, _length);
            this.copyDataFrom(src, N, 0);
        } else {
            throw ("TimeData: Invalid object passed as first argument.");
        }

    } else if (typeof N === "number") {
        if (N <= 0 || N !== Math.floor(N)) {
            throw ("TimeData: Invalid number passed as first argument.");
        }
        _length = N;
        DataProto.call(this, N, sampleRate);
    } else {
        throw ("TimeData: Constructor has invalid operators!");
    }

    _Fs = sampleRate;
    _dct = this.createDctCoefficients(_length);
    _wavelet = xtract_init_wavelet();

    this.zeroData = function () {
        this.zeroDataRange(0, N);
    };

    Object.defineProperties(this, {
        "features": {
            'values': this.constructor.prototype.features
        },
        "sampleRate": {
            'get': function () {
                return _Fs;
            },
            'set': function (sampleRate) {
                if (_Fs === undefined) {
                    _Fs = sampleRate;
                } else {
                    throw ("Cannot set one-time variable");
                }
            }
        },
        "length": {
            'value': _length,
            'writable': false,
            'enumerable': true
        },
        "getFrames": {
            'value': function (frameSize, hopSize) {
                if (typeof frameSize !== "number" || frameSize <= 0 || frameSize !== Math.floor(frameSize)) {
                    throw ("frameSize must be a defined, positive integer");
                }
                if (typeof hopSize !== "number") {
                    hopSize = frameSize;
                }
                var num_frames = Math.ceil(_length / frameSize);
                var result_frames = [];
                for (var i = 0; i < num_frames; i++) {
                    var frame = new TimeData(hopSize, _Fs);
                    frame.copyDataFrom(this.data.subarray(frameSize * i, frameSize * i + hopSize));
                    result_frames.push(frame);
                }
                return result_frames;
            }
        },
        "minimum": {
            'value': function () {
                if (this.result.minimum === undefined) {
                    this.result.minimum = xtract_array_min(this.data);
                }
                return this.result.minimum;
            }
        },
        "maximum": {
            'value': function () {
                if (this.result.maximum === undefined) {
                    this.result.maximum = xtract_array_max(this.data);
                }
                return this.result.maximum;
            }
        },
        "sum": {
            'value': function () {
                if (this.result.sum === undefined) {
                    this.result.sum = xtract_array_sum(this.data);
                }
                return this.result.sum;
            }
        },
        "mean": {
            'value': function () {
                if (this.result.mean === undefined) {
                    this.result.mean = xtract_mean(this.data);
                }
                return this.result.mean;
            }
        },
        "temporal_centroid": {
            'value': function (window_ms) {
                if (this.result.temporal_centroid === undefined) {
                    this.energy(window_ms);
                    this.result.temporal_centroid = xtract_temporal_centroid(this.result.energy.data, _Fs, window_ms);
                }
                return this.result.temporal_centroid;
            }
        },
        "variance": {
            'value': function () {
                if (this.result.variance === undefined) {
                    this.result.variance = xtract_variance(this.data, this.mean());
                }
                return this.result.variance;
            }
        },
        "standard_deviation": {
            'value': function () {
                if (this.result.standard_deviation === undefined) {
                    this.result.standard_deviation = xtract_standard_deviation(this.data, this.variance());
                }
                return this.result.standard_deviation;
            }
        },
        "average_deviation": {
            'value': function () {
                if (this.result.average_deviation === undefined) {
                    this.result.average_deviation = xtract_average_deviation(this.data, this.mean());
                }
                return this.result.average_deviation;
            }
        },
        "skewness": {
            'value': function () {
                if (this.result.skewness === undefined) {
                    this.result.skewness = xtract_skewness(this.data, this.mean(), this.standard_deviation());
                }
                return this.result.skewness;
            }
        },
        "kurtosis": {
            'value': function () {
                if (this.result.kurtosis === undefined) {
                    this.result.kurtosis = xtract_kurtosis(this.data, this.mean(), this.standard_deviation());
                }
                return this.result.kurtosis;
            }
        },
        "zcr": {
            'value': function () {
                if (this.result.zcr === undefined) {
                    this.result.zcr = xtract_zcr(this.data);
                }
                return this.result.zcr;
            }
        },
        "crest_factor": {
            'value': function () {
                if (this.result.crest_factor === undefined) {
                    this.result.crest_factor = xtract_crest(this.data, this.maximum(), this.mean());
                }
                return this.result.crest_factor;
            }
        },
        "rms_amplitude": {
            'value': function () {
                if (this.result.rms_amplitude === undefined) {
                    this.result.rms_amplitude = xtract_rms_amplitude(this.data);
                }
                return this.result.rms_amplitude;
            }
        },
        "lowest_value": {
            'value': function (threshold) {
                if (this.result.lowest_value === undefined) {
                    this.result.lowest_value = xtract_lowest_value(this.data, threshold);
                }
                return this.result.lowest_value;
            }
        },
        "highest_value": {
            'value': function (threshold) {
                if (this.result.highest_value === undefined) {
                    this.result.highest_value = xtract_highest_value(this.data, threshold);
                }
                return this.result.highest_value;
            }
        },
        "nonzero_count": {
            'value': function () {
                if (this.result.nonzero_count === undefined) {
                    this.result.nonzero_count = xtract_nonzero_count(this.data);
                }
                return this.result.nonzero_count;
            }

        },
        "f0": {
            'value': function () {
                if (_wavelet === undefined) {
                    _wavelet = this.init_wavelet();
                }
                if (this.result.f0 === undefined) {
                    this.result.f0 = xtract_wavelet_f0(this.data, _Fs, _wavelet);
                }
                return this.result.f0;
            }
        },
        "energy": {
            'value': function (window_ms) {
                if (this.result.energy === undefined || this.result.energy.window_ms !== window_ms) {
                    this.result.energy = {
                        'data': xtract_energy(this.data, _Fs, window_ms),
                        'window_ms': window_ms
                    };
                }
                return this.result.energy;
            }
        },
        "spectrum": {
            'value': function () {
                if (this.result.spectrum === undefined) {
                    var _spec = xtract_spectrum(this.data, _Fs, true, false);
                    this.result.spectrum = new SpectrumData(_spec.length / 2, _Fs);
                    this.result.spectrum.copyDataFrom(_spec);
                    return this.result.spectrum;
                }
            }
        },
        "dct": {
            'value': function () {
                if (this.result.dct === undefined) {
                    this.result.dct = xtract_dct_2(this.data, _dct);
                }
                return this.result.dct;
            }
        },
        "autocorrelation": {
            'value': function () {
                if (this.result.autocorrelation === undefined) {
                    this.result.autocorrelation = xtract_autocorrelation(this.data);
                }
                return this.result.autocorrelation;
            }
        },
        "amdf": {
            'value': function () {
                if (this.result.amdf === undefined) {
                    this.result.amdf = xtract_amdf(this.data);
                }
                return this.result.amdf;
            }
        },
        "asdf": {
            'value': function () {
                if (this.result.asdf === undefined) {
                    this.result.asdf = xtract_asdf(this.data);
                }
                return this.result.asdf;
            }
        },
        "yin": {
            'value': function () {
                if (this.result.yin === undefined) {
                    this.result.yin = xtract_yin(this.data);
                }
                return this.result.yin;
            }
        },
        "onset": {
            'value': function (frameSize) {
                if (this.result.onset === undefined || this.result.onset.frameSize !== frameSize) {
                    this.result.onset = {
                        'data': xtract_onset(this.data, frameSize),
                        'frameSize': frameSize
                    };
                }
                return this.result.onset;
            }
        },
        "resample": {
            'value': function (targetSampleRate) {
                if (_Fs === undefined) {
                    throw ("Source sampleRate must be defined");
                }
                if (typeof targetSampleRate !== "number" || targetSampleRate <= 0) {
                    throw ("Target sampleRate must be a positive number");
                }
                var resampled = xtract_resample(this.data, targetSampleRate, _Fs);
                var reply = new TimeData(resampled.length, targetSampleRate);
                reply.copyDataFrom(resampled);
                this.result.resample = reply;
                return reply;
            }
        }
    });
    //TODO:
    /*
    Object.defineProperty(this, "pitch", {
        'value': function () {
            if (_Fs === undefined) {
                throw ("Sample rate must be defined");
            }
            if (this.result.pitch === undefined) {
                this.result.pitch = xtract_pitch_FB(this.data, _Fs);
            }
            return this.result.pitch;
        }
    });
    */
};
TimeData.prototype = Object.create(DataProto.prototype);
TimeData.prototype.constructor = TimeData;
