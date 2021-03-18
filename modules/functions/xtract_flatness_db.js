/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_array} from "./xtract_assert_array";
import {xtract_flatness} from "./xtract_flatness";

export function xtract_flatness_db(spectrum, flatness) {
    if (!xtract_assert_array(spectrum))
        return 0;
    if (typeof flatness !== "number") {
        flatness = xtract_flatness(spectrum);
    }
    return 10.0 * Math.log10(flatness);
}
