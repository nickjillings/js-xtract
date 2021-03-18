/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_array} from "./xtract_assert_array";

export function xtract_array_interlace(data) {
    if (!xtract_assert_array(data)) {
        return [];
    }
    var num_arrays = data.length,
        length = data[0].length;
    if (data.every(function (a) {
            return a.length === length;
        }) === false) {
        throw ("All argument lengths must be the same");
    }
    var result = new data[0].constructor(num_arrays * length);
    for (var k = 0; k < length; k++) {
        for (var j = 0; j < num_arrays; j++) {
            result[k * num_arrays + j] = data[j][k];
        }
    }
    return result;
}
