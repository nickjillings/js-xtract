/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_array} from "./xtract_assert_array";
import {xtract_array_copy} from "./xtract_array_copy";
export function xtract_array_scale(data, factor) {
    if (!xtract_assert_array(data))
        return 0;
    if (typeof factor !== "number") {
        return 0;
    }
    var i = 0,
        l = data.length,
        a = xtract_array_copy(data);
    for (i = 0; i < l; i++) {
        a[i] *= factor;
    }
    return a;
}
