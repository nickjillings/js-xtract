/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_array} from "./xtract_assert_array";
export function xtract_array_sum(data) {
    if (!xtract_assert_array(data))
        return 0;
    if (data.reduce) {
        return data.reduce(function (a, b) {
            return a + b;
        }, 0);
    }
    var sum = 0,
        l = data.length;
    for (var n = 0; n < l; n++) {
        sum += data[n];
    }
    return sum;
}
