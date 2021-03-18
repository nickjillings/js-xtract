/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_array} from "./xtract_assert_array";
import {xtract_array_sum} from "./xtract_array_sum";

export function xtract_spectral_mean(spectrum) {
    if (!xtract_assert_array(spectrum))
        return 0;
    var N = spectrum.length;
    var n = N >> 1;
    var amps = spectrum.subarray(0, n);
    var sum = xtract_array_sum(amps);
    var result = sum / n;
    return result;
}
