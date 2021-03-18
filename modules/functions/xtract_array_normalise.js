/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_array} from "./xtract_assert_array";
import {xtract_array_scale} from "./xtract_array_scale";
import {xtract_array_max} from "./xtract_array_max";

export function xtract_array_normalise(data) {
    if (!xtract_assert_array(data))
        return 0;
    return xtract_array_scale(data, 1.0 / xtract_array_max(data));
}
