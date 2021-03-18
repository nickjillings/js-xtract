/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_array} from "./xtract_assert_array";
export function xtract_array_min(data) {
    if (!xtract_assert_array(data))
        return Infinity;
    if (data.reduce) {
        return data.reduce(function (a, b) {
            if (b < a) {
                return b;
            }
            return a;
        }, data[0]);
    }
    var min = Infinity,
        l = data.length;
    for (var n = 0; n < l; n++) {
        if (data[n] < min) {
            min = data[n];
        }
    }
    return min;
}
