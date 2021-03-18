/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_array} from "./xtract_assert_array";

export function xtract_dct(array) {
    if (!xtract_assert_array(array))
        return 0;
    var N = array.length;
    var result = new Float64Array(N);
    if (array.reduce) {
        result.forEach(function (e, i, a) {
            var nN = i / N;
            a[i] = array.reduce(function (r, d, m) {
                return r + d * Math.cos(Math.PI * nN * (m + 0.5));
            });
        });
    } else {
        for (var n = 0; n < N; n++) {
            var nN = n / N;
            for (var m = 0; m < N; m++) {
                result[n] += array[m] * Math.cos(Math.PI * nN * (m + 0.5));
            }
        }
    }
    return result;
}
