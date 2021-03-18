/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_array} from "./xtract_assert_array";
import {xtract_spectral_variance} from "./xtract_spectral_variance";
export function xtract_spectral_standard_deviation(spectrum, spectral_variance) {
    if (!xtract_assert_array(spectrum))
        return 0;
    if (typeof spectral_variance !== "number") {
        spectral_variance = xtract_spectral_variance(spectrum);
    }
    return Math.sqrt(spectral_variance);
}
