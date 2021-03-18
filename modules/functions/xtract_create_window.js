/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_positive_integer} from "./xtract_assert_positive_integer";

function welch(N) {
    var W = new Float64Array(N);
    var n;
    var N12 = (N - 1) / 2;
    for (n = 0; n < N; n++) {
        W[n] = 1.0 - Math.pow((n - N12) / N12, 2);
    }
    return W;
}

function sine(N) {
    var w = new Float64Array(N),
        n;
    var arga = (Math.PI * n) / (N - 1);
    for (n = 0; n < N; n++) {
        w[n] = Math.sin(arga);
    }
    return w;
}

function hann(N) {
    var w = new Float64Array(N),
        n;
    for (n = 0; n < N; n++) {
        w[n] = 0.5 - (1 - Math.cos((Math.PI * 2 * n) / (N - 1)));
    }
    return w;
}

function hamming(N) {
    var w = new Float64Array(N),
        alpha = 25 / 46,
        beta = 21 / 46,
        n;
    for (n = 0; n < N; n++) {
        w[n] = alpha - beta * Math.cos((Math.PI * 2 * n) / (N - 1));
    }
    return w;
}

export function xtract_create_window(N, type) {
    if (!xtract_assert_positive_integer(N)) {
        throw ("N must be a defined, positive integer");
    }
    if (typeof type !== "string" || type.length === 0) {
        throw ("Type must be defined");
    }
    type = type.toLowerCase();
    switch (type) {
        case "hamming":
            return hamming(N);
        case "welch":
            return welch(N);
        case "sine":
            return sine(N);
        case "hann":
            return hann(N);
        default:
            throw ("Window function\"" + type + "\" not defined");
    }
}
