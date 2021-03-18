/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_positive_integer} from "./xtract_assert_positive_integer";
import {xtract_assert_array} from "./xtract_assert_array";
import {xtract_get_number_of_frames} from "./xtract_get_number_of_frames";

export function xtract_frame_from_array(src, dst, index, frame_size, hop_size) {
    if (hop_size === undefined) {
        hop_size = frame_size;
    }
    if (!xtract_assert_positive_integer(index)) {
        throw ("xtract_get_frame requires the index to be an integer value");
    }
    if (!xtract_assert_positive_integer(frame_size)) {
        throw ("xtract_get_frame requires the frame_size to be a positive integer");
    }
    if (!xtract_assert_array(src)) {
        throw ("Invalid data parameter. Must be item with iterable list");
    }
    if (!xtract_assert_array(dst)) {
        throw ("dst must be an Array-like object equal in length to frame_size");
    }
    if (!xtract_assert_positive_integer(hop_size)) {
        throw ("xtract_get_frame requires the hop_size to be a positive integer");
    }
    var K = xtract_get_number_of_frames(src, hop_size);
    if (index >= K) {
        throw ("index number " + index + " out of bounds");
    }
    var n = 0;
    var offset = index * hop_size;
    while (n < dst.length && n < src.length && n < frame_size) {
        dst[n] = src[n + offset];
        n++;
    }
    while (n < dst.length) {
        dst[n] = 0.0;
    }
}
