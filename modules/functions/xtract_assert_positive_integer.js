/// <reference path="../../typings/functions.d.ts" />
export function xtract_assert_positive_integer(number) {
    return (typeof number === "number" && number >= 0 && number === Math.round(number));
}
