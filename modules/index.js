import {
    xtract_is_denormal
} from "./functions/xtract_is_denormal";
import {
    xtract_assert_array
} from "./functions/xtract_assert_array";
import {
    xtract_assert_positive_integer
} from "./functions/xtract_assert_positive_integer";
import {
    xtract_array_sum
} from "./functions/xtract_array_sum";
import {
    xtract_array_copy
} from "./functions/xtract_array_copy";
import {
    xtract_array_min
} from "./functions/xtract_array_min";
import {
    xtract_array_max
} from "./functions/xtract_array_max";
import {
    xtract_array_scale
} from "./functions/xtract_array_scale";
import {
    xtract_array_normalise
} from "./functions/xtract_array_normalise";
import {
    xtract_array_bound
} from "./functions/xtract_array_bound";
import {
    xtract_array_interlace
} from "./functions/xtract_array_interlace";
import {
    xtract_array_deinterlace
} from "./functions/xtract_array_deinterlace";
import {
    xtract_get_number_of_frames
} from "./functions/xtract_get_number_of_frames";
import {
    xtract_get_data_frames
} from "./functions/xtract_get_data_frames";
import {
    xtract_process_frame_data
} from "./functions/xtract_process_frame_data";
import {
    xtract_array_to_JSON
} from "./functions/xtract_array_to_JSON";
import {
    xtract_frame_from_array
} from "./functions/xtract_frame_from_array";
import {
    xtract_mean
} from "./functions/xtract_mean";
import {
    xtract_temporal_centroid
} from "./functions/xtract_temporal_centroid";
import {
    xtract_variance
} from "./functions/xtract_variance";
import {
    xtract_standard_deviation
} from "./functions/xtract_standard_deviation";
import {
    xtract_average_deviation
} from "./functions/xtract_average_deviation";
import {
    xtract_skewness_kurtosis
} from "./functions/xtract_skewness_kurtosis";
import {
    xtract_skewness
} from "./functions/xtract_skewness";
import {
    xtract_kurtosis
} from "./functions/xtract_kurtosis";
import {
    xtract_spectral_centroid
} from "./functions/xtract_spectral_centroid";
import {
    xtract_spectral_mean
} from "./functions/xtract_spectral_mean";
import {
    xtract_spectral_variance
} from "./functions/xtract_spectral_variance";
import {
    xtract_spectral_spread
} from "./functions/xtract_spectral_spread";
import {
    xtract_spectral_standard_deviation
} from "./functions/xtract_spectral_standard_deviation";
import {
    xtract_spectral_skewness
} from "./functions/xtract_spectral_skewness";
import {
    xtract_spectral_kurtosis
} from "./functions/xtract_spectral_kurtosis";
import {
    xtract_irregularity_k
} from "./functions/xtract_irregularity_k";
import {
    xtract_irregularity_j
} from "./functions/xtract_irregularity_j";
import {
    xtract_tristimulus,
    xtract_tristimulus_1,
    xtract_tristimulus_2,
    xtract_tristimulus_3
} from "./functions/xtract_tristimulus";
import {
    xtract_smoothness
} from "./functions/xtract_smoothness";
import {
    xtract_zcr
} from "./functions/xtract_zcr";
import {
    xtract_rolloff
} from "./functions/xtract_rolloff";
import {
    xtract_loudness
} from "./functions/xtract_loudness";
import {
    xtract_flatness
} from "./functions/xtract_flatness";
import {
    xtract_flatness_db
} from "./functions/xtract_flatness_db";
import {
    xtract_tonality
} from "./functions/xtract_tonality";
import {
    xtract_crest
} from "./functions/xtract_crest";
import {
    xtract_noisiness
} from "./functions/xtract_noisiness";
import {
    xtract_rms_amplitude
} from "./functions/xtract_rms_amplitude";
import {
    xtract_spectral_inharmonicity
} from "./functions/xtract_spectral_inharmonicity";
import {
    xtract_power
} from "./functions/xtract_power";
import {
    xtract_odd_even_ratio
} from "./functions/xtract_odd_even_ratio";
import {
    xtract_sharpness
} from "./functions/xtract_sharpness";
import {
    xtract_spectral_slope
} from "./functions/xtract_spectral_slope";
import {
    xtract_lowhigh
} from "./functions/xtract_lowhigh";
import {
    xtract_lowest_value
} from "./functions/xtract_lowest_value";
import {
    xtract_highest_value
} from "./functions/xtract_highest_value";
import {
    xtract_sum
} from "./functions/xtract_sum";
import {
    xtract_nonzero_count
} from "./functions/xtract_nonzero_count";
import {
    xtract_hps
} from "./functions/xtract_hps";
import {
    xtract_f0
} from "./functions/xtract_f0";
import {
    xtract_failsafe_f0
} from "./functions/xtract_failsafe_f0";
import {
    xtract_wavelet_f0
} from "./functions/xtract_wavelet_f0";
import {
    xtract_midicent
} from "./functions/xtract_midicent";
import {
    xtract_spectral_fundamental
} from "./functions/xtract_spectral_fundamental";
import {
    xtract_energy
} from "./functions/xtract_energy";
import {
    xtract_spectrum
} from "./functions/xtract_spectrum";
import {
    xtract_complex_spectrum
} from "./functions/xtract_complex_spectrum";
import {
    xtract_mfcc
} from "./functions/xtract_mfcc";
import {
    xtract_dct
} from "./functions/xtract_dct";
import {
    xtract_dct_2
} from "./functions/xtract_dct_2";
import {
    xtract_autocorrelation
} from "./functions/xtract_autocorrelation";
import {
    xtract_amdf
} from "./functions/xtract_amdf";
import {
    xtract_asdf
} from "./functions/xtract_asdf";
import {
    xtract_bark_coefficients
} from "./functions/xtract_bark_coefficients";
import {
    xtract_peak_spectrum
} from "./functions/xtract_peak_spectrum";
import {
    xtract_harmonic_spectrum
} from "./functions/xtract_harmonic_spectrum";
import {
    xtract_lpc
} from "./functions/xtract_lpc";
import {
    xtract_lpcc
} from "./functions/xtract_lpcc";
import {
    xtract_pcp
} from "./functions/xtract_pcp";
import {
    xtract_yin
} from "./functions/xtract_yin";
import {
    xtract_onset
} from "./functions/xtract_onset";
import {
    xtract_resample
} from "./functions/xtract_resample";
import {
    xtract_init_dft
} from "./functions/xtract_init_dft";
import {
    xtract_init_dct
} from "./functions/xtract_init_dct";
import {
    xtract_init_mfcc
} from "./functions/xtract_init_mfcc";
import {
    xtract_init_wavelet
} from "./functions/xtract_init_wavelet";
import {
    xtract_init_pcp
} from "./functions/xtract_init_pcp";
import {
    xtract_init_bark
} from "./functions/xtract_init_bark";
import {
    xtract_init_chroma
} from "./functions/xtract_init_chroma";
import {
    xtract_apply_window
} from "./functions/xtract_apply_window";
import {
    xtract_create_window
} from "./functions/xtract_create_window";
import {
    xtract_chroma
} from "./functions/xtract_chroma";

import {
    HarmonicSpectrumData
} from "./objects/HarmonicSpectrumData";
import {
    PeakSpectrumData
} from "./objects/PeakSpectrumData";
import {
    SpectrumData
} from "./objects/SpectrumData";
import {
    TimeData
} from "./objects/TimeData";


if (typeof AnalyserNode !== "undefined") {

    AnalyserNode.prototype.timeData = undefined;
    AnalyserNode.prototype.spectrumData = undefined;
    AnalyserNode.prototype.callbackObject = undefined;
    AnalyserNode.prototype.fooGain = undefined;
    AnalyserNode.prototype.getXtractData = function () {
        if (this.timeData === undefined || this.scpectrumData === undefined) {
            this.timeData = new TimeData(this.fftSize, this.context.sampleRate);
            this.spectrumData = new SpectrumData(this.frequencyBinCount, this.context.sampleRate);
        }
        var dst = new Float32Array(this.fftSize);
        var i;
        if (this.getFloatTimeDomainData) {
            this.getFloatTimeDomainData(dst);
        } else {
            var view = new Uint8Array(this.fftSize);
            this.getByteTimeDomainData(view);
            for (i = 0; i < this.fftSize; i++) {
                dst[i] = view[i];
                dst[i] = (dst[i] / 127.5) - 1;
            }
        }
        this.timeData.copyDataFrom(dst);
        this.timeData.result.spectrum = this.spectrumData;
        var LogStore = new Float32Array(this.frequencyBinCount);
        this.getFloatFrequencyData(LogStore);
        for (i = 0; i < this.frequencyBinCount; i++) {
            LogStore[i] = Math.pow(10.0, LogStore[i] / 20);
        }
        this.spectrumData.copyDataFrom(LogStore);
        return this.timeData;
    };
    AnalyserNode.prototype.previousFrame = undefined;
    AnalyserNode.prototype.previousResult = undefined;
    AnalyserNode.prototype.frameCallback = function (func, arg_this) {
        // Perform a callback on each frame
        // The function callback has the arguments (current_frame, previous_frame, previous_result)
        if (this.callbackObject === undefined) {
            this.callbackObject = this.context.createScriptProcessor(this.fftSize, 1, 1);
            this.connect(this.callbackObject);
        }
        var _func = func;
        var _arg_this = arg_this;
        var self = this;
        this.callbackObject.onaudioprocess = function (e) {
            var current_frame = self.getXtractData();
            this.previousResult = _func.call(_arg_this, current_frame, this.previousFrame, this.previousResult);
            this.previousFrame = current_frame;
            var N = e.outputBuffer.length;
            var output = new Float32Array(N);
            var result = this.previousResult;
            if (typeof this.previousResult !== "number") {
                result = 0.0;
            }
            for (var i = 0; i < N; i++) {
                output[i] = result;
            }
            e.outputBuffer.copyToChannel(output, 0, 0);
        };

        // For chrome and other efficiency browsers
        if (!this.fooGain) {
            this.fooGain = this.context.createGain();
            this.fooGain.gain.value = 0;
            this.callbackObject.connect(this.fooGain);
            this.fooGain.connect(this.context.destination);
        }
    };

    AnalyserNode.prototype.clearCallback = function () {
        this.disconnect(this.callbackObject);
        this.callbackObject.onaudioprocess = undefined;
    };

    AnalyserNode.prototype.xtractFrame = function (func, arg_this) {
        // Collect the current frame of data and perform the callback function
        func.call(arg_this, this.getXtractData());
    };
}

if (typeof AudioBuffer !== "undefined") {

    AudioBuffer.prototype.xtract_get_data_frames = function (frame_size, hop_size) {
        if (hop_size === undefined) {
            hop_size = frame_size;
        }
        (function () {
            if (!xtract_assert_positive_integer(frame_size)) {
                throw ("xtract_get_data_frames requires the frame_size to be defined, positive integer");
            }
            if (!xtract_assert_positive_integer(hop_size)) {
                throw ("xtract_get_data_frames requires the hop_size to be a positive integer");
            }
        })();
        this.frames = [];
        var N = this.length;
        var K = this.xtract_get_number_of_frames(hop_size);
        for (var c = 0; c < this.numberOfChannels; c++) {
            var data = this.getChannelData(c);
            this.frames[c] = [];
            for (var k = 0; k < K; k++) {
                var frame = new TimeData(frame_size, this.sampleRate);
                frame.copyDataFrom(data.subarray(hop_size * k, hop_size * k + frame_size));
                this.frames[c].push(frame);
                frame = undefined;
            }
            data = undefined;
        }
        return this.frames;
    };

    AudioBuffer.prototype.xtract_get_number_of_frames = function (hop_size) {
        return xtract_get_number_of_frames(this, hop_size);
    };

    AudioBuffer.prototype.xtract_get_frame = function (dst, channel, index, frame_size) {
        (function () {
            if (typeof dst !== "object" || dst.constructor !== Float32Array) {
                throw ("dst must be a Float32Array object equal in length to hop_size");
            }
            if (!xtract_assert_positive_integer(channel)) {
                throw ("xtract_get_frame requires the channel to be an integer value");
            }
            if (!xtract_assert_positive_integer(index)) {
                throw ("xtract_get_frame requires the index to be an integer value");
            }
            if (!xtract_assert_positive_integer(frame_size)) {
                throw ("xtract_get_frame requires the frame_size to be defined, positive integer");
            }
        })();
        if (channel < 0 || channel > this.numberOfChannels) {
            throw ("channel number " + channel + " out of bounds");
        }
        var K = this.xtract_get_number_of_frames(frame_size);
        if (index < 0 || index >= K) {
            throw ("index number " + index + " out of bounds");
        }
        return this.copyFromChannel(dst, channel, frame_size * index);
    };

    AudioBuffer.prototype.xtract_process_frame_data = function () {
        throw ("AudioBuffer::xtract_process_frame_data has been deprecated");
    };
}


export {
    xtract_is_denormal,
    xtract_assert_array,
    xtract_assert_positive_integer,
    xtract_array_sum,
    xtract_array_copy,
    xtract_array_min,
    xtract_array_max,
    xtract_array_scale,
    xtract_array_normalise,
    xtract_array_bound,
    xtract_array_interlace,
    xtract_array_deinterlace,
    xtract_get_number_of_frames,
    xtract_get_data_frames,
    xtract_process_frame_data,
    xtract_array_to_JSON,
    xtract_frame_from_array,
    xtract_mean,
    xtract_temporal_centroid,
    xtract_variance,
    xtract_standard_deviation,
    xtract_average_deviation,
    xtract_skewness_kurtosis,
    xtract_skewness,
    xtract_kurtosis,
    xtract_spectral_centroid,
    xtract_spectral_mean,
    xtract_spectral_variance,
    xtract_spectral_spread,
    xtract_spectral_standard_deviation,
    xtract_spectral_skewness,
    xtract_spectral_kurtosis,
    xtract_irregularity_k,
    xtract_irregularity_j,
    xtract_tristimulus,
    xtract_tristimulus_1,
    xtract_tristimulus_2,
    xtract_tristimulus_3,
    xtract_smoothness,
    xtract_zcr,
    xtract_rolloff,
    xtract_loudness,
    xtract_flatness,
    xtract_flatness_db,
    xtract_tonality,
    xtract_crest,
    xtract_noisiness,
    xtract_rms_amplitude,
    xtract_spectral_inharmonicity,
    xtract_power,
    xtract_odd_even_ratio,
    xtract_sharpness,
    xtract_spectral_slope,
    xtract_lowhigh,
    xtract_lowest_value,
    xtract_highest_value,
    xtract_sum,
    xtract_nonzero_count,
    xtract_hps,
    xtract_f0,
    xtract_failsafe_f0,
    xtract_wavelet_f0,
    xtract_midicent,
    xtract_spectral_fundamental,
    xtract_energy,
    xtract_spectrum,
    xtract_complex_spectrum,
    xtract_mfcc,
    xtract_dct,
    xtract_dct_2,
    xtract_autocorrelation,
    xtract_amdf,
    xtract_asdf,
    xtract_bark_coefficients,
    xtract_peak_spectrum,
    xtract_harmonic_spectrum,
    xtract_lpc,
    xtract_lpcc,
    xtract_pcp,
    xtract_yin,
    xtract_onset,
    xtract_resample,
    xtract_init_dft,
    xtract_init_dct,
    xtract_init_mfcc,
    xtract_init_wavelet,
    xtract_init_pcp,
    xtract_init_bark,
    xtract_init_chroma,
    xtract_apply_window,
    xtract_create_window,
    xtract_chroma,
    HarmonicSpectrumData,
    PeakSpectrumData,
    SpectrumData,
    TimeData
};
