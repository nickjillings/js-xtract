/// <reference path="../../typings/objects/PeakSpectrumData.d.ts" />
import {SpectrumData} from "./SpectrumData";
import {HarmonicSpectrumData} from "./HarmonicSpectrumData";
import {xtract_spectral_inharmonicity} from "../functions/xtract_spectral_inharmonicity";
import {xtract_harmonic_spectrum} from "../functions/xtract_harmonic_spectrum";


export class PeakSpectrumData extends SpectrumData {
    spectral_inharmonicity() {
        if (this.result.spectral_inharmonicity === undefined) {
            this.result.spectral_inharmonicity = xtract_spectral_inharmonicity(this.data, this.sampleRate);
        }
        return this.result.spectral_inharmonicity;
    }

    harmonic_spectrum(threshold) {
        if (this.result.harmonic_spectrum === undefined) {
            if (this.f0 === undefined) {
                this.spectral_fundamental(this.data, this.sampleRate);
            }
            this.result.harmonic_spectrum = new HarmonicSpectrumData(this.length, this.sampleRate, this);
            var hs = xtract_harmonic_spectrum(this.data, this.f0, threshold);
            this.result.harmonic_spectrum.copyDataFrom(hs.subarray(0, this.length));
        }
        return this.result.harmonic_spectrum;
    }
}

PeakSpectrumData.prototype.features = SpectrumData.prototype.features.concat([
    {
        name: "Spectral Inharmonicity",
        function: "spectral_inharmonicity",
        sub_features: ["f0"],
        parameters: [],
        returns: "number"
}, {
        name: "Harmonic Spectrum",
        function: "harmonic_spectrum",
        sub_features: [],
        parameters: [{
            name: "Threshold",
            unit: "",
            type: "number",
            minimum: 0,
            maximum: 100,
            default: 30
    }],
        returns: "HarmonicSpectrumData"
}]);
