/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_array} from "./xtract_assert_array";

export function xtract_irregularity_k(spectrum) {
    if (!xtract_assert_array(spectrum))
        return 0;
    var result = 0;
    var N = spectrum.length;
    var K = N >> 1;
    var amps = spectrum.subarray(0, K);
    for (var n = 1; n < K - 1; n++) {
        result += Math.abs(Math.log10(amps[n]) - Math.log10(amps[n - 1] + amps[n] + amps[n + 1]) / 3);
    }
    return result;
}
