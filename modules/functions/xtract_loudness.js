/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_array} from "./xtract_assert_array";
export function xtract_loudness(barkBandsArray) {
    if (!xtract_assert_array(barkBandsArray))
        return 0;
    var result = 0;
    if (barkBandsArray.reduce) {
        result = barkBandsArray.reduce(function (a, b) {
            return a + Math.pow(b, 0.23);
        }, 0);
    } else {
        for (var n = 0; n < barkBandsArray.length; n++) {
            result += Math.pow(barkBandsArray[n], 0.23);
        }
    }
    return result;
}
