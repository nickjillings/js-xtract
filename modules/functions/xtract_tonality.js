/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_array} from "./xtract_assert_array";
import {xtract_flatness_db} from "./xtract_flatness_db";

export function xtract_tonality(spectrum, flatness_db) {
    if (!xtract_assert_array(spectrum))
        return 0;
    if (typeof flatness_db !== "number") {
        flatness_db = xtract_flatness_db(spectrum);
    }
    return Math.min(flatness_db / -60.0, 1);
}
