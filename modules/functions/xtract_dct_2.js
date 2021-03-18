/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_array} from "./xtract_assert_array";
import {xtract_init_dct} from "./xtract_init_dct";
import {xtract_array_sum} from "./xtract_array_sum";

export function xtract_dct_2(array, dct) {
    if (!xtract_assert_array(array))
        return 0;
    var N = array.length;
    if (dct === undefined) {
        dct = xtract_init_dct(N);
    }
    var result = new Float64Array(N);
    result[0] = xtract_array_sum(array);
    if (result.forEach && array.reduce) {
        result.forEach(function (e, k, ar) {
            ar[k] = array.reduce(function (a, b, n) {
                return a + b * dct.wt[k][n];
            });
        });
    } else {
        for (var k = 1; k < N; k++) {
            for (var n = 0; n < N; n++) {
                result[k] += array[n] * dct.wt[k][n];
            }
        }
    }
    return result;
}
