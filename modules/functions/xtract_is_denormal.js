/// <reference path="../../typings/functions.d.ts" />
export function xtract_is_denormal(num) {
    if (Math.abs(num) <= 2.2250738585072014e-308) {
        return true;
    }
    return false;
}
