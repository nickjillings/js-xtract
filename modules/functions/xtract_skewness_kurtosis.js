/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_array} from "./xtract_assert_array";
import {xtract_mean} from "./xtract_mean";
import {xtract_standard_deviation} from "./xtract_standard_deviation";
import {xtract_variance} from "./xtract_variance";

export function xtract_skewness_kurtosis(array, mean, standard_deviation) {
    if (!xtract_assert_array(array))
        return [0.0, 0.0];
    if (typeof mean !== "number") {
        mean = xtract_mean(array);
    }
    if (typeof standard_deviation !== "number") {
        standard_deviation = xtract_standard_deviation(array, xtract_variance(array, mean));
    }
    if (standard_deviation === 0) {
        return [0.0, 0.0];
    }
    var result = [0.0, 0.0];
    for (var n = 0; n < array.length; n++) {
        result[0] += Math.pow((array[n] - mean) / standard_deviation, 3);
        result[1] += Math.pow((array[n] - mean) / standard_deviation, 4);
    }
    result[0] /= array.length;
    result[1] /= array.length;
    return result;
}
