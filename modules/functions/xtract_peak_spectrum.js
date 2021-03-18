/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_array} from "./xtract_assert_array";
import {xtract_array_max} from "./xtract_array_max";

export function xtract_peak_spectrum(spectrum, q, threshold) {
    if (!xtract_assert_array(spectrum))
        return 0;
    var N = spectrum.length;
    var K = N >> 1;
    var max = 0.0,
        y = 0.0,
        y2 = 0.0,
        y3 = 0.0,
        p = 0.0;
    if (typeof q !== "number") {
        throw ("xtract_peak_spectrum requires second argument to be sample_rate/N");
    }
    if (threshold < 0 || threshold > 100) {
        threshold = 0;
    }
    var result = new Float64Array(N);
    var ampsIn = spectrum.subarray(0, K);
    var freqsIn = spectrum.subarray(K);
    var ampsOut = result.subarray(0, K);
    var freqsOut = result.subarray(K);
    max = xtract_array_max(ampsIn);
    threshold *= 0.01 * max;
    for (var n = 1; n < N - 1; n++) {
        if (ampsIn[n] >= threshold) {
            if (ampsIn[n] > ampsIn[n - 1] && ampsIn[n] > ampsIn[n + 1]) {
                y = ampsIn[n - 1];
                y2 = ampsIn[n];
                y3 = ampsIn[n + 1];
                p = 0.5 * (y - y3) / (ampsIn[n - 1] - 2 * (y2 + ampsIn[n + 1]));
                freqsOut[n] = q * (n + 1 + p);
                ampsOut[n] = y2 - 0.25 * (y - y3) * p;
            } else {
                ampsOut[n] = 0;
                freqsOut[n] = 0;
            }
        } else {
            ampsOut[n] = 0;
            freqsOut[n] = 0;
        }
    }
    return result;
}
