/// <reference path="../../typings/functions.d.ts" />
import {xtract_assert_array} from "./xtract_assert_array";
import {xtract_assert_positive_integer} from "./xtract_assert_positive_integer";

export function xtract_get_data_frames(data, frame_size, hop_size, copy) {
    if (hop_size === undefined) {
        hop_size = frame_size;
    }
    (function (data, frame_size, hop_size) {
        if (!xtract_assert_array(data)) {
            throw ("Invalid data parameter. Must be item with iterable list");
        }
        if (!xtract_assert_positive_integer(frame_size)) {
            throw ("xtract_get_data_frames requires the frame_size to be a positive integer");
        }
        if (!xtract_assert_positive_integer(hop_size)) {
            throw ("xtract_get_data_frames requires the hop_size to be a positive integer");
        }
        return true;
    })(data, frame_size, hop_size);

    var frames = [];
    var N = data.length;
    var K = Math.ceil(N / hop_size);
    var sub_frame;
    for (var k = 0; k < K; k++) {
        var offset = k * hop_size;
        if (copy) {
            sub_frame = new Float64Array(frame_size);
            for (var n = 0; n < frame_size && n + offset < data.length; n++) {
                sub_frame[n] = data[n + offset];
            }
        } else {
            sub_frame = data.subarray(offset, offset + frame_size);
            if (sub_frame.length < frame_size) {
                // Must zero-pad up to the length
                var c_frame = new Float64Array(frame_size);
                for (var i = 0; i < sub_frame.length; i++) {
                    c_frame[i] = sub_frame[i];
                }
                sub_frame = c_frame;
            }
        }
        frames.push(sub_frame);
    }
    return frames;
}
