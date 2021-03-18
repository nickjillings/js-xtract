/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_array} from "./xtract_assert_array";

export function xtract_sharpness(barkBandsArray) {
    if (!xtract_assert_array(barkBandsArray))
        return 0;
    var N = barkBandsArray.length;

    var rv, sl = 0.0,
        g = 0.0,
        temp = 0.0;
    for (var n = 0; n < N; n++) {
        sl = Math.pow(barkBandsArray[n], 0.23);
        g = (n < 15 ? 1.0 : 0.066 * Math.exp(0.171 * n));
        temp += n * g * sl;
    }
    temp = 0.11 * temp / N;
    return temp;
}
