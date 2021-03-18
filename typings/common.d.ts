export type NumberArrayLike =   Array<number> |
                                Float32Array |
                                Float64Array |
                                Int8Array |
                                Uint8Array |
                                Uint8ClampedArray |
                                Int16Array |
                                Uint16Array |
                                Int32Array |
                                Uint32Array |
                                BigInt64Array |
                                BigUint64Array;

export type XtractBarkCoefficients = Int32Array;
export interface XtractChromaFilters {
    wts: Float64Array,
    nfft: number,
    nbins: number,
}

export interface XtractDCT {
    N: number
    wt: Float64Array[]
}

export interface XtractMFCC {
    n_filters: number,
    filters: Float64Array[]
}

export interface XtractDFT {
    N: number,
    real: Float64Array[],
    imag: Float64Array[]
}

export type XtractPCP = Float64Array;

export interface XtractWavelet {
    _prevPitch: number,
    _pitchConfidence: number
}

export interface XtractLowHigh {
    min: number,
    max: number
}

interface TimeData {}
interface SpectrumData {}

export interface XtractProcessFrameData {
    frame_size: number,
    hop_size: number,
    sample_rate: number,
    TimeData: TimeData,
    SpectrumData: SpectrumData
}

export interface XtractProcessFrameDataResults<T> {
    num_frames: number,
    results: [{
        time_start: number,
        result: T
    }]
}

export interface XtractResult {
    [key: string]: any,
    delta?: XtractResult
}