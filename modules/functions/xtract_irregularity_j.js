/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_array} from "./xtract_assert_array";
export function xtract_irregularity_j(spectrum) {
    if (!xtract_assert_array(spectrum))
        return 0;
    var num = 0,
        den = 0;
    var N = spectrum.length;
    var K = N >> 1;
    var amps = spectrum.subarray(0, K);
    for (var n = 0; n < K - 1; n++) {
        num += Math.pow(amps[n] - amps[n + 1], 2);
        den += Math.pow(amps[n], 2);
    }
    return num / den;
}
