/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_array} from "./xtract_assert_array";

export function xtract_autocorrelation(array) {
    if (!xtract_assert_array(array))
        return 0;
    var n = array.length;
    var result = new Float64Array(n);
    while (n--) {
        var corr = 0;
        for (var i = 0; i < array.length - n; i++) {
            corr += array[i] * array[i + n];
        }
        result[n] = corr / array.length;
    }
    return result;
}
