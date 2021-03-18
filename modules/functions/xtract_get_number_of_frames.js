/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_array} from "./xtract_assert_array";
export function xtract_get_number_of_frames(data, hop_size) {
    if (!xtract_assert_array(data)) {
        throw ("Invalid data parameter. Must be item with iterable list");
    }
    if (typeof hop_size !== "number" && hop_size <= 0) {
        throw ("Invalid hop_size. Must be positive integer");
    }
    return Math.floor(data.length / hop_size);
}
