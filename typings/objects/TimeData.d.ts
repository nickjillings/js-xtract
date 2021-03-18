import { XtractResult } from "../common";
import { SpectrumData } from "./SpectrumData";

declare interface TimeDataResults extends XtractResult {
    minimum?: number
    maximum?: number
    sum?: number
    mean?: number
    temporal_centroid?: number
    variance?: number
    standard_deviation?: number
    average_deviation?: number
    skewness?: number
    kurtosis?: number
    zcr?: number
    crest_factor?: number
    rms_amplitude?: number
    lowest_value?: number
    highest_value?: number
    f0?: number
    energy?: {data: Float64Array, window_ms: number}
    spectrum?: SpectrumData
    dct?: Float64Array
    autocorrelation?: Float64Array
    amdf?: Float64Array
    asdf?: Float64Array
    yin?: number
    onset?: {data: Float64Array, frameSize: number}
}

declare class TimeData extends DataPrototype {
    public results: TimeDataResults
    constructor(input: TimeData | Float32Array | Float64Array | number, sampleRate?: number) {}

    getFrames(frameSize: number, hopSize?: number): TimeData[];
    minimum(): number
    maximum(): number
    sum(): number
    mean(): number
    temporal_centroid(window_ms): number
    variance(): number
    standard_deviation(): number
    average_deviation(): number
    skewness(): number
    kurtosis(): number
    zcr(): number
    crest_factor(): number
    rms_amplitude(): number
    lowest_value(threshold?: number): number
    highest_value(): number
    f0(): number
    energy(window_ms): {data: Float64Array, window_ms: number}
    spectrum(): SpectrumData
    dct(): Float64Array
    autocorrelation(): Float64Array
    amdf(): Float64Array
    asdf(): Float64Array
    yin(): number
    onset(frameSize:number): { data: Float64Array, frameSize: number}
    resample(targetSampleRate: number): TimeData
}