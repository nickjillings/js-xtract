/// <reference path="../../typings/objects/SpectrumData.d.ts" />
import {DataPrototype} from "./DataPrototype";
import {PeakSpectrumData} from "./PeakSpectrumData";
import {xtract_init_bark} from "../functions/xtract_init_bark";
import {xtract_array_min} from "../functions/xtract_array_min";
import {xtract_array_max} from "../functions/xtract_array_max";
import {xtract_array_sum} from "../functions/xtract_array_sum";
import {xtract_spectral_centroid} from "../functions/xtract_spectral_centroid";
import {xtract_spectral_mean} from "../functions/xtract_spectral_mean";
import {xtract_spectral_variance} from "../functions/xtract_spectral_variance";
import {xtract_spectral_spread} from "../functions/xtract_spectral_spread";
import {xtract_spectral_standard_deviation} from "../functions/xtract_spectral_standard_deviation";
import {xtract_spectral_skewness} from "../functions/xtract_spectral_skewness";
import {xtract_spectral_kurtosis} from "../functions/xtract_spectral_kurtosis";
import {xtract_irregularity_k} from "../functions/xtract_irregularity_k";
import {xtract_irregularity_j} from "../functions/xtract_irregularity_j";
import {xtract_tristimulus_1, xtract_tristimulus_2, xtract_tristimulus_3} from "../functions/xtract_tristimulus";
import {xtract_smoothness} from "../functions/xtract_smoothness";
import {xtract_rolloff} from "../functions/xtract_rolloff";
import {xtract_loudness} from "../functions/xtract_loudness";
import {xtract_sharpness} from "../functions/xtract_sharpness";
import {xtract_flatness} from "../functions/xtract_flatness";
import {xtract_flatness_db} from "../functions/xtract_flatness_db";
import {xtract_tonality} from "../functions/xtract_tonality";
import {xtract_crest} from "../functions/xtract_crest";
import {xtract_spectral_slope} from "../functions/xtract_spectral_slope";
import {xtract_spectral_fundamental} from "../functions/xtract_spectral_fundamental";
import {xtract_nonzero_count} from "../functions/xtract_nonzero_count";
import {xtract_hps} from "../functions/xtract_hps";
import {xtract_mfcc} from "../functions/xtract_mfcc";
import {xtract_dct_2} from "../functions/xtract_dct_2";
import {xtract_bark_coefficients} from "../functions/xtract_bark_coefficients";
import {xtract_chroma} from "../functions/xtract_chroma";
import {xtract_peak_spectrum} from "../functions/xtract_peak_spectrum";

export class SpectrumData extends DataPrototype {
    constructor(N, sampleRate, parent) {
        if (N === undefined || N <= 0) {
            throw ("SpectrumData constructor requires N to be a defined, whole number");
        }
        if (sampleRate === undefined) {
            sampleRate = Math.PI;
        }
        super(2*N, sampleRate);
        this._amps = this.data.subarray(0, N);
        this._freqs = this.data.subarray(N, 2 * N);
        this._length = N;
        this._f0 = undefined;
        this._mfcc = undefined;
        this._bark = undefined;
        this._dct = undefined;
        this._chroma = undefined;

        this.computeFrequencies();
    }
    computeFrequencies () {
        for (let i = 0; i < this._length; i++) {
            this._freqs[i] = (i / this._length) * (this.sampleRate / 2);
        }
    }
    get sampleRate() {
        return this._sampleRate;
    }
    set sampleRate(fs) {
        if (this._sampleRate === Math.PI) {
            this._sampleRate = fs;
            this.computeFrequencies();
            if (this._bark !== undefined) {
                this._bark = xtract_init_bark(this._length, this._sampleRate );
            }

        } else {
            throw ("Cannot set one-time variable");
        }
    }

    get f0() {
        return this._f0;
    }

    set f0(f0) {
        if (typeof f0 === "number") {
            this._f0 = f0;
        }
    }

    get length() {
        return this._length;
    }

    init_mfcc(num_bands, freq_min, freq_max, style) {
        this._mfcc = this.createMfccCoefficients(this._length, this.sampleRate * 0.5, style, freq_min, freq_max, num_bands);
        this.result.mfcc = undefined;
        return this._mfcc;
    }

    init_bark(numBands) {
        if (typeof numBands !== "number" || numBands < 0 || numBands > 26) {
            numBands = 26;
        }
        this._bark = this.createBarkCoefficients(this._length, this._Fs, numBands);
        return this._bark;
    }

    init_chroma(nbins, A440, f_ctr, octwidth) {
        if (typeof nbins !== "number" || nbins <= 1) {
            nbins = 12;
        }
        if (typeof A440 !== "number" || A440 <= 27.5) {
               A440 = 440;
        }
        if (typeof f_ctr !== "number") {
               f_ctr = 1000;
        }
        if (typeof octwidth !== "number") {
               octwidth = 1;
        }
        this._chroma = this.createChromaCoefficients(this._length, this._Fs, nbins, A440, f_ctr, octwidth);
        this.result.chroma = undefined;
        return this._chroma;
    }

    minimum() {
        if (this.result.minimum === undefined) {
            this.result.minimum = xtract_array_min(this._amps);
        }
        return this.result.minimum;
    }

    maximum() {
        if (this.result.maximum === undefined) {
            this.result.maximum = xtract_array_max(this._amps);
        }
        return this.result.maximum;
    }

    sum() {
        if (this.result.sum === undefined) {
            this.result.sum = xtract_array_sum(this._amps);
        }
        return this.result.sum;
    }

    spectral_centroid() {
        if (this.result.spectral_centroid === undefined) {
            this.result.spectral_centroid = xtract_spectral_centroid(this.data);
        }
        return this.result.spectral_centroid;
    }

    spectral_mean () {
        if (this.result.spectral_mean === undefined) {
            this.result.spectral_mean = xtract_spectral_mean(this.data);
        }
        return this.result.spectral_mean;
    }

    spectral_variance () {
        if (this.result.spectral_variance === undefined) {
            this.result.spectral_variance = xtract_spectral_variance(this.data, this.spectral_centroid());
        }
        return this.result.spectral_variance;
    }

    spectral_spread() {
        if (this.result.spectral_spread === undefined) {
            this.result.spectral_spread = xtract_spectral_spread(this.data, this.spectral_centroid());
        }
        return this.result.spectral_spread;
    }

    spectral_standard_deviation() {
        if (this.result.spectral_standard_deviation === undefined) {
            this.result.spectral_standard_deviation = xtract_spectral_standard_deviation(this.data, this.spectral_variance());
        }
        return this.result.spectral_standard_deviation;
    }

    spectral_skewness() {
        if (this.result.spectral_skewness === undefined) {
            this.result.spectral_skewness = xtract_spectral_skewness(this.data, this.spectral_centroid(), this.spectral_standard_deviation());
        }
        return this.result.spectral_skewness;
    }

    spectral_kurtosis() {
        if (this.result.spectral_kurtosis === undefined) {
            this.result.spectral_kurtosis = xtract_spectral_kurtosis(this.data, this.spectral_centroid(), this.spectral_standard_deviation());
        }
        return this.result.spectral_kurtosis;
    }

    irregularity_k () {
        if (this.result.irregularity_k === undefined) {
            this.result.irregularity_k = xtract_irregularity_k(this.data);
        }
        return this.result.irregularity_k;
    }

    irregularity_j () {
        if (this.result.irregularity_j === undefined) {
            this.result.irregularity_j = xtract_irregularity_j(this.data);
        }
        return this.result.irregularity_j;
    }

    tristimulus_1 () {
        if (this._f0 === undefined) {
            this.spectral_fundamental();
        }
        if (this.result.tristimulus_1 === undefined) {
            this.result.tristimulus_1 = xtract_tristimulus_1(this.data, this._f0);
        }
        return this.result.tristimulus_1;
    }
    tristimulus_2 () {
        if (this._f0 === undefined) {
            this.spectral_fundamental();
        }
        if (this.result.tristimulus_2 === undefined) {
            this.result.tristimulus_2 = xtract_tristimulus_2(this.data, this._f0);
        }
        return this.result.tristimulus_2;
    }
    tristimulus_3 () {
        if (this._f0 === undefined) {
            this.spectral_fundamental();
        }
        if (this.result.tristimulus_3 === undefined) {
            this.result.tristimulus_3 = xtract_tristimulus_3(this.data, this._f0);
        }
        return this.result.tristimulus_3;
    }

    smoothness() {
        if (this.result.smoothness === undefined) {
            this.result.smoothness = xtract_smoothness(this.data);
        }
        return this.result.smoothness;
    }

    rolloff(threshold) {
        if (this.result.rolloff === undefined) {
            this.result.rolloff = xtract_rolloff(this.data, this.sampleRate, threshold);
        }
        return this.result.rolloff;
    }

    loudness() {
        if (this.result.loudness === undefined) {
            this.result.loudness = xtract_loudness(this.bark_coefficients());
        }
        return this.result.loudness;
    }

    sharpness () {
        if (this.result.sharpness === undefined) {
            this.result.sharpness = xtract_sharpness(this.bark_coefficients());
        }
        return this.result.sharpness;
    }

    flatness () {
        if (this.result.flatness === undefined) {
            this.result.flatness = xtract_flatness(this.data);
        }
        return this.result.flatness;
    }

    flatness_db () {
        if (this.result.flatness_db === undefined) {
            this.result.flatness_db = xtract_flatness_db(this.data, this.flatness());
        }
        return this.result.flatness_db;
    }

    tonality() {
        if (this.result.tonality === undefined) {
            this.result.tonality = xtract_tonality(this.data, this.flatness_db());
        }
        return this.result.tonality;
    }

    spectral_crest_factor () {
        if (this.result.spectral_crest_factor === undefined) {
            this.result.spectral_crest_factor = xtract_crest(this._amps, this.maximum(), this.spectral_mean());
        }
        return this.result.spectral_crest_factor;
    }

    spectral_slope() {
        if (this.result.spectral_slope === undefined) {
            this.result.spectral_slope = xtract_spectral_slope(this.data);
        }
        return this.result.spectral_slope;
    }

    spectral_fundamental() {
        if (this.result.spectral_fundamental === undefined) {
            this.result.spectral_fundamental = xtract_spectral_fundamental(this.data, _Fs);
            this.f0 = this.result.spectral_fundamental;
        }
        return this.result.spectral_fundamental;
    }

    nonzero_count () {
        if (this.result.nonzero_count === undefined) {
            this.result.nonzero_count = xtract_nonzero_count(_amps);
        }
        return this.result.nonzero_count;
    }

    hps () {
        if (this.result.hps === undefined) {
            this.result.hps = xtract_hps(this.data);
        }
        return this.result.hps;
    }

    mfcc(num_bands, freq_min, freq_max) {
        if (this._mfcc === undefined) {
            if (freq_min === undefined) {
                throw ("Run init_mfcc(num_bands, freq_min, freq_max, style) first");
            } else {
                this._mfcc = this.init_mfcc(num_bands, freq_min, freq_max);
            }
        }
        if (this.result.mfcc === undefined) {
            this.result.mfcc = xtract_mfcc(this.data, this._mfcc);
        }
        return this.result.mfcc;
    }

    dct () {
        if (this._dct === undefined) {
            this._dct = this.createDctCoefficients(this._length);
        }
        if (this.result.dct === undefined) {
            this.result.dct = xtract_dct_2(this._amps,this._dct);
        }
        return this.result.dct;
    }

    bark_coefficients(num_bands) {
        if (this.result.bark_coefficients === undefined) {
            if (this._bark === undefined) {
                this._bark = this.init_bark(num_bands);
            }
            this.result.bark_coefficients = xtract_bark_coefficients(this.data, this._bark);
        }
        return this.result.bark_coefficients;
    }

    chroma(nbins, A440, f_ctr, octwidth) {
        if(this.result.chroma === undefined) {
            if (this._chroma === undefined) {
                this._chroma = this.init_chroma(nbins, A440, f_ctr, octwidth);
            }
            this.result.chroma = xtract_chroma(this.data, this._chroma);
        }
        return this.result.chroma;
    }

    peak_spectrum(threshold) {
        if (this.result.peak_spectrum === undefined) {
            this.result.peak_spectrum = new PeakSpectrumData(this._length, this.sampleRate, this);
            var ps = xtract_peak_spectrum(this.data, this.sampleRate / this._length, threshold);
            this.result.peak_spectrum.copyDataFrom(ps.subarray(0, this._length));
        }
        return this.result.peak_spectrum;
    }
}

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
