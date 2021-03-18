/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_array} from "./xtract_assert_array";
import {xtract_array_sum} from "./xtract_array_sum";

export function xtract_sum(data) {
    if (!xtract_assert_array(data))
        return 0;
    return xtract_array_sum(data);
}
