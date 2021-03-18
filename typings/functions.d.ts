import { NumberArrayLike, XtractBarkCoefficients, XtractChromaFilters, XtractDCT, XtractDFT, XtractLowHigh, XtractMFCC, XtractPCP, XtractProcessFrameData, XtractProcessFrameDataResults, XtractWavelet } from "./common";

declare function xtract_amdf(array:NumberArrayLike):Float64Array;

declare function xtract_apply_window(X:NumberArrayLike, W:NumberArrayLike):Float64Array

declare function xtract_array_bound<T extends NumberArrayLike>(data:T, min?:number, max?:number):T

declare function xtract_array_copy<T extends NumberArrayLike>(src:T):T

declare function xtract_array_deinterlace<T extends NumberArrayLike>(data:T, num_arrays:number):Array<T>

declare function xtract_array_interlace<T extends NumberArrayLike>(data: Array<T>):T

declare function xtract_array_max(data:NumberArrayLike): number

declare function xtract_array_min(data:NumberArrayLike): number

declare function xtract_array_normalise<T extends NumberArrayLike>(data:T):T

declare function xtract_array_scale<T extends NumberArrayLike>(data:T, factor:number):T

declare function xtract_array_sum(data:NumberArrayLike): number

declare function xtract_array_to_JSON(data:NumberArrayLike): string

declare function xtract_asdf(array:NumberArrayLike):Float64Array;

declare function xtract_assert_array(array:unknown):boolean;

declare function xtract_assert_positive_integer(number:unknown):boolean;

declare function xtract_autocorrelation(array:NumberArrayLike):Float64Array;

declare function xtract_average_deviation(array:NumberArrayLike, mean?:number): number

declare function xtract_bark_coefficients(spectrum: NumberArrayLike, bark_limits: XtractBarkCoefficients): Float64Array

declare function xtract_chroma(spectrum: NumberArrayLike, chromaFilters: XtractChromaFilters): Float64Array

declare function xtract_complex_spectrum(array: NumberArrayLike, sample_rate: number, withDC?:boolean): Float64Array

declare function xtract_create_window(N: number, type: "hamming" | "welch" | "sine" | "hann"): Float64Array

declare function xtract_crest(data: NumberArrayLike, max?: number, mean?: number): number

declare function xtract_dct_2(array: NumberArrayLike, dct?: XtractDCT): Float64Array

declare function xtract_dct(array: NumberArrayLike): Float64Array

declare function xtract_energy(array: NumberArrayLike, sample_rate: number, window_ms?:number): number

declare function xtract_f0(timeArray: NumberArrayLike, sampleRate?: number): number

declare function xtract_failsafe_f0(timeArray: NumberArrayLike, sampleRate?: number): number

declare function xtract_flatness_db(spectrum: NumberArrayLike, flatness?: number): number

declare function xtract_flatness(spectrum: NumberArrayLike): number

declare function xtract_frame_from_array<T extends NumberArrayLike>(src: T, dst: T, index: number, frame_size: number, hop_size?:number): T
declare function xtract_frame_from_array<T extends NumberArrayLike, I extends NumberArrayLike>(src: I, dst: T, index: number, frame_size: number, hop_size?:number): T

declare function xtract_get_data_frames(data: NumberArrayLike, frame_size:number, hop_size:number, copy:boolean): Float64Array[]

declare function xtract_get_number_of_frames(data: NumberArrayLike, hop_size: number): number

declare function xtract_harmonic_spectrum(peakSpectrum: NumberArrayLike, f0: number, threshold: number): Float64Array

declare function xtract_highest_value(data: NumberArrayLike, threshold?: number): number

declare function xtract_hps(spectrum: NumberArrayLike): number

declare function xtract_init_bark(N: number, sampleRate: number, bands?: number): XtractBarkCoefficients

declare function xtract_init_chroma(N: number, sampleRate: number, nbins?: number, A440?: number, f_ctr?: number, octwidth?: number): XtractChromaFilters

declare function xtract_init_dct(N:number): XtractDCT

declare function xtract_init_mfcc(N: number, nyquist: number, style: number, freq_min: number, freq_max: number, freq_bands: number): XtractMFCC

declare function xtract_init_dft(N: number): XtractDFT

declare function xtract_init_pcp(N: number, fs: number, f_ref?: number): XtractPCP

declare function xtract_init_wavelet(): XtractWavelet

declare function xtract_irregularity_j(spectrum: NumberArrayLike): number

declare function xtract_irregularity_k(spectrum: NumberArrayLike): number

declare function xtract_is_denormal(num:number): boolean

declare function xtract_kurtosis(array: NumberArrayLike, mean?:number, standard_deviation?:number): number

declare function xtract_loudness(barkBandsArray: Float64Array): number

declare function xtract_lowest_value(data: NumberArrayLike, threshold?: number): number

declare function xtract_lowhigh(data: NumberArrayLike, threshold?: number): XtractLowHigh

declare function xtract_lpc(autocorr: NumberArrayLike): Float64Array 

declare function xtract_lpcc(lpc: NumberArrayLike, Q?: number): Float64Array

declare function xtract_mean(array: NumberArrayLike): number

declare function xtract_mfcc(spectrum: NumberArrayLike, mfcc: XtractMFCC): Float64Array

declare function xtract_midicent(f0: number): number

declare function xtract_noisiness(h:number, p: number): number

declare function xtract_nonzero_count(data: NumberArrayLike): number

declare function xtract_odd_even_ratio(harmonicSpectrum: NumberArrayLike, f0: number): number

declare function xtract_onset<T extends NumberArrayLike>(timeData: T, frameSize: number): T

declare function xtract_pcp(spectrum: NumberArrayLike, M?: XtractPCP, fs?: number): Float64Array

declare function xtract_peak_spectrum(spectrum: NumberArrayLike, q: number, threshold: number): Float64Array

declare function xtract_power(magnitudeArray: NumberArrayLike): null

declare function xtract_process_frame_data<T>(array: NumberArrayLike, func: (data: XtractProcessFrameData, prev_data: XtractProcessFrameData, prev_result: T) => T, sample_rate: number, frame_size: number, hop_size: number, arg_this: any): XtractProcessFrameDataResults

declare function xtract_resample(data:NumberArrayLike, p: number, q: number, n: number): Float64Array

declare function xtract_rms_amplitude(timeArray: NumberArrayLike): number

declare function xtract_rolloff(spectrum: NumberArrayLike, sampleRate: number, threshold: number): number

declare function xtract_sharpness(barkBandsArray: Float64Array): number

declare function xtract_skewness_kurtosis(array:NumberArrayLike, mean?: number, standard_deviation?: number): [number, number]

declare function xtract_skewness(array:NumberArrayLike, mean?: number, standard_deviation?: number): number

declare function xtract_smoothness(spectrum: NumberArrayLike): number

declare function xtract_spectral_centroid(spectrum: NumberArrayLike): number

declare function xtract_spectral_fundamental(spectrum: NumberArrayLike, sample_rate: number): number

declare function xtract_spectral_inharmonicity(peakSpectrum: NumberArrayLike, f0: number): number

declare function xtract_spectral_kurtosis(spectrum: NumberArrayLike, spectral_centroid?: number, spectral_standard_deviation?: number): number

declare function xtract_spectral_mean(spectrum: NumberArrayLike): number

declare function xtract_spectral_skewness(spectrum: NumberArrayLike, spectral_centroid?: number, spectral_standard_deviation?: number): number

declare function xtract_spectral_slope(spectrum: NumberArrayLike): number

declare function xtract_spectral_spread(spectrum: NumberArrayLike, spectral_centroid?: number): number

declare function xtract_spectral_standard_deviation(spectrum: NumberArrayLike, spectral_variance?: number): number

declare function xtract_spectral_variance(spectrum: NumberArrayLike, spectral_centroid?: number): number

declare function xtract_spectrum(array: NumberArrayLike, sample_rate: number, withDC?: boolean, normalise?: boolean): Float64Array

declare function xtract_standard_deviation(array: NumberArrayLike, variance?: number): number

declare function xtract_sum(data: NumberArrayLike): number

declare function xtract_temporal_centroid(energyArray: NumberArrayLike, sample_rate: number, window_ms?: number): number

declare function xtract_tonality(spectrum: NumberArrayLike, flatness_db?: number): number

declare function xtract_tristimulus_1(spectrum: NumberArrayLike, f0: number): number
declare function xtract_tristimulus_2(spectrum: NumberArrayLike, f0: number): number
declare function xtract_tristimulus_3(spectrum: NumberArrayLike, f0: number): number

declare function xtract_variance(array: NumberArrayLike, mean?: number): number

declare function xtract_wavelet_f0(timeArray: NumberArrayLike, sampleRate: number, pitchtracker: XtractWavelet): number

declare function xtract_yin(array: NumberArrayLike): number

declare function xtract_zcr(timeArray: NumberArrayLike): number