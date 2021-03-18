/// <reference path="../../typings/functions.d.ts" />
export function xtract_init_dft(N) {
    var dft = {
        N: N / 2 + 1,
        real: [],
        imag: []
    };
    var power_const = -2.0 * Math.PI / N;
    for (var k = 0; k < dft.N; k++) {
        var power_k = power_const * k;
        dft.real[k] = new Float64Array(N);
        dft.imag[k] = new Float64Array(N);
        for (var n = 0; n < N; n++) {
            var power = power_k * n;
            dft.real[k][n] = Math.cos(power);
            dft.imag[k][n] = Math.sin(power);
        }
    }
    return dft;
}
