/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_array} from "./xtract_assert_array";

export function xtract_harmonic_spectrum(peakSpectrum, f0, threshold) {
    if (!xtract_assert_array(peakSpectrum))
        return 0;
    var N = peakSpectrum.length;
    var K = N >> 1;
    var result = new Float64Array(N);
    var ampsIn = peakSpectrum.subarray(0, K);
    var freqsIn = peakSpectrum.subarray(K);
    var ampsOut = result.subarray(0, K);
    var freqsOut = result.subarray(K);
    var n = K;
    if (f0 === undefined || threshold === undefined) {
        throw ("harmonic_spectrum requires f0 and threshold to be numbers and defined");
    }
    if (threshold > 1) {
        threshold /= 100.0;
    }
    while (n--) {
        if (freqsIn[n] !== 0.0) {
            var ratio = freqsIn[n] / f0;
            var nearest = Math.round(ratio);
            var distance = Math.abs(nearest - ratio);
            if (distance > threshold) {
                ampsOut[n] = 0.0;
                freqsOut[n] = 0.0;
            } else {
                ampsOut[n] = ampsIn[n];
                freqsOut[n] = freqsIn[n];
            }
        } else {
            result[n] = 0.0;
            freqsOut[n] = 0.0;
        }
    }
    return result;
}
