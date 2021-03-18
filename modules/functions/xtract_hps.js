/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_array} from "./xtract_assert_array";

function get_peak_index(M, amps) {
    var peak_index = 0,
        peak = 0,
        i;
    var tempProduct = new Float64Array(M);
    tempProduct.forEach(function (e, i, a) {
        a[i] = amps[i] * amps[i * 2] * amps[i * 3];
    });
    tempProduct.forEach(function (v, i) {
        if (v > peak) {
            peak = v;
            peak_index = i;
        }
    });
    return peak_index;
}

export function xtract_hps(spectrum) {
    if (!xtract_assert_array(spectrum))
        return 0;
    var peak_index = 0,
        position1_lwr = 0,
        largest1_lwr = 0,
        ratio1 = 0;
    var N = spectrum.length;
    var K = N >> 1;
    var amps = spectrum.subarray(0, K);
    var freqs = spectrum.subarray(K);
    var M = Math.ceil(K / 3.0);
    var i;
    if (M <= 1) {
        throw ("Input Data is too short for HPS");
    }

    peak_index = get_peak_index(M, amps);

    for (i = 0; i < K; i++) {
        if (amps[i] > largest1_lwr && i !== peak_index) {
            largest1_lwr = amps[i];
            position1_lwr = i;
        }
    }

    ratio1 = amps[position1_lwr] / amps[peak_index];

    if (position1_lwr > peak_index * 0.4 && position1_lwr < peak_index * 0.6 && ratio1 > 0.1)
        peak_index = position1_lwr;

    return freqs[peak_index];
}
