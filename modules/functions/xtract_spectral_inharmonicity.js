/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_array} from "./xtract_assert_array";

export function xtract_spectral_inharmonicity(peakSpectrum, f0) {
    if (!xtract_assert_array(peakSpectrum))
        return 0;
    if (typeof f0 !== "number") {
        console.error("spectral_inharmonicity requires f0 to be defined.");
        return null;
    }
    var h = 0,
        num = 0.0,
        den = 0.0;
    var N = peakSpectrum.length;
    var K = N >> 1;
    var amps = peakSpectrum.subarray(0, n);
    var freqs = peakSpectrum.subarray(n);
    for (var n = 0; n < K; n++) {
        if (amps[n] !== 0.0) {
            h = Math.floor(freqs[n] / f0 + 0.5);
            var mag_sq = Math.pow(amps[n], 2);
            num += Math.abs(freqs[n] - h * f0) * mag_sq;
            den += mag_sq;
        }
    }
    return (2 * num) / (f0 * den);
}
