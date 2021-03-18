/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_array} from "./xtract_assert_array";
import {inverseTransform} from "../freeFFT.js";
function peak_picking(E, window) {
    var o = [],
        N = E.length,
        n;
    if (window === undefined) {
        window = 5;
    }
    for (n = window; n < N - window - 1; n++) {
        var max = 1,
            m;
        for (m = -window; m < window - 1; m++) {
            if (E[n + m] > E[n]) {
                max = 0;
                break;
            }
        }
        if (max === 1) {
            o.push(n);
        }
    }
    return o;
}

export function xtract_spectral_fundamental(spectrum, sample_rate) {
    // Based on work by Motegi and Shimamura
    if (!xtract_assert_array(spectrum))
        return 0;

    var N = spectrum.length >> 1;
    var amps = spectrum.subarray(0, N);
    var freqs = spectrum.subarray(N);
    var K = N * 2;

    // Create the power spectrum
    var power = new Float64Array(K);
    var n;
    for (n = 0; n < N; n++) {
        power[n] = Math.pow(amps[n], 2);
        power[K - 1 - n] = power[n];
    }

    // Perform autocorrelation using IFFT
    var R = new Float64Array(K);
    inverseTransform(power, R);
    R = undefined;
    R = power;
    power = undefined;

    // Get the peaks
    var p = peak_picking(R, 5);
    if (p.length === 0) {
        return 0;
    }
    p = p[0];

    p = p / sample_rate;
    p = 1 / p;
    return p;
}
