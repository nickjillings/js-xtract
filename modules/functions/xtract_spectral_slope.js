/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_array} from "./xtract_assert_array";
import {xtract_array_sum} from "./xtract_array_sum";

export function xtract_spectral_slope(spectrum) {
    if (!xtract_assert_array(spectrum))
        return 0;
    var F = 0.0,
        FA = 0.0,
        A = 0.0,
        FXTRACT_SQ = 0.0;
    var N = spectrum.length;
    var M = N >> 1;
    var amps = spectrum.subarray(0, M);
    var freqs = spectrum.subarray(M);
    F = xtract_array_sum(freqs);
    A = xtract_array_sum(amps);
    for (var n = 0; n < M; n++) {
        FA += freqs[n] * amps[n];
        FXTRACT_SQ += freqs[n] * freqs[n];
    }
    return (1.0 / A) * (M * FA - F * A) / (M * FXTRACT_SQ - F * F);
}
