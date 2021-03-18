/// <reference path="../../typings/functions.d.ts" />
import {xtract_skewness_kurtosis} from "./xtract_skewness_kurtosis";

export function xtract_kurtosis(array, mean, standard_deviation) {
    return xtract_skewness_kurtosis(array, mean, standard_deviation)[1];
}
