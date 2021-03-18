/// <reference path="../../typings/objects/TimeData.d.ts" />
import {DataPrototype} from "./DataPrototype";
import {SpectrumData} from "./SpectrumData";
import {xtract_init_wavelet} from "../functions/xtract_init_wavelet";
import {xtract_array_min} from "../functions/xtract_array_min";
import {xtract_array_max} from "../functions/xtract_array_max";
import {xtract_array_sum} from "../functions/xtract_array_sum";
import {xtract_mean} from "../functions/xtract_mean";
import {xtract_temporal_centroid} from "../functions/xtract_temporal_centroid";
import {xtract_variance} from "../functions/xtract_variance";
import {xtract_standard_deviation} from "../functions/xtract_standard_deviation";
import {xtract_average_deviation} from "../functions/xtract_average_deviation";
import {xtract_skewness} from "../functions/xtract_skewness";
import {xtract_kurtosis} from "../functions/xtract_kurtosis";
import {xtract_zcr} from "../functions/xtract_zcr";
import {xtract_crest} from "../functions/xtract_crest";
import {xtract_rms_amplitude} from "../functions/xtract_rms_amplitude";
import {xtract_lowest_value} from "../functions/xtract_lowest_value";
import {xtract_nonzero_count} from "../functions/xtract_nonzero_count";
import {xtract_wavelet_f0} from "../functions/xtract_wavelet_f0";
import {xtract_energy} from "../functions/xtract_energy";
import {xtract_spectrum} from "../functions/xtract_spectrum";
import {xtract_dct_2} from "../functions/xtract_dct_2";
import {xtract_autocorrelation} from "../functions/xtract_autocorrelation";
import {xtract_amdf} from "../functions/xtract_amdf";
import {xtract_asdf} from "../functions/xtract_asdf";
import {xtract_yin} from "../functions/xtract_yin";
import {xtract_onset} from "../functions/xtract_onset";
import {xtract_resample} from "../functions/xtract_resample";

export class TimeData extends DataPrototype {
    constructor(input, sampleRate) {
        if (sampleRate <= 0) {
            sampleRate = undefined;
            console.log("Invalid parameter for 'sampleRate' for TimeData");
        }

        if (typeof input === "object") {
            var src, src_data;
            if (input instanceof TimeData) {
                src = src.getData();
                super(src.length, sampleRate);
                this.copyDataFrom(src, src.length, 0);
            } else if (input instanceof Float32Array || input instanceof Float64Array) {
                src = input;
                super(src.length, sampleRate);
                this.copyDataFrom(src, src.length, 0);
            } else {
                throw ("TimeData: Invalid object passed as first argument.");
            }

        } else if (typeof input === "number") {
            if (input <= 0 || input !== Math.floor(input)) {
                throw ("TimeData: Invalid number passed as first argument.");
            }
            super(input, sampleRate);
        } else {
            throw ("TimeData: Constructor has invalid operators!");
        }

        this._dct = undefined;
        this._wavelet = xtract_init_wavelet();
    }
    getFrames(frameSize, hopSize) {
        if (typeof frameSize !== "number" || frameSize <= 0 || frameSize !== Math.floor(frameSize)) {
            throw ("frameSize must be a defined, positive integer");
        }
        if (typeof hopSize !== "number") {
            hopSize = frameSize;
        }
        var num_frames = Math.ceil(this.data.length / frameSize);
        var result_frames = [];
        for (var i = 0; i < num_frames; i++) {
            var frame = new TimeData(hopSize, this.sampleRate);
            frame.copyDataFrom(this.data.subarray(frameSize * i, frameSize * i + hopSize));
            result_frames.push(frame);
        }
        return result_frames;
    }

    // Features
    minimum() {
        if (this.result.minimum === undefined) {
            this.result.minimum = xtract_array_min(this.data);
        }
        return this.result.minimum;
    }

    maximum() {
        if (this.result.maximum === undefined) {
            this.result.maximum = xtract_array_max(this.data);
        }
        return this.result.maximum;
    }

    sum() {
        if (this.result.sum === undefined) {
            this.result.sum = xtract_array_sum(this.data);
        }
        return this.result.sum;
    }

    mean() {
        if (this.result.mean === undefined) {
            this.result.mean = xtract_mean(this.data);
        }
        return this.result.mean;
    }

    temporal_centroid(window_ms) {
        if (this.result.temporal_centroid === undefined) {
            this.energy(window_ms);
            this.result.temporal_centroid = xtract_temporal_centroid(this.result.energy.data, this.sampleRate, window_ms);
        }
        return this.result.temporal_centroid;
    }

    variance() {
        if (this.result.variance === undefined) {
            this.result.variance = xtract_variance(this.data, this.mean());
        }
        return this.result.variance;
    }

    standard_deviation() {
        if (this.result.standard_deviation === undefined) {
            this.result.standard_deviation = xtract_standard_deviation(this.data, this.variance());
        }
        return this.result.standard_deviation;
    }

    average_deviation () {
        if (this.result.average_deviation === undefined) {
            this.result.average_deviation = xtract_average_deviation(this.data, this.mean());
        }
        return this.result.average_deviation;
    }

    skewness () {
        if (this.result.skewness === undefined) {
            this.result.skewness = xtract_skewness(this.data, this.mean(), this.standard_deviation());
        }
        return this.result.skewness;
    }

    kurtosis () {
        if (this.result.kurtosis === undefined) {
            this.result.kurtosis = xtract_kurtosis(this.data, this.mean(), this.standard_deviation());
        }
        return this.result.kurtosis;
    }

    zcr  () {
        if (this.result.zcr === undefined) {
            this.result.zcr = xtract_zcr(this.data);
        }
        return this.result.zcr;
    }

    crest_factor () {
        if (this.result.crest_factor === undefined) {
            this.result.crest_factor = xtract_crest(this.data, this.maximum(), this.mean());
        }
        return this.result.crest_factor;
    }

    rms_amplitude () {
        if (this.result.rms_amplitude === undefined) {
            this.result.rms_amplitude = xtract_rms_amplitude(this.data);
        }
        return this.result.rms_amplitude;
    }

    lowest_value (threshold) {
        if (this.result.lowest_value === undefined) {
            this.result.lowest_value = xtract_lowest_value(this.data, threshold);
        }
        return this.result.lowest_value;
    }

    highest_value () {
        if (this.result.nonzero_count === undefined) {
            this.result.nonzero_count = xtract_nonzero_count(this.data);
        }
        return this.result.nonzero_count;
    }

    f0 () {
        if (this._wavelet === undefined) {
            this._wavelet = this.init_wavelet();
        }
        if (this.result.f0 === undefined) {
            this.result.f0 = xtract_wavelet_f0(this.data, this.sampleRate, this._wavelet);
        }
        return this.result.f0;
    }

    energy (window_ms) {
        if (this.result.energy === undefined || this.result.energy.window_ms !== window_ms) {
            this.result.energy = {
                'data': xtract_energy(this.data, this.sampleRate, window_ms),
                'window_ms': window_ms
            };
        }
        return this.result.energy;
    }

    spectrum() {
        if (this.result.spectrum === undefined) {
            var _spec = xtract_spectrum(this.data, this.sampleRate, true, false);
            this.result.spectrum = new SpectrumData(_spec.length / 2, this.sampleRate);
            this.result.spectrum.copyDataFrom(_spec);
            return this.result.spectrum;
        }
    }

    dct() {
        if (this._dct === undefined) {
            this._dct = this.createDctCoefficients(this.data.length);
        }
        if (this.result.dct === undefined) {
            this.result.dct = xtract_dct_2(this.data, this._dct);
        }
        return this.result.dct;
    }

    autocorrelation () {
        if (this.result.autocorrelation === undefined) {
            this.result.autocorrelation = xtract_autocorrelation(this.data);
        }
        return this.result.autocorrelation;
    }

    amdf () {
        if (this.result.amdf === undefined) {
            this.result.amdf = xtract_amdf(this.data);
        }
        return this.result.amdf;
    }

    asdf () {
        if (this.result.asdf === undefined) {
            this.result.asdf = xtract_asdf(this.data);
        }
        return this.result.asdf;
    }

    yin() {
        if (this.result.yin === undefined) {
            this.result.yin = xtract_yin(this.data);
        }
        return this.result.yin;
    }

    onset(frameSize) {
        if (this.result.onset === undefined || this.result.onset.frameSize !== frameSize) {
            this.result.onset = {
                'data': xtract_onset(this.data, frameSize),
                'frameSize': frameSize
            };
        }
        return this.result.onset;
    }

    resample(targetSampleRate) {
        if (this.sampleRate === undefined) {
            throw ("Source sampleRate must be defined");
        }
        if (typeof targetSampleRate !== "number" || targetSampleRate <= 0) {
            throw ("Target sampleRate must be a positive number");
        }
        var resampled = xtract_resample(this.data, targetSampleRate, this.sampleRate);
        var reply = new TimeData(resampled.length, targetSampleRate);
        reply.copyDataFrom(resampled);
        this.result.resample = reply;
        return reply;
    }
}

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
