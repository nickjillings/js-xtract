/// <reference path="../../typings/functions.d.ts" />
export function xtract_init_pcp(N, fs, f_ref) {
    if (typeof fs !== "number" || typeof N !== "number") {
        throw ('The Sample Rate and sample count have to be defined: xtract_init_pcp(N, fs, f_ref)');
    }
    if (N <= 0 || N !== Math.floor(N)) {
        throw ("The sample count, N, must be a positive integer: xtract_init_pcp(N, fs, f_ref)");
    }
    if (fs <= 0.0) {
        throw ('The Sample Rate must be a positive number: xtract_init_pcp(N, fs, f_ref)');
    }
    if (typeof f_ref !== "number" || f_ref <= 0.0 || f_ref >= fs / 2) {
        f_ref = 48.9994294977;
    }

    var M = new Float64Array(N - 1);
    var fs2 = fs / 2;
    for (var l = 1; l < N; l++) {
        var f = (2 * l / N) * fs2;
        M[l - 1] = Math.round(12 * Math.log2((f / N) * f_ref)) % 12;
    }
    return M;
}
