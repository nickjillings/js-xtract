/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_array} from "./xtract_assert_array";
export function xtract_asdf(array) {
    if (!xtract_assert_array(array))
        return 0;
    var n = array.length;
    var result = new Float64Array(n);
    while (n--) {
        var sd = 0.0;
        for (var i = 0; i < array.length - n; i++) {
            sd += Math.pow(array[i] - array[i + n], 2);
        }
        result[n] = sd / array.length;
    }
    return result;
}
