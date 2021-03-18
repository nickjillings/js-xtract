/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_array} from "./xtract_assert_array";

export function xtract_smoothness(spectrum) {
    if (!xtract_assert_array(spectrum))
        return 0;
    var prev = 0,
        current = 0,
        next = 0,
        temp = 0;
    var N = spectrum.length;
    var K = N >> 1;
    prev = Math.max(1e-5, spectrum[0]);
    current = Math.max(1e-5, spectrum[1]);
    for (var n = 1; n < K - 1; n++) {
        next = Math.max(1e-5, spectrum[n + 1]);
        temp += Math.abs(20.0 * Math.log(current) - (20.0 * Math.log(prev) + 20.0 * Math.log(current) + 20.0 * Math.log(next)) / 3.0);
        prev = current;
        current = next;
    }
    return temp;
}
