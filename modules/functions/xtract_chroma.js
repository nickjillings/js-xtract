/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_array} from "./xtract_assert_array";
export function xtract_chroma(spectrum, chromaFilters) {
    if (!xtract_assert_array(spectrum)) {
        return 0;
    }
    if (chromaFilters.wts === undefined) {
        throw ("xtract_chroma requires chroma filters from xtract_init_chroma");
    }
    if (chromaFilters.nfft !== spectrum.length / 2) {
        throw ("the FFT lengths of the spectrum (" + spectrum.length / 2 + ") and chroma filterbank (" + chromaFilters.nfft + ") do not match");
    }
    var result = new Float64Array(chromaFilters.nbins);
    for (var i = 0; i < chromaFilters.nbins; i++) {
        var sum = 0;
        for (var j = 0; j < chromaFilters.nfft; j++) {
            sum += chromaFilters.wts[i][j] * spectrum[j];
        }
        result[i] = sum;
    }
    return result;
}
