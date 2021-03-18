/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_array} from "./xtract_assert_array";
import {xtract_array_max} from "./xtract_array_max";
import {xtract_mean} from "./xtract_mean";

export function xtract_crest(data, max, mean) {
    if (!xtract_assert_array(data))
        return 0;
    if (typeof max !== "number") {
        max = xtract_array_max(data);
    }
    if (typeof mean !== "number") {
        mean = xtract_mean(data);
    }
    return max / mean;
}
