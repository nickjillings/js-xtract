import { NumberArrayLike, XtractDCT, XtractResult } from "../common";

declare class DataPrototype {
    public data: Float64Array
    public result: XtractResult

    constructor(N: number, sampleRate: number) {}

    get sampleRate(): number
    set sampleRate(fs: number)

    clearResult(): void
    getData(): Float64Array
    zeroDataRange(start: number, end: number): void
    zeroData(): void
    copyDataFrom(src: NumberArrayLike, N?: number, offset?: number): void
    duplicate(): DataPrototype
    toJSON(): string
    computeDelta(compare: DataPrototype): XtractResult
    computeDeltaDelta(compare: DataPrototype): XtractResult

    createDctCoefficients(N: number): XtractDCT
    createMfccCoefficients(N: number, nyquist: number, style: number, freq_min: number, freq_max: number, freq_bands: number): XtractMFCC
    createBarkCoefficients(N: number, sampleRate: number, bands?: number): XtractBarkCoefficients
    createChromaCoefficients(N: number, sampleRate: number, nbins?: number, A440?: number, f_ctr?: number, octwidth?: number): XtractChromaFilters
}