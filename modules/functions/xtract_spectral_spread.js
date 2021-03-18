/// <reference path="../../typings/functions.d.ts" />
import {xtract_spectral_variance} from "./xtract_spectral_variance";
export function xtract_spectral_spread(spectrum, spectral_centroid) {
    return xtract_spectral_variance(spectrum, spectral_centroid);
}
