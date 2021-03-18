/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_array} from "./xtract_assert_array";

export function xtract_rms_amplitude(timeArray) {
    if (!xtract_assert_array(timeArray))
        return 0;
    var result = 0;
    if (timeArray.reduce) {
        result = timeArray.reduce(function (a, b) {
            return a + b * b;
        }, 0);
    } else {
        for (var n = 0; n < timeArray.length; n++) {
            result += timeArray[n] * timeArray[n];
        }
    }
    return Math.sqrt(result / timeArray.length);
}
