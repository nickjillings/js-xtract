/// <reference path="../../typings/functions.d.ts" />
import {xtract_array_sum} from "./xtract_array_sum";
export function xtract_init_chroma(N, sampleRate, nbins, A440, f_ctr, octwidth) {
    /*run arg checks here... (if(nbins=='undefined')*/

    if (typeof nbins !== "number" || nbins <= 1) {
        nbins = 12;
    }
    if (typeof A440 !== "number" || A440 <= 27.5) {
        A440 = 440;
    }
    if (typeof f_ctr !== "number") {
        f_ctr = 1000;
    }
    if (typeof octwidth !== "number") {
        octwidth = 1;
    }
    var A0 = 27.5; // A0 in Hz
    var N2 = N; // ignore freq values returned by xtract_spectrum - this relies on dc-offset being kept
    var ctroct = Math.log(f_ctr / A0) / Math.LN2; // f_ctr in octaves
    var chromaFilters = {
        wts: [],
        nfft: N2,
        nbins: nbins,
    };
    var fftfrqbins = new Float64Array(N2);
    var binwidthbins = new Float64Array(N2);
    // Convert a frequency in Hz into a real number counting the octaves above A0. So hz2octs(440) = 4.0
    var hz2octs = function (freq) {
        return Math.log(freq / (A440 / 16)) / Math.LN2;
    };
    var i, j;
    for (i = 1; i < N2; i++) {
        fftfrqbins[i] = nbins * hz2octs(i / N * sampleRate);
    }
    fftfrqbins[0] = fftfrqbins[1] - 1.5 * nbins; //DC offset bin
    for (i = 0; i < N2 - 1; i++) {
        var diffVal = fftfrqbins[i + 1] - fftfrqbins[i];
        if (diffVal >= 1) {
            binwidthbins[i] = diffVal;
        } else {
            binwidthbins[i] = 1;
        }
    }
    binwidthbins[N2 - 1] = 1;
    var nbins2 = Math.round(nbins / 2.0);
    var wts = [];
    for (i = 0; i < nbins; i++) {
        wts[i] = [];
        for (j = 0; j < N2; j++) {
            var tmpF = fftfrqbins[j] - i;
            var tmpB = binwidthbins[j];
            var remF = ((tmpF + nbins2 + 10 * nbins) % nbins) - nbins2;
            wts[i][j] = Math.exp(-0.5 * Math.pow((2 * remF / tmpB), 2));
        }
    }

    function head(a) {
        return a[0];
    }

    function tail(a) {
        return a.slice(1);
    }

    function transpose(a) {
        if (a === undefined) {
            return [];
        }
        var x = a.length,
            y = a[0].length,
            mtx = [],
            i, j;
        for (i = 0; i < y; i++) {
            mtx[i] = new Float64Array(x);
        }
        for (i = 0; i < x; i++) {
            for (j = 0; j < y; j++) {
                mtx[j][i] = a[i][j];
            }
        }
        return mtx;
    }
    var wtsColumnSums = transpose(wts).map(xtract_array_sum);
    for (i = 0; i < nbins; i++) {
        for (j = 0; j < N2; j++) {
            wts[i][j] *= 1 / wtsColumnSums[j];
        }
    }
    if (octwidth > 0) {
        for (i = 0; i < nbins; i++) {
            for (j = 0; j < N2; j++) {
                wts[i][j] *= Math.exp(-0.5 * (Math.pow(((fftfrqbins[j] / nbins - ctroct) / octwidth), 2)));
            }
        }
    }
    chromaFilters.wts = wts;
    return chromaFilters;
}
