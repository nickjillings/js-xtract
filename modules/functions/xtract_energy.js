/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_array} from "./xtract_assert_array";
import {xtract_rms_amplitude} from "./xtract_rms_amplitude";

export function xtract_energy(array, sample_rate, window_ms) {
    if (!xtract_assert_array(array))
        return 0;
    if (typeof sample_rate !== "number") {
        console.error("xtract_energy requires sample_rate to be defined");
        return;
    }
    if (typeof window_ms !== "number") {
        window_ms = 100;
    }
    if (window_ms <= 0) {
        window_ms = 100;
    }
    var N = array.length;
    var L = Math.floor(sample_rate * (window_ms / 1000.0));
    var K = Math.ceil(N / L);
    var result = new Float64Array(K);
    for (var k = 0; k < K; k++) {
        var frame = array.subarray(k * L, k * L + L);
        var rms = xtract_rms_amplitude(frame);
        result[k] = rms;
    }
    return result;
}
