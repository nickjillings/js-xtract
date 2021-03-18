/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_array} from "./xtract_assert_array";
import {xtract_spectral_centroid} from "./xtract_spectral_centroid";
import {xtract_spectral_standard_deviation} from "./xtract_spectral_standard_deviation";
import {xtract_spectral_variance} from "./xtract_spectral_variance";
import {xtract_array_sum} from "./xtract_array_sum";

export function xtract_spectral_skewness(spectrum, spectral_centroid, spectral_standard_deviation) {
    if (!xtract_assert_array(spectrum))
        return 0;
    if (typeof spectral_mean !== "number") {
        spectral_centroid = xtract_spectral_centroid(spectrum);
    }
    if (typeof spectral_standard_deviation !== "number") {
        spectral_standard_deviation = xtract_spectral_standard_deviation(spectrum, xtract_spectral_variance(spectrum, spectral_centroid));
    }
    if (spectral_standard_deviation === 0) {
        return 0;
    }
    var result = 0;
    var N = spectrum.length;
    var K = N >> 1;
    var amps = spectrum.subarray(0, K);
    var freqs = spectrum.subarray(K);
    var A_d = xtract_array_sum(amps);
    for (var n = 0; n < K; n++) {
        result += Math.pow(freqs[n] - spectral_centroid, 3) * (amps[n] / A_d);
    }
    result /= Math.pow(spectral_standard_deviation, 3);
    return result;
}
