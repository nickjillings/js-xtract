/// <reference path="../../typings/functions.d.ts" />
export function xtract_midicent(f0) {
    if (typeof f0 !== "number") {
        return -1;
    }
    var note = 0.0;
    note = 69 + Math.log(f0 / 440.0) * 17.31234;
    note *= 100;
    note = Math.round(0.5 + note);
    return note;
}
