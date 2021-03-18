/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_array} from "./xtract_assert_array";

export function xtract_flatness(spectrum) {
    if (!xtract_assert_array(spectrum))
        return 0;
    var count = 0,
        denormal_found = false,
        num = 1.0,
        den = 0.0,
        temp = 0.0;
    var N = spectrum.length;
    var K = N >> 1;
    var amps = spectrum.subarray(0, K);
    for (var n = 0; n < K; n++) {
        temp = Math.max(1e-32, amps[n]);
        num *= temp;
        den += temp;
        count++;
    }
    if (count === 0) {
        return 0;
    }
    num = Math.pow(num, 1.0 / count);
    den /= count;

    return num / den;
}
