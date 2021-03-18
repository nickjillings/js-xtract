/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_array} from "./xtract_assert_array";
import {xtract_spectral_centroid} from "./xtract_spectral_centroid";
import {xtract_array_sum} from "./xtract_array_sum";
export function xtract_spectral_variance(spectrum, spectral_centroid) {
    if (!xtract_assert_array(spectrum))
        return 0;
    if (typeof spectral_centroid !== "number") {
        spectral_centroid = xtract_spectral_centroid(spectrum);
    }
    var A = 0,
        result = 0;
    var N = spectrum.length;
    var n = N >> 1;
    var amps = spectrum.subarray(0, n);
    var freqs = spectrum.subarray(n, N);
    var A_d = xtract_array_sum(amps);
    while (n--) {
        result += Math.pow(freqs[n] - spectral_centroid, 2) * (amps[n] / A_d);
    }
    return result;
}
