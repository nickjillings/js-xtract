/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_array} from "./xtract_assert_array";
import {xtract_variance} from "./xtract_variance";
export function xtract_standard_deviation(array, variance) {
    if (!xtract_assert_array(array))
        return 0;
    if (typeof variance !== "number") {
        variance = xtract_variance(array);
    }
    return Math.sqrt(variance);
}
