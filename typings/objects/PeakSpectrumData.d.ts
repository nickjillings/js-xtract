import { HarmonicSpectrumData } from "./HarmonicSpectrumData";
import { SpectrumData, SpectrumDataResults } from "./SpectrumData";

declare interface PeakSpectrumDataResults extends SpectrumDataResults {
    spectral_inharmonicity: number
    harmonic_spectrum: HarmonicSpectrumData
}

declare class PeakSpectrumData extends SpectrumData {
    public results: PeakSpectrumDataResults
    constructor(N: number, sampleRate: number, parent?: SpectrumData)

    spectral_inharmonicity(): number
    harmonic_spectrum(threshold: number): HarmonicSpectrumData
}