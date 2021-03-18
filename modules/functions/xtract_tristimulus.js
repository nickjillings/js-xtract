/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_array} from "./xtract_assert_array";
export function xtract_tristimulus(spectrum, f0) {
    var trist = [0.0, 0.0, 0.0];
    if (!xtract_assert_array(spectrum))
        return trist;
    if (typeof f0 !== "number") {
        throw ("xtract_tristimulus requires f0 to be defined and a number");
    }
    var h = 0,
        den = 0.0,
        p = [0, 0, 0, 0, 0],
        temp = 0.0,
        num = 0.0;
    var N = spectrum.length;
    var K = N >> 1;
    var amps = spectrum.subarray(0, K);
    var freqs = spectrum.subarray(K);

    for (var i = 0; i < K; i++) {
        temp = amps[i];
        if (temp !== 0) {
            den += temp;
            h = Math.floor(freqs[i] / f0 + 0.5);
            p[h - 1] += temp;
        }
    }

    if (den !== 0.0) {
        trist[0] = p[0] / den;
        trist[1] = (p[1] + p[2] + p[3]) / den;
        trist[2] = p[4] / den;
    }
    return trist;
}

export function xtract_tristimulus_1(spectrum, f0) {
    return xtract_tristimulus(spectrum, f0)[0];
}

export function xtract_tristimulus_2(spectrum, f0) {
    return xtract_tristimulus(spectrum, f0)[1];
}

export function xtract_tristimulus_3(spectrum, f0) {
    return xtract_tristimulus(spectrum, f0)[2];
}
