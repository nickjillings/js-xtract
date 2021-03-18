/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_array} from "./xtract_assert_array";

export function xtract_lpc(autocorr) {
    if (!xtract_assert_array(autocorr))
        return 0;
    var i, j, r, error = autocorr[0];
    var N = autocorr.length;
    var L = N - 1;
    var lpc = new Float64Array(L);
    var ref = new Float64Array(L);
    if (error === 0.0) {
        return lpc;
    }

    (function () {
        for (i = 0; i < L; i++) {
            r = -autocorr[i + 1];
            for (j = 0; j < i; j++) {
                r -= lpc[j] * autocorr[i - j];
            }
            r /= error;
            ref[i] = r;

            lpc[i] = r;
            for (j = 0; j < (i >> 1); j++) {
                var tmp = lpc[j];
                lpc[j] += r * lpc[i - 1 - j];
                lpc[i - 1 - j] += r * tmp;
            }
            if (i % 2) {
                lpc[j] += lpc[j] * r;
            }
            error *= 1.0 - r * r;
        }
    })();
    return lpc;
}
