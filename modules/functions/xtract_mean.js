/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_array} from "./xtract_assert_array";
import {xtract_array_sum} from "./xtract_array_sum";
export function xtract_mean(array) {
    if (!xtract_assert_array(array))
        return 0;
    return xtract_array_sum(array) / array.length;
}
