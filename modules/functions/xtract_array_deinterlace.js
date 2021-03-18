/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_array} from "./xtract_assert_array";
import {xtract_assert_positive_integer} from "./xtract_assert_positive_integer";

export function xtract_array_deinterlace(data, num_arrays) {
    if (!xtract_assert_array(data)) {
        return [];
    }
    var result, N;
    if (!xtract_assert_positive_integer(num_arrays)) {
        throw ("num_arrays must be a positive integer");
    }
    result = [];
    N = data.length / num_arrays;
    for (var n = 0; n < num_arrays; n++) {
        result[n] = new data.constructor(N);
    }
    for (var k = 0; k < N; k++) {
        for (var j = 0; j < num_arrays; j++) {
            result[j][k] = data[k * num_arrays + j];
        }
    }
    return result;
}
