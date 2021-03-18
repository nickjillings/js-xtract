/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_array} from "./xtract_assert_array";
import {xtract_dct} from "./xtract_dct";
export function xtract_mfcc(spectrum, mfcc) {
    if (!xtract_assert_array(spectrum))
        return 0;
    var K = spectrum.length >> 1;
    if (typeof mfcc !== "object") {
        throw ("Invalid MFCC, must be MFCC object built using xtract_init_mfcc");
    }
    if (mfcc.n_filters === 0) {
        throw ("Invalid MFCC, object must be built using xtract_init_mfcc");
    }
    if (mfcc.filters[0].length !== K) {
        throw ("Lengths do not match");
    }
    var result = new Float64Array(mfcc.n_filters);
    result.forEach(function (v, f, r) {
        r[f] = 0.0;
        var filter = mfcc.filters[f];
        for (var n = 0; n < filter.length; n++) {
            r[f] += spectrum[n] * filter[n];
        }
        r[f] = Math.log(Math.max(r[f], 2e-42));
    });
    return xtract_dct(result);
}
