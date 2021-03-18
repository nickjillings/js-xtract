/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_array} from "./xtract_assert_array";
import {xtract_array_sum} from "./xtract_array_sum";

export function xtract_rolloff(spectrum, sampleRate, threshold) {
    if (!xtract_assert_array(spectrum))
        return 0;
    if (typeof sampleRate !== "number" || typeof threshold !== "number") {
        console.log("xtract_rolloff requires sampleRate and threshold to be defined");
        return null;
    }
    var N = spectrum.length;
    var K = N >> 1;
    var amps = spectrum.subarray(0, K);

    var pivot = 0,
        temp = 0;

    pivot = xtract_array_sum(amps);

    pivot *= threshold / 100.0;
    var n = 0;
    while (temp < pivot) {
        temp += amps[n];
        n++;
    }
    return n * (sampleRate / (spectrum.length));
}
