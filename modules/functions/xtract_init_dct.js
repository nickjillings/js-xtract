/// <reference path="../../typings/functions.d.ts" />
export function xtract_init_dct(N) {
    var dct = {
        N: N,
        wt: []
    };
    for (var k = 0; k < N; k++) {
        dct.wt[k] = new Float64Array(N);
        for (var n = 0; n < N; n++) {
            dct.wt[k][n] = Math.cos(Math.PI * k * (n + 0.5) / N);
        }
    }
    return dct;
}
