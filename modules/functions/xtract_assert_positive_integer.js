/// <reference path="../../typings/functions.d.ts" />
function xtract_assert_positive_integer(number) {
    return (typeof number === "number" && number >= 0 && number === Math.round(number));
}
