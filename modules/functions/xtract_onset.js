/// <reference path="../../typings/functions.d.ts" />
import {transform} from "../freeFFT";
import {xtract_array_interlace} from "./xtract_array_interlace";
import {xtract_assert_array} from "./xtract_assert_array";
import {xtract_get_data_frames} from "./xtract_get_data_frames";

function angle(real, imag) {
    if (imag === undefined && real.length === 2) {
        return Math.atan2(real[1], real[0]);
    }
    return Math.atan2(imag, real);
}

function abs(real, imag) {
    if (imag === undefined && real.length === 2) {
        return Math.sqrt(Math.pow(real[0], 2) + Math.pow(real[1], 2));
    }
    return Math.sqrt(Math.pow(real, 2) + Math.pow(imag, 2));
}

function princarg(phaseIn) {
    //phase=mod(phasein+pi,-2*pi)+pi;
    return (phaseIn + Math.PI) % (-2 * Math.PI) + Math.PI;
}

function complex_mul(cplx_pair_A, cplx_pair_B) {
    if (cplx_pair_A.length !== 2 || cplx_pair_B.length !== 2) {
        throw ("Both arguments must be numeral arrays of length 2");
    }
    var result = new cplx_pair_A.constructor(2);
    result[0] = cplx_pair_A[0] * cplx_pair_B[0] - cplx_pair_A[1] * cplx_pair_B[1];
    result[1] = cplx_pair_A[0] * cplx_pair_B[1] + cplx_pair_A[1] * cplx_pair_B[0];
    return result;
}

function get_X(frames, frameSize) {
    var N = frames.length;
    var X = [];
    var real = new Float64Array(frameSize);
    var imag = new Float64Array(frameSize);
    var K = frameSize / 2 + 1;
    var n;
    for (var i = 0; i < N; i++) {
        for (n = 0; n < frameSize; n++) {
            real[n] = frames[i][n];
            imag[n] = 0.0;
        }
        transform(real, imag);
        X[i] = xtract_array_interlace([real.subarray(0, K), imag.subarray(0, K)]);
    }
    return X;
}

export function xtract_onset(timeData, frameSize) {

    if (!xtract_assert_array(timeData))
        return 0;
    if (frameSize === undefined) {
        throw ("All arguments for xtract_onset must be defined: xtract_onset(timeData, frameSize)");
    }
    var frames = xtract_get_data_frames(timeData, frameSize, frameSize, false);
    var N = frames.length;
    var K = frameSize / 2 + 1;
    var X = get_X(frames, frameSize);

    var E = new timeData.constructor(N);
    var n;
    for (var k = 0; k < K; k++) {
        var phase_prev = angle(X[0].subarray(2 * k, 2 * k + 2));
        var phase_delta = angle(X[0].subarray(2 * k, 2 * k + 2));
        for (n = 1; n < N; n++) {
            var phi = princarg(phase_prev + phase_delta);
            var exp = [Math.cos(phi), Math.sin(phi)];
            var XT = complex_mul(X[n].subarray(2 * k, 2 * k + 2), exp);
            XT[0] = X[n][2 * k] - XT[0];
            XT[1] = X[n][2 * k + 1] - XT[1];
            E[n] += abs(XT);
            var phase_now = angle(X[n].subarray(2 * k, 2 * k + 2));
            phase_delta = phase_now - phase_prev;
            phase_prev = phase_now;
        }
    }

    for (n = 0; n < N; n++) {
        E[n] /= frameSize;
    }
    return E;
}
