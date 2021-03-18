/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_array} from "./xtract_assert_array";
export function xtract_array_max(data) {
    if (!xtract_assert_array(data))
        return -Infinity;
    if (data.reduce) {
        return data.reduce(function (a, b) {
            if (b > a) {
                return b;
            }
            return a;
        }, data[0]);
    }
    var max = data[0],
        l = data.length;
    for (var n = 1; n < l; n++) {
        if (data[n] > max) {
            max = data[n];
        }
    }
    return max;
}
