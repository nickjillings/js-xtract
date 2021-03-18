/// <reference path="../../typings/functions.d.ts" />
export function xtract_array_copy(src) {
    var N = src.length,
        dst = new src.constructor(N);
    for (var n = 0; n < N; n++)
        dst[n] = src[n];
    return dst;
}
