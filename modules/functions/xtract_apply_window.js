/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_array} from "./xtract_assert_array";
export function xtract_apply_window(X, W) {
    if (!xtract_assert_array(X) || !xtract_assert_array(W)) {
        throw ("Both X and W must be defined");
    }
    if (X.length !== W.length) {
        throw ("Both X and W must be the same lengths");
    }
    var N = X.length;
    var Y = new Float64Array(N);
    var n;
    for (n = 0; n < N; n++) {
        Y[n] = X[n] * W[n];
    }
    return Y;
}
