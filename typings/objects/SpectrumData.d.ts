import { XtractBarkCoefficients, XtractChromaFilters, XtractMFCC } from "../common";
import { DataPrototype } from "./DataPrototype";
import { PeakSpectrumData } from "./PeakSpectrumData";

declare interface SpectrumDataResults extends XtractResult {
    maximum: number
    minimum: number
    sum: number
    spectral_centroid: number
    spectral_mean: number
    spectral_variance: number
    spectral_spread: number
    spectral_standard_deviation: number
    spectral_skewness: number
    spectral_kurtosis: number
    irregularity_k: number
    irregularity_j: number
    tristimulus_1: number
    tristimulus_2: number
    tristimulus_3: number
    smoothness: number
    rolloff: number
    loudness: number
    sharpness: number
    flatness: number
    flatness_db: number
    tonality: number
    spectral_crest_factor: number
    spectral_slope: number
    spectral_fundamental: number
    nonzero_count: number
    hps: number
    mfcc: Float64Array
    dct: Float64Array
    bark_coefficients: Float64Array
    chroma: Float64Array
    peak_spectrum: PeakSpectrumData
}

declare class SpectrumData extends DataPrototype {
    public results: SpectrumDataResults
    constructor(N: number, sampleRate: number, parent?: TimeData)

    computeFrequencies(): void
    
    get f0(): number
    set f0(f0: number)

    get length(): number

    init_mfcc(num_bands: number, freq_min: number, freq_max: number, style: string): XtractMFCC
    init_bark(numBands?: number): XtractBarkCoefficients
    init_chroma(nbins?: number, A440?: number, f_ctr?: number, octwidth?: number): XtractChromaFilters
    minimum(): number
    maximum(): number
    sum(): number
    spectral_centroid(): number
    spectral_mean(): number
    spectral_variance(): number
    spectral_spread(): number
    spectral_standard_deviation(): number
    spectral_skewness(): number
    spectral_kurtosis(): number
    irregularity_k(): number
    irregularity_j(): number
    tristimulus_1(): number
    tristimulus_2(): number
    tristimulus_3(): number
    smoothness(): number
    rolloff(threshold: number): number
    loudness(): number
    sharpness(): number
    flatness(): number
    flatness_db(): number
    tonality(): number
    spectral_crest_factor(): number
    spectral_slope(): number
    spectral_fundamental(): number
    nonzero_count(): number
    hps(): number
    mfcc(num_bands: number, freq_min: number, freq_max: number): Float64Array
    dct(): Float64Array
    bark_coefficients(num_bands: number): Float64Array
    chroma(nbins?: number, A440?: number, f_ctr?: number, octwidth?: number): Float64Array
    peak_spectrum(threshold: number): PeakSpectrumData
}