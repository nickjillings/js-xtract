/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_array} from "./xtract_assert_array";
import {xtract_array_min} from "./xtract_array_min";
import {xtract_array_max} from "./xtract_array_max";

export function xtract_array_bound(data, min, max) {
    if (!xtract_assert_array(data))
        return 0;
    if (typeof min !== "number") {
        min = xtract_array_min(data);
    }
    if (typeof max !== "number") {
        max = xtract_array_max(data);
    }
    if (min >= max) {
        throw ("Invalid boundaries! Minimum cannot be greater than maximum");
    }
    var result = new data.constructor(data.length);
    for (var n = 0; n < data.length; n++) {
        result[n] = Math.min(Math.max(data[n], min), max);
    }
    return result;
}
