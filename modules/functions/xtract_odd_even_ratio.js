/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_array} from "./xtract_assert_array";

export function xtract_odd_even_ratio(harmonicSpectrum, f0) {
    if (!xtract_assert_array(harmonicSpectrum))
        return 0;
    (function (f0) {
        if (typeof f0 !== "number") {
            throw ("spectral_inharmonicity requires f0 to be defined.");
        }
    })(f0);
    var h = 0,
        odd = 0.0,
        even = 0.0,
        temp;
    var N = harmonicSpectrum.length;
    var K = N >> 1;
    var amps = harmonicSpectrum.subarray(0, n);
    var freqs = harmonicSpectrum.subarray(n);
    for (var n = 0; n < K; n++) {
        temp = amps[n];
        if (temp !== 0.0) {
            h = Math.floor(freqs[n] / f0 + 0.5);
            if (h % 2 !== 0) {
                odd += temp;
            } else {
                even += temp;
            }
        }
    }

    if (odd === 0.0 || even === 0.0) {
        return 0.0;
    }
    return odd / even;
}
