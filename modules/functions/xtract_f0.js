/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_array} from "./xtract_assert_array";
import {xtract_array_copy} from "./xtract_array_copy";
import {xtract_array_max} from "./xtract_array_max";
import {xtract_array_bound} from "./xtract_array_bound";

function calc_err_tau_x(sub_arr, M, tau) {
    var err_tau = 0.0,
        n;
    for (n = 1; n < M; n++) {
        err_tau += Math.abs(sub_arr[n] - sub_arr[n + tau]);
    }
    return err_tau;
}

export function xtract_f0(timeArray, sampleRate) {
    if (!xtract_assert_array(timeArray))
        return 0;
    if (typeof sampleRate !== "number") {
        sampleRate = 44100.0;
    }
    var sub_arr = xtract_array_copy(timeArray);
    var N = sub_arr.length;
    var M = N / 2;
    var n;

    var threshold_peak = 0.8,
        threshold_centre = 0.3,
        array_max = 0;

    array_max = xtract_array_max(sub_arr);
    threshold_peak *= array_max;
    threshold_centre *= array_max;

    sub_arr = xtract_array_bound(sub_arr, -threshold_peak, threshold_peak);

    sub_arr.forEach(function (v, i, a) {
        a[i] = Math.max(0, v - threshold_centre);
    });

    var err_tau_1 = calc_err_tau_x(sub_arr, M, 1);
    for (var tau = 2; tau < M; tau++) {
        var err_tau_x = calc_err_tau_x(sub_arr, M, tau);
        if (err_tau_x < err_tau_1) {
            return sampleRate / (tau + (err_tau_x / err_tau_1));
        }
    }
    return -0;
}
