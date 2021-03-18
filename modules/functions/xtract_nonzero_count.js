/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_array} from "./xtract_assert_array";
export function xtract_nonzero_count(data) {
    if (!xtract_assert_array(data))
        return 0;
    var count = 0;
    if (data.reduce) {
        return data.reduce(function (a, b) {
            if (b !== 0) {
                a++;
            }
            return a;
        });
    }
    for (var n = 0; n < data.length; n++) {
        if (data[n] !== 0) {
            count++;
        }
    }
    return count;
}
