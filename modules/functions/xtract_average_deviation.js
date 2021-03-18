/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_array} from "./xtract_assert_array";
import {xtract_mean} from "./xtract_mean";
export function xtract_average_deviation(array, mean) {
    if (!xtract_assert_array(array))
        return 0;
    if (typeof mean !== "number") {
        mean = xtract_mean(array);
    }
    var result = 0.0;
    if (array.reduce) {
        result = array.reduce(function (a, b) {
            return a + Math.abs(b - mean);
        }, 0);
    } else {
        for (var n = 0; n < array.length; n++) {
            result += Math.abs(array[n] - mean);
        }
    }
    return result / array.length;
}
