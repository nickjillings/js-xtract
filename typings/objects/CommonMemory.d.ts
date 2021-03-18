import { XtractBarkCoefficients, XtractChromaFilters, XtractDCT, XtractMFCC } from "../common";

declare function createDctCoefficients(N: number): XtractDCT

declare function createMfccCoefficients(N: number, nyquist: number, style: number, freq_min: number, freq_max: number, freq_bands: number): XtractMFCC

declare function createBarkCoefficients(N: number, sampleRate: number, bands?: number): XtractBarkCoefficients

declare function createChromaCoefficients(N: number, sampleRate: number, nbins?: number, A440?: number, f_ctr?: number, octwidth?: number): XtractChromaFilters