/// <reference path="../../typings/objects/PeakSpectrumData.d.ts" />
import {PeakSpectrumData} from "./PeakSpectrumData";
import {xtract_odd_even_ratio} from "../functions/xtract_odd_even_ratio";
import {xtract_noisiness} from "../functions/xtract_noisiness";

export class HarmonicSpectrumData extends PeakSpectrumData {
    odd_even_ratio () {
        if (this.result.odd_even_ratio === undefined) {
            if (this.f0 === undefined) {
                this.spectral_fundamental(this.data, this.sampleRate);
            }
            this.result.odd_even_ratio = xtract_odd_even_ratio(this.data, this.f0);
        }
        return this.result.odd_even_ratio;
    }

    noisiness() {
        if (parent.constructor !== PeakSpectrumData) {
            this.result.noisiness = null;
        } else {
            this.result.noisiness = xtract_noisiness(this.nonzero_count(), parent.nonzero_count());
        }
        return this.result.noisiness;
    }
}

HarmonicSpectrumData.prototype.features = PeakSpectrumData.prototype.features.concat([
    {
        name: "Odd Even Ration",
        function: "odd_even_ratio",
        sub_features: [],
        parameters: [],
        returns: "number"
    },
    {
        name: "Noisiness",
        function: "noisiness",
        sub_features: [],
        parameters: [],
        returns: "number"
    }
]);
