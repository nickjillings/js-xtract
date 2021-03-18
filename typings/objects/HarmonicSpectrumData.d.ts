import { PeakSpectrumData, PeakSpectrumDataResults } from "./PeakSpectrumData";
import { SpectrumData } from "./SpectrumData";

declare interface HarmonicSpectrumDataResults extends PeakSpectrumDataResults {
    odd_even_ratio: number
    noisiness: number
}

declare class HarmonicSpectrumData extends SpectrumData {
    public results: HarmonicSpectrumDataResults
    constructor(N: number, sampleRate: number, parent?: PeakSpectrumData)

    odd_even_ratio(): number
    noisiness(): number
}