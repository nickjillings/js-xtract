/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_array} from "./xtract_assert_array";
import {xtract_lowhigh} from "./xtract_lowhigh";

export function xtract_lowest_value(data, threshold) {
    if (!xtract_assert_array(data))
        return 0;
    if (typeof threshold !== "number") {
        threshold = -Infinity;
    }
    return xtract_lowhigh(data, threshold).min;
}
