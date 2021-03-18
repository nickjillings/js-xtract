/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_array} from "./xtract_assert_array";
import {xtract_init_pcp} from "./xtract_init_pcp";
export function xtract_pcp(spectrum, M, fs) {
    if (!xtract_assert_array(spectrum))
        return 0;
    var N = spectrum.length >> 1;
    if (typeof M !== "object") {
        if (typeof fs !== "number" || fs <= 0.0) {
            throw ("Cannot dynamically compute M if fs is undefined / not a valid sample rate");
        }
        M = xtract_init_pcp(N, fs);
    }
    var amps = spectrum.subarray(1, N);
    var PCP = new Float64Array(12);
    for (var l = 0; l < amps.length; l++) {
        var p = M[l];
        PCP[l] += Math.pow(Math.abs(amps[l]), 2);
    }
    return PCP;
}
