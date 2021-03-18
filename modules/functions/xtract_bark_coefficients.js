/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_array} from "./xtract_assert_array";
export function xtract_bark_coefficients(spectrum, bark_limits) {
    if (!xtract_assert_array(spectrum))
        return 0;
    if (bark_limits === undefined) {
        throw ("xtract_bark_coefficients requires compute limits from xtract_init_bark");
    }
    var N = spectrum.length >> 1;
    var bands = bark_limits.length;
    var results = new Float64Array(bands);
    for (var band = 0; band < bands - 1; band++) {
        results[band] = 0.0;
        for (var n = bark_limits[band]; n < bark_limits[band + 1]; n++) {
            results[band] += spectrum[n];
        }
    }
    return results;
}
