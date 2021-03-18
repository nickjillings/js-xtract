/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_array} from "./xtract_assert_array";
export function xtract_zcr(timeArray) {
    if (!xtract_assert_array(timeArray))
        return 0;
    var result = 0;
    for (var n = 1; n < timeArray.length; n++) {
        if (timeArray[n] * timeArray[n - 1] < 0) {
            result++;
        }
    }
    return result / timeArray.length;
}
