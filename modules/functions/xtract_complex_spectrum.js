/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_array} from "./xtract_assert_array";
import {transform} from "../freeFFT";

export function xtract_complex_spectrum(array, sample_rate, withDC) {
    if (!xtract_assert_array(array))
        return 0;
    if (typeof sample_rate !== "number") {
        console.error("Sample Rate must be defined");
        return null;
    }
    if (withDC === undefined) {
        withDC = false;
    }
    var N = array.length;
    var result, align = 0,
        amps, freqs;
    if (withDC) {
        result = new Float64Array(3 * (N / 2 + 1));
    } else {
        align = 1;
        result = new Float64Array(3 * (N / 2));
    }
    amps = result.subarray(0, 2 * (result.length / 3));
    freqs = result.subarray(2 * (result.length / 3));
    var reals = new Float64Array(N);
    var imags = new Float64Array(N);
    for (var i = 0; i < N; i++) {
        reals[i] = array[i];
    }
    transform(reals, imags);
    for (var k = align; k <= reals.length / 2; k++) {
        amps[(k - align) * 2] = reals[k];
        amps[(k - align) * 2 + 1] = imags[k];
        freqs[k - align] = (2 * k / N) * (sample_rate / 2);
    }
    return result;
}
