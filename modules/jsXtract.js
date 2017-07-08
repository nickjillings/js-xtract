/*
 * Copyright (C) 2016 Nicholas Jillings
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 *
 */

//"use strict";

// This work is based upon LibXtract developed by Jamie Bullock
//https://github.com/jamiebullock/LibXtract

/*globals window, console, Float32Array, Float64Array, Int32Array */
/*globals inverseTransform, transform */

var jsXtract = (function () {

    function searchMapProperties(map, properties) {
        var match = map.find(function (e) {
            for (var prop in properties) {
                if (e[prop] !== properties[prop]) {
                    return false;
                }
            }
            return true;
        });
        return match;
    }

    var dct_map = {
        parent: this,
        store: [],
        createCoefficients: function (N) {
            var match = searchMapProperties(this.store, {
                N: N
            });
            if (!match) {
                match = {
                    N: N,
                    data: xtract_init_dct(N)
                };
                this.store.push(match);
            }
            return match.data;
        }
    };

    var mfcc_map = {
        parent: this,
        store: [],
        createCoefficients: function (N, nyquist, style, freq_min, freq_max, freq_bands) {
            var search = {
                N: N,
                nyquist: nyquist,
                style: style,
                freq_min: freq_min,
                freq_max: freq_max,
                freq_bands: freq_bands
            };
            var match = searchMapProperties(this.store, search);
            if (!match) {
                match = search;
                match.data = xtract_init_mfcc(N, nyquist, style, freq_min, freq_max, freq_bands);
                this.store.push(match);
            }
            return match.data;
        }
    };

    var bark_map = {
        parent: this,
        store: [],
        createCoefficients: function (N, sampleRate, numBands) {
            var search = {
                N: N,
                sampleRate: sampleRate,
                numBands: numBands
            };
            var match = searchMapProperties(this.store, search);
            if (!match) {
                match = search;
                match.data = xtract_init_bark(N, sampleRate, numBands);
                this.store.push(match);
            }
            return match.data;
        }
    };

    var pub_obj = {};
    Object.defineProperties(pub_obj, {
        "createDctCoefficients": {
            "value": function (N) {
                return dct_map.createCoefficients(N);
            }
        },
        "createMfccCoefficients": {
            "value": function (N, nyquist, style, freq_min, freq_max, freq_bands) {
                return mfcc_map.createCoefficients(N, nyquist, style, freq_min, freq_max, freq_bands);
            }
        },
        "createBarkCoefficients": {
            "value": function (N, sampleRate, numBands) {
                if (typeof numBands !== "number" || numBands < 0 || numBands > 26) {
                    numBands = 26;
                }
                return bark_map.createCoefficients(N, sampleRate, numBands);
            }
        }
    });
    return pub_obj;
})();

function xtract_is_denormal(num) {
    if (Math.abs(num) <= 2.2250738585072014e-308) {
        return true;
    }
    return false;
}

function xtract_assert_array(array) {
    return (typeof array === "object" && array.length !== undefined && array.length > 0);
}

function xtract_assert_positive_integer(number) {
    return (typeof number === "number" && number >= 0 && number === Math.round(number));
}

function xtract_array_sum(data) {
    if (!xtract_assert_array(data))
        return 0;
    if (data.reduce) {
        return data.reduce(function (a, b) {
            return a + b;
        }, 0);
    }
    var sum = 0,
        l = data.length;
    for (var n = 0; n < l; n++) {
        sum += data[n];
    }
    return sum;
}

function xtract_array_copy(src) {
    var N = src.length,
        dst = new src.constructor(N);
    for (var n = 0; n < N; n++)
        dst[n] = src[n];
    return dst;
}

function xtract_array_min(data) {
    if (!xtract_assert_array(data))
        return Infinity;
    if (data.reduce) {
        return data.reduce(function (a, b) {
            if (b < a) {
                return b;
            }
            return a;
        }, data[0]);
    }
    var min = Infinity,
        l = data.length;
    for (var n = 0; n < l; n++) {
        if (data[n] < min) {
            min = data[n];
        }
    }
    return min;
}

function xtract_array_max(data) {
    if (!xtract_assert_array(data))
        return -Infinity;
    if (data.reduce) {
        return data.reduce(function (a, b) {
            if (b > a) {
                return b;
            }
            return a;
        }, data[0]);
    }
    var max = data[0],
        l = data.length;
    for (var n = 1; n < l; n++) {
        if (data[n] > max) {
            max = data[n];
        }
    }
    return max;
}

function xtract_array_scale(data, factor) {
    if (!xtract_assert_array(data))
        return 0;
    if (typeof factor !== "number") {
        return 0;
    }
    var i = 0,
        l = data.length;
    for (i = 0; i < l; i++) {
        data[i] *= factor;
    }
    return data;
}

function xtract_array_normalise(data) {
    if (!xtract_assert_array(data))
        return 0;
    return xtract_array_scale(data, 1.0 / xtract_array_max(data));
}

function xtract_array_bound(data, min, max) {
    if (!xtract_assert_array(data))
        return 0;
    if (typeof min !== "number") {
        min = xtract_array_min(data);
    }
    if (typeof max !== "number") {
        max = xtract_array_max(data);
    }
    if (min >= max) {
        throw ("Invalid boundaries! Minimum cannot be greater than maximum");
    }
    var result = new data.constructor(data.length);
    for (var n = 0; n < data.length; n++) {
        result[n] = Math.min(Math.max(data[n], min), max);
    }
    return result;
}

function xtract_array_interlace(data) {
    if (!xtract_assert_array(data)) {
        return [];
    }
    var num_arrays = data.length,
        length = data[0].length;
    if (data.every(function (a) {
            return a.length === length;
        }) === false) {
        throw ("All argument lengths must be the same");
    }
    var result = new data[0].constructor(num_arrays * length);
    for (var k = 0; k < length; k++) {
        for (var j = 0; j < num_arrays; j++) {
            result[k * num_arrays + j] = data[j][k];
        }
    }
    return result;
}

function xtract_array_deinterlace(data, num_arrays) {
    if (!xtract_assert_array(data)) {
        return [];
    }
    var result, N;
    if (!xtract_assert_positive_integer(num_arrays)) {
        throw ("num_arrays must be a positive integer");
    } else if (num_arrays === 1) {
        return data;
    }
    result = [];
    N = data.length / num_arrays;
    for (var n = 0; n < num_arrays; n++) {
        result[n] = new data.constructor(N);
    }
    for (var k = 0; k < N; k++) {
        for (var j = 0; j < num_arrays; j++) {
            result[j][k] = data[k * num_arrays + j];
        }
    }
    return result;
}

/* Array Manipulation */

function xtract_get_number_of_frames(data, hop_size) {
    if (!xtract_assert_array(data)) {
        throw ("Invalid data parameter. Must be item with iterable list");
    }
    if (typeof hop_size !== "number" && hop_size <= 0) {
        throw ("Invalid hop_size. Must be positive integer");
    }
    return Math.floor(data.length / hop_size);
}

function xtract_get_data_frames(data, frame_size, hop_size, copy) {
    if (!xtract_assert_array(data)) {
        throw ("Invalid data parameter. Must be item with iterable list");
    }
    if (!xtract_assert_positive_integer(frame_size)) {
        throw ("xtract_get_data_frames requires the frame_size to be a positive integer");
    }
    if (hop_size === undefined) {
        hop_size = frame_size;
    } else if (!xtract_assert_positive_integer(hop_size)) {
        throw ("xtract_get_data_frames requires the hop_size to be a positive integer");
    }
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

function xtract_process_frame_data(array, func, sample_rate, frame_size, hop_size, arg_this) {
    var frames = xtract_get_data_frames(array, frame_size, hop_size);
    var result = {
        num_frames: frames.length,
        results: []
    };
    var frame_time = 0;
    var data = {
        frame_size: frame_size,
        hop_size: hop_size,
        sample_rate: sample_rate,
        TimeData: undefined,
        SpectrumData: undefined
    };
    var prev_data;
    var prev_result;
    for (var fn = 0; fn < frames.length; fn++) {
        var frame = frames[fn];
        data.TimeData = frame;
        data.SpectrumData = xtract_spectrum(frame, sample_rate, true, false);
        prev_result = func.call(arg_this || this, data, prev_data, prev_result);
        var frame_result = {
            time_start: frame_time,
            result: prev_result
        };
        frame_time += frame_size / sample_rate;
        prev_data = data;
        data = {
            frame_size: frame_size,
            hop_size: hop_size,
            sample_rate: sample_rate,
            TimeData: undefined,
            SpectrumData: undefined
        };
        result.results.push(frame_result);
    }
    return result;
}

function xtract_array_to_JSON(array) {
    if (array.join) {
        return '[' + array.join(', ') + ']';
    }
    var json = '[';
    var n = 0;
    while (n < this.length) {
        json = json + this[n];
        if (this[n + 1] !== undefined) {
            json = json + ',';
        }
        n++;
    }
    return json + ']';
}

function xtract_frame_from_array(src, dst, index, frame_size, hop_size) {
    if (!xtract_assert_positive_integer(index)) {
        throw ("xtract_get_frame requires the index to be an integer value");
    }
    if (!xtract_assert_positive_integer(frame_size)) {
        throw ("xtract_get_frame requires the frame_size to be a positive integer");
    }
    if (hop_size === undefined) {
        hop_size = frame_size;
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

/* Scalar.c */

function xtract_mean(array) {
    if (!xtract_assert_array(array))
        return 0;
    return xtract_array_sum(array) / array.length;
}

function xtract_temporal_centroid(energyArray, sample_rate, window_ms) {
    if (typeof sample_rate !== "number") {
        console.error("xtract_temporal_centroid requires sample_rate to be a number");
        return;
    }
    if (typeof window_ms !== "number") {
        console.log("xtract_temporal_centroid assuming window_ms = 100ms");
        window_ms = 100.0;
    }
    if (window_ms <= 0) {
        window_ms = 100.0;
    }
    var ts = 1.0 / sample_rate;
    var L = sample_rate * (window_ms / 1000.0);
    var den = xtract_array_sum(energyArray);
    var num = 0.0;
    for (var n = 0; n < energyArray.length; n++) {
        num += energyArray[n] * (n * L * ts);
    }
    var result = num / den;
    return result;
}

function xtract_variance(array, mean) {
    if (!xtract_assert_array(array))
        return 0;
    if (typeof mean !== "number") {
        mean = xtract_mean(array);
    }
    var result = 0.0;
    if (array.reduce) {
        result = array.reduce(function (a, b) {
            a += Math.pow(b - mean, 2);
            return a;
        }, 0);
    } else {
        for (var n = 0; n < array.length; n++) {
            result += Math.pow(array[n] - mean, 2);
        }
    }
    result /= (array.length - 1);
    return result;
}

function xtract_standard_deviation(array, variance) {
    if (!xtract_assert_array(array))
        return 0;
    if (typeof variance !== "number") {
        variance = xtract_variance(array);
    }
    return Math.sqrt(variance);
}

function xtract_average_deviation(array, mean) {
    if (!xtract_assert_array(array))
        return 0;
    if (typeof mean !== "number") {
        mean = xtract_mean(array);
    }
    var result = 0.0;
    if (array.reduce) {
        result = array.reduce(function (a, b) {
            return a + Math.abs(b - mean);
        }, 0);
    } else {
        for (var n = 0; n < array.length; n++) {
            result += Math.abs(array[n] - mean);
        }
    }
    return result / array.length;
}

function xtract_skewness_kurtosis(array, mean, standard_deviation) {
    if (!xtract_assert_array(array))
        return [0.0, 0.0];
    if (typeof mean !== "number") {
        mean = xtract_mean(array);
    }
    if (typeof standard_deviation !== "number") {
        standard_deviation = xtract_standard_deviation(array, xtract_variance(array, mean));
    }
    if (standard_deviation === 0) {
        return [0.0, 0.0];
    }
    var result = [0.0, 0.0];
    if (array.reduce) {
        result = array.reduce(function (a, b) {
            var interim = (b - mean) / standard_deviation;
            a[0] += Math.pow(interim, 3);
            a[1] += Math.pow(interim, 4);
            return a;
        }, result);
    } else {
        for (var n = 0; n < array.length; n++) {
            result[0] += Math.pow((array[n] - mean) / standard_deviation, 3);
            result[1] += Math.pow((array[n] - mean) / standard_deviation, 4);
        }
    }
    result[0] /= array.length;
    result[1] /= array.length;
    return result;
}

function xtract_skewness(array, mean, standard_deviation) {
    return xtract_skewness_kurtosis(array, mean, standard_deviation)[0];
}

function xtract_kurtosis(array, mean, standard_deviation) {
    return xtract_skewness_kurtosis(array, mean, standard_deviation)[1];
}

function xtract_spectral_centroid(spectrum) {
    if (!xtract_assert_array(spectrum))
        return 0;
    var N = spectrum.length;
    var n = N >> 1;
    var amps = spectrum.subarray(0, n);
    var freqs = spectrum.subarray(n);
    var A_d = xtract_array_sum(amps) / n;
    if (A_d === 0.0) {
        return 0.0;
    }
    var sum = 0.0;
    while (n--) {
        sum += freqs[n] * (amps[n] / A_d);
    }
    var result = sum / (N >> 1);
    return result;
}

function xtract_spectral_mean(spectrum) {
    if (!xtract_assert_array(spectrum))
        return 0;
    var N = spectrum.length;
    var n = N >> 1;
    var amps = spectrum.subarray(0, n);
    var sum = xtract_array_sum(amps);
    var result = sum / n;
    return result;
}

function xtract_spectral_variance(spectrum, spectral_mean) {
    if (!xtract_assert_array(spectrum))
        return 0;
    if (typeof spectral_mean !== "number") {
        spectral_mean = xtract_spectral_centroid(spectrum);
    }
    var A = 0,
        result = 0;
    var N = spectrum.length;
    var n = N >> 1;
    var amps = spectrum.subarray(0, n);
    var freqs = spectrum.subarray(n, N);
    amps = xtract_array_scale(amps, 1 / xtract_array_sum(amps))
    A = xtract_array_sum(amps);
    while (n--) {
        result += Math.pow(freqs[n] - spectral_mean, 2) * (amps[n] / A);
    }
    return result;
}

function xtract_spectral_spread(spectrum, spectral_centroid) {
    return xtract_spectral_variance(spectrum, spectral_centroid);
}

function xtract_spectral_standard_deviation(spectrum, spectral_variance) {
    if (!xtract_assert_array(spectrum))
        return 0;
    if (typeof spectral_variance !== "number") {
        spectral_variance = xtract_spectral_variance(spectrum);
    }
    return Math.sqrt(spectral_variance);
}

function xtract_spectral_skewness(spectrum, spectral_mean, spectral_standard_deviation) {
    if (!xtract_assert_array(spectrum))
        return 0;
    if (typeof spectral_mean !== "number") {
        spectral_mean = xtract_spectral_mean(spectrum);
    }
    if (typeof spectral_standard_deviation !== "number") {
        spectral_standard_deviation = xtract_spectral_standard_deviation(spectrum, xtract_spectral_variance(spectrum, spectral_mean));
    }
    var result = 0;
    var N = spectrum.length;
    var K = N >> 1;
    var amps = spectrum.subarray(0, K);
    var freqs = spectrum.subarray(K);
    for (var n = 0; n < K; n++) {
        result += Math.pow(freqs[n] - spectral_mean, 3) * amps[n];
    }
    result /= Math.pow(spectral_standard_deviation, 3);
    return result;
}

function xtract_spectral_kurtosis(spectrum, spectral_mean, spectral_standard_deviation) {
    if (!xtract_assert_array(spectrum))
        return 0;
    if (typeof spectral_mean !== "number") {
        spectral_mean = xtract_spectral_mean(spectrum);
    }
    if (typeof spectral_standard_deviation !== "number") {
        spectral_standard_deviation = xtract_spectral_standard_deviation(spectrum, xtract_spectral_variance(spectrum, spectral_mean));
    }
    var result = 0;
    var N = spectrum.length;
    var K = N >> 1;
    var amps = spectrum.subarray(0, K);
    var freqs = spectrum.subarray(K);
    for (var n = 0; n < K; n++) {
        result += Math.pow(freqs[n] - spectral_mean, 4) * amps[n];
    }
    return result / Math.pow(spectral_standard_deviation, 4);
}

function xtract_irregularity_k(spectrum) {
    if (!xtract_assert_array(spectrum))
        return 0;
    var result = 0;
    var N = spectrum.length;
    var K = N >> 1;
    var amps = spectrum.subarray(0, K);
    for (var n = 1; n < K - 1; n++) {
        result += Math.abs(amps[n] - (amps[n - 1] + amps[n] + amps[n + 1]) / 3);
    }
    return result;
}

function xtract_irregularity_j(spectrum) {
    if (!xtract_assert_array(spectrum))
        return 0;
    var num = 0,
        den = 0;
    var N = spectrum.length;
    var K = N >> 1;
    var amps = spectrum.subarray(0, K);
    for (var n = 0; n < K - 1; n++) {
        num += Math.pow(amps[n] - amps[n + 1], 2);
        den += Math.pow(amps[n], 2);
    }
    return num / den;
}

function xtract_tristimulus(spectrum, f0) {
    var trist = [0.0, 0.0, 0.0];
    if (!xtract_assert_array(spectrum))
        return trist;
    if (typeof f0 !== "number") {
        throw ("xtract_tristimulus requires f0 to be defined and a number");
    }
    var h = 0,
        den = 0.0,
        p1 = p2 = p3 = p4 = p5 = 0.0,
        temp = 0.0,
        num = 0.0;
    var N = spectrum.length;
    var K = N >> 1;
    var amps = spectrum.subarray(0, K);
    var freqs = spectrum.subarray(K);

    for (var i = 0; i < K; i++) {
        temp = amps[i];
        if (temp !== 0) {
            den += temp;
            h = Math.floor(freqs[i] / f0 + 0.5);
            if (h === 1) {
                p1 += temp;
            }
            switch (h) {
                case 2:
                    p2 += temp;
                    break;
                case 3:
                    p3 += temp;
                    break;
                case 4:
                    p4 += temp;
                    break;
                default:
                    break;
            }
            if (h >= 5) {
                num += temp;
            }
        }
    }

    p2 += p3 + p4;
    if (den !== 0.0) {
        if (p1 !== 0.0) {
            trist[0] = p1 / den;
        }
        if (p2 !== 0.0) {
            trist[1] = p2 / den;
        }
        if (num !== 0.0) {
            trist[2] = num / den;
        }
    }
    return trist;
}

function xtract_tristimulus_1(spectrum, f0) {
    return xtract_tristimulus(spectrum, f0)[0];
}

function xtract_tristimulus_2(spectrum, f0) {
    return xtract_tristimulus(spectrum, f0)[1];
}

function xtract_tristimulus_3(spectrum, f0) {
    return xtract_tristimulus(spectrum, f0)[2];
}

function xtract_smoothness(spectrum) {
    if (!xtract_assert_array(spectrum))
        return 0;
    var prev = 0,
        current = 0,
        next = 0,
        temp = 0;
    var N = spectrum.length;
    var K = N >> 1;
    prev = spectrum[0] <= 0 ? 1e-5 : spectrum[0];
    current = spectrum[1] <= 0 ? 1e-5 : spectrum[1];
    for (var n = 1; n < K - 1; n++) {
        if (n > 1) {
            prev = current;
            current = next;
        }
        next = spectrum[n + 1] <= 0 ? 1e-5 : spectrum[n + 1];
        temp += Math.abs(20.0 * Math.log(current) - (20.0 * Math.log(prev) + 20.0 * Math.log(current) + 20.0 * Math.log(next)) / 3.0);
    }
    return temp;
}

function xtract_zcr(timeArray) {
    if (!xtract_assert_array(timeArray))
        return 0;
    var result = 0;
    for (var n = 1; n < timeArray.length; n++) {
        if (timeArray[n] * timeArray[n - 1] < 0) {
            result++;
        }
    }
    return result / timeArray.length;
}

function xtract_rolloff(spectrum, sampleRate, threshold) {
    if (!xtract_assert_array(spectrum))
        return 0;
    if (typeof sampleRate !== "number" || typeof threshold !== "number") {
        console.log("xtract_rolloff requires sampleRate and threshold to be defined");
        return null;
    }
    var N = spectrum.length;
    var K = N >> 1;
    var amps = spectrum.subarray(0, K);

    var pivot = 0,
        temp = 0;

    pivot = xtract_array_sum(amps);

    pivot *= threshold / 100.0;
    var n = 0;
    while (temp < pivot) {
        temp += amps[n];
        n++;
    }
    return n * (sampleRate / (spectrum.length));
}

function xtract_loudness(barkBandsArray) {
    if (!xtract_assert_array(barkBandsArray))
        return 0;
    var result = 0;
    if (barkBandsArray.reduce) {
        result = barkBandsArray.reduce(function (a, b) {
            return a + Math.pow(b, 0.23);
        }, 0);
    } else {
        for (var n = 0; n < barkBandsArray.length; n++) {
            result += Math.pow(barkBandsArray[n], 0.23);
        }
    }
    return result;
}

function xtract_flatness(spectrum) {
    if (!xtract_assert_array(spectrum))
        return 0;
    var count = 0,
        denormal_found = false,
        num = 1.0,
        den = 0.0,
        temp = 0.0;
    var N = spectrum.length;
    var K = N >> 1;
    var amps = spectrum.subarray(0, K);
    for (var n = 0; n < K; n++) {
        if (amps[n] !== 0.0) {
            if (xtract_is_denormal(num)) {
                denormal_found = true;
                break;
            }
            num *= amps[n];
            den += amps[n];
            count++;
        }
    }
    if (count === 0) {
        return 0;
    }
    num = Math.pow(num, 1.0 / count);
    den /= count;

    return num / den;
}

function xtract_flatness_db(spectrum, flatness) {
    if (!xtract_assert_array(spectrum))
        return 0;
    if (typeof flatness !== "number") {
        flatness = xtract_flatness(spectrum);
    }
    return 10.0 * Math.log10(flatness);
}

function xtract_tonality(spectrum, flatness_db) {
    if (!xtract_assert_array(spectrum))
        return 0;
    if (typeof flatness_db !== "number") {
        flatness_db = xtract_flatness_db(spectrum);
    }
    return Math.min(flatness_db / -60.0, 1);
}

function xtract_crest(data, max, mean) {
    if (!xtract_assert_array(data))
        return 0;
    if (typeof max !== "number") {
        max = xtract_array_max(data);
    }
    if (typeof mean !== "number") {
        mean = xtract_mean(data);
    }
    return max / mean;
}

function xtract_noisiness(h, p) {
    var i = 0.0;
    if (typeof h !== "number" && typeof p !== "number") {
        return 0;
    }
    i = p - h;
    return i / p;
}

function xtract_rms_amplitude(timeArray) {
    if (!xtract_assert_array(timeArray))
        return 0;
    var result = 0;
    if (timeArray.reduce) {
        result = timeArray.reduce(function (a, b) {
            return a + b * b;
        }, 0);
    } else {
        for (var n = 0; n < timeArray.length; n++) {
            result += timeArray[n] * timeArray[n];
        }
    }
    return Math.sqrt(result / timeArray.length);
}

function xtract_spectral_inharmonicity(peakSpectrum, f0) {
    if (!xtract_assert_array(peakSpectrum))
        return 0;
    if (typeof f0 !== "number") {
        console.error("spectral_inharmonicity requires f0 to be defined.");
        return null;
    }
    var h = 0,
        num = 0.0,
        den = 0.0;
    var N = peakSpectrum.length;
    var K = N >> 1;
    var amps = peakSpectrum.subarray(0, n);
    var freqs = peakSpectrum.subarray(n);
    for (var n = 0; n < K; n++) {
        if (amps[n] !== 0.0) {
            h = Math.floor(freqs[n] / f0 + 0.5);
            var mag_sq = Math.pow(amps[n], 2);
            num += Math.abs(freqs[n] - h * f0) * mag_sq;
            den += mag_sq;
        }
    }
    return (2 * num) / (f0 * den);
}

function xtract_power(magnitudeArray) {
    return null;
}

function xtract_odd_even_ratio(harmonicSpectrum, f0) {
    if (!xtract_assert_array(harmonicSpectrum))
        return 0;
    if (typeof f0 !== "number") {
        console.error("spectral_inharmonicity requires f0 to be defined.");
        return null;
    }
    var h = 0,
        odd = 0.0,
        even = 0.0,
        temp;
    var N = harmonicSpectrum.length;
    var K = N >> 1;
    var amps = harmonicSpectrum.subarray(0, n);
    var freqs = harmonicSpectrum.subarray(n);
    for (var n = 0; n < K; n++) {
        temp = amps[n];
        if (temp !== 0.0) {
            h = Math.floor(freqs[n] / f0 + 0.5);
            if (h % 2 !== 0) {
                odd += temp;
            } else {
                even += temp;
            }
        }
    }

    if (odd === 0.0 || even === 0.0) {
        return 0.0;
    } else {
        return odd / even;
    }
}

function xtract_sharpness(barkBandsArray) {
    if (!xtract_assert_array(barkBandsArray))
        return 0;
    var N = barkBandsArray.length;

    var rv, sl = 0.0,
        g = 0.0,
        temp = 0.0;
    for (var n = 0; n < N; n++) {
        sl = Math.pow(barkBandsArray[n], 0.23);
        g = (n < 15 ? 1.0 : 0.066 * Math.exp(0.171 * n));
        temp += n * g * sl;
    }
    temp = 0.11 * temp / N;
    return temp;
}

function xtract_spectral_slope(spectrum) {
    if (!xtract_assert_array(spectrum))
        return 0;
    var F = 0.0,
        FA = 0.0,
        A = 0.0,
        FXTRACT_SQ = 0.0;
    var N = spectrum.length;
    var M = N >> 1;
    var amps = spectrum.subarray(0, M);
    var freqs = spectrum.subarray(M);
    F = xtract_array_sum(freqs);
    A = xtract_array_sum(amps);
    for (var n = 0; n < M; n++) {
        FA += freqs[n] * amps[n];
        FXTRACT_SQ += freqs[n] * freqs[n];
    }
    return (1.0 / A) * (M * FA - F * A) / (M * FXTRACT_SQ - F * F);
}

function xtract_lowest_value(data, threshold) {
    if (!xtract_assert_array(data))
        return 0;
    if (data.filter && data.reduce) {
        var interim;
        if (typeof threshold === "number") {
            interim = data.filter(function (a) {
                return a > threshold;
            });
            if (interim.length === 0) {
                return +Infinity;
            }
        } else {
            interim = data;
        }
        return xtract_array_min(interim);
    } else {
        if (typeof threshold !== "number") {
            threshold = -Infinity;
        }
        var result = +Infinity;
        for (var n = 0; n < data.length; n++) {
            if (data[n] > threshold) {
                result = Math.min(result, data[n]);
            }
        }
        return result;
    }
}

function xtract_highest_value(data, threshold) {
    if (!xtract_assert_array(data))
        return 0;
    if (data.filter && data.reduce) {
        var interim;
        if (typeof threshold === "number") {
            interim = data.filter(function (a) {
                return (a >= threshold);
            });
            if (interim.length === 0) {
                return +Infinity;
            }
        } else {
            interim = data;
        }
        return xtract_array_max(interim);
    } else {
        if (typeof threshold !== "number") {
            threshold = -Infinity;
        }
        var result = +Infinity;
        for (var n = 0; n < data.length; n++) {
            if (data[n] >= threshold) {
                result = Math.max(result, data[n]);
            }
        }
        return result;
    }
}

function xtract_sum(data) {
    if (!xtract_assert_array(data))
        return 0;
    return xtract_array_sum(data);
}

function xtract_nonzero_count(data) {
    if (!xtract_assert_array(data))
        return 0;
    var count = 0;
    if (data.reduce) {
        return data.reduce(function (a, b) {
            if (b !== 0) {
                a++;
            }
            return a;
        });
    }
    for (var n = 0; n < data.length; n++) {
        if (data[n] !== 0) {
            count++;
        }
    }
    return count;
}

function xtract_hps(spectrum) {
    if (!xtract_assert_array(spectrum))
        return 0;
    var peak_index = 0,
        position1_lwr = 0,
        largest1_lwr = 0,
        tempProduct = 0,
        peak = 0,
        ratio1 = 0;
    var N = spectrum.length;
    var K = N >> 1;
    var amps = spectrum.subarray(0, K);
    var freqs = spectrum.subarray(K);
    var M = Math.ceil(K / 3.0);
    var i;
    if (M <= 1) {
        console.error("Input Data is too short for HPS");
        return null;
    }

    for (i = 0; i < M; ++i) {
        tempProduct = amps[i] * amps[i * 2] * amps[i * 3];
        if (tempProduct > peak) {
            peak = tempProduct;
            peak_index = i;
        }
    }

    for (i = 0; i < K; i++) {
        if (amps[i] > largest1_lwr && i !== peak_index) {
            largest1_lwr = amps[i];
            position1_lwr = i;
        }
    }

    ratio1 = amps[position1_lwr] / amps[peak_index];

    if (position1_lwr > peak_index * 0.4 && position1_lwr < peak_index * 0.6 && ratio1 > 0.1)
        peak_index = position1_lwr;

    return freqs[peak_index];
}

function xtract_f0(timeArray, sampleRate) {
    if (!xtract_assert_array(timeArray))
        return 0;
    if (typeof sampleRate !== "number") {
        sampleRate = 44100.0;
    }
    var sub_arr = xtract_array_copy(timeArray);
    var N = sub_arr.length;
    var M = N / 2;
    var n;

    var threshold_peak = 0.8,
        threshold_centre = 0.3,
        err_tau_1 = 0,
        array_max = 0;

    array_max = xtract_array_max(sub_arr);
    threshold_peak *= array_max;
    threshold_centre *= array_max;

    sub_arr = xtract_array_bound(sub_arr, -threshold_peak, threshold_peak);

    for (n = 0; n < sub_arr.length; n++) {
        sub_arr[n] = Math.max(0, sub_arr[n] - threshold_centre);
    }

    for (n = 1; n < M; n++) {
        err_tau_1 += Math.abs(sub_arr[n] - sub_arr[n + 1]);
    }
    for (var tau = 2; tau < M; tau++) {
        var err_tau_x = 0;
        for (n = 1; n < M; n++) {
            err_tau_x += Math.abs(sub_arr[n] - sub_arr[n + tau]);
        }
        if (err_tau_x < err_tau_1) {
            return sampleRate / (tau + (err_tau_x / err_tau_1));
        }
    }
    return -0;
}

function xtract_failsafe_f0(timeArray, sampleRate) {
    return xtract_f0(timeArray, sampleRate);
}

function xtract_wavelet_f0(timeArray, sampleRate, pitchtracker) {
    if (!xtract_assert_array(timeArray))
        return 0;
    if (pitchtracker === undefined) {
        throw ("xtract_wavelet_f0 requires pitchtracker to be defined");
    }
    if (xtract_array_sum(timeArray) === 0) {
        return;
    }

    function _power2p(value) {
        if (value === 0) {
            return 1;
        }
        if (value === 2) {
            return 1;
        }
        if (value & 0x1) {
            return 0;
        }
        return (_power2p(value >> 1));
    }

    function _bitcount(value) {
        if (value === 0) {
            return 0;
        }
        if (value === 1) {
            return 1;
        }
        if (value === 2) {
            return 2;
        }
        return _bitcount(value >> 1) + 1;
    }

    function _ceil_power2(value) {
        if (_power2p(value)) {
            return value;
        }

        if (value === 1) {
            return 2;
        }
        var j, i = _bitcount(value);
        var res = 1;
        for (j = 0; j < i; j++) {
            res <<= 1;
        }
        return res;
    }

    function _floor_power2(value) {
        if (_power2p(value)) {
            return value;
        }
        return _ceil_power2(value) / 2;
    }

    function _iabs(x) {
        if (x >= 0) return x;
        return -x;
    }

    function _2power(i) {
        var res = 1,
            j;
        for (j = 0; j < i; j++) {
            res <<= 1;
        }
        return res;
    }

    function dywapitch_neededsamplecount(minFreq) {
        var nbSam = 3 * 44100 / minFreq; // 1017. for 130 Hz
        nbSam = _ceil_power2(nbSam); // 1024
        return nbSam;
    }

    var _minmax = {
        index: undefined,
        next: undefined
    };
    //_dywapitch_computeWaveletPitch(samples, startsample, samplecount)
    var samples = timeArray,
        startsample = 0,
        samplecount = timeArray.length;
    var pitchF = 0.0;
    var i, j, si, si1;

    samplecount = _floor_power2(samplecount);
    var sam = new Float64Array(samplecount);
    for (i = 0; i < samplecount; i++) {
        sam[i] = samples[i];
    }

    var curSamNb = samplecount;

    var distances = new Int32Array(samplecount);
    var mins = new Int32Array(samplecount);
    var maxs = new Int32Array(samplecount);
    var nbMins, nbMaxs;

    var maxFLWTlevels = 6;
    var maxF = 3000;
    var differenceLevelsN = 3;
    var maximaThresholdRatio = 0.75;

    var ampltitudeThreshold;
    var theDC = 0.0;
    var maxValue = 0.0;
    var minValue = 0.0;
    for (i = 0; i < samplecount; i++) {
        si = sam[i];
        theDC = theDC + si;
        if (si > maxValue) {
            maxValue = si;
        }
        if (si < minValue) {
            minValue = si;
        }
    }
    theDC = theDC / samplecount;
    maxValue = maxValue - theDC;
    minValue = minValue - theDC;
    var amplitudeMax = (maxValue > -minValue ? maxValue : -minValue);

    ampltitudeThreshold = amplitudeMax * maximaThresholdRatio;

    var curLevel = 0;
    var curModeDistance = -1;
    var delta;

    var cont = true;

    while (cont) {
        delta = Math.floor(44100 / (_2power(curLevel) * maxF));
        if (curSamNb < 2) {
            cont = false;
            break;
        }

        var dv, previousDV = -1000;
        nbMins = nbMaxs = 0;
        var lastMinIndex = -1000000;
        var lastmaxIndex = -1000000;
        var findMax = 0;
        var findMin = 0;

        for (i = 2; i < curSamNb; i++) {
            si = sam[i] - theDC;
            si1 = sam[i - 1] - theDC;

            if (si1 <= 0 && si > 0) {
                findMax = 1;
            }
            if (si1 >= 0 && si < 0) {
                findMin = 1;
            }

            // min or max ?
            dv = si - si1;

            if (previousDV > -1000) {

                if (findMin && previousDV < 0 && dv >= 0) {
                    // minimum
                    if (Math.abs(si) >= ampltitudeThreshold) {
                        if (i > lastMinIndex + delta) {
                            mins[nbMins++] = i;
                            lastMinIndex = i;
                            findMin = 0;
                        }
                    }
                }

                if (findMax && previousDV > 0 && dv <= 0) {
                    // maximum
                    if (Math.abs(si) >= ampltitudeThreshold) {
                        if (i > lastmaxIndex + delta) {
                            maxs[nbMaxs++] = i;
                            lastmaxIndex = i;
                            findMax = 0;
                        }
                    }
                }
            }

            previousDV = dv;
        }

        if (nbMins === 0 && nbMaxs === 0) {
            cont = false;
            break;
        }

        var d;
        //memset(distances, 0, samplecount*sizeof(int));
        for (i = 0; i < samplecount; i++) {
            distances[i] = 0.0;
        }
        for (i = 0; i < nbMins; i++) {
            for (j = 1; j < differenceLevelsN; j++) {
                if (i + j < nbMins) {
                    d = _iabs(mins[i] - mins[i + j]);
                    distances[d] = distances[d] + 1;
                }
            }
        }
        for (i = 0; i < nbMaxs; i++) {
            for (j = 1; j < differenceLevelsN; j++) {
                if (i + j < nbMaxs) {
                    d = _iabs(maxs[i] - maxs[i + j]);
                    //asLog("dywapitch i=%ld j=%ld d=%ld\n", i, j, d);
                    distances[d] = distances[d] + 1;
                }
            }
        }

        var bestDistance = -1;
        var bestValue = -1;
        for (i = 0; i < curSamNb; i++) {
            var summed = 0;
            for (j = -delta; j <= delta; j++) {
                if (i + j >= 0 && i + j < curSamNb)
                    summed += distances[i + j];
            }
            //asLog("dywapitch i=%ld summed=%ld bestDistance=%ld\n", i, summed, bestDistance);
            if (summed === bestValue) {
                if (i === 2 * bestDistance)
                    bestDistance = i;

            } else if (summed > bestValue) {
                bestValue = summed;
                bestDistance = i;
            }
        }

        var distAvg = 0.0;
        var nbDists = 0;
        for (j = -delta; j <= delta; j++) {
            if (bestDistance + j >= 0 && bestDistance + j < samplecount) {
                var nbDist = distances[bestDistance + j];
                if (nbDist > 0) {
                    nbDists += nbDist;
                    distAvg += (bestDistance + j) * nbDist;
                }
            }
        }
        // this is our mode distance !
        distAvg /= nbDists;

        // continue the levels ?
        if (curModeDistance > -1.0) {
            var similarity = Math.abs(distAvg * 2 - curModeDistance);
            if (similarity <= 2 * delta) {
                //if DEBUGG then put "similarity="&similarity&&"delta="&delta&&"ok"
                //asLog("dywapitch similarity=%f OK !\n", similarity);
                // two consecutive similar mode distances : ok !
                pitchF = 44100 / (_2power(curLevel - 1) * curModeDistance);
                cont = false;
                break;
            }
            //if DEBUGG then put "similarity="&similarity&&"delta="&delta&&"not"
        }

        // not similar, continue next level
        curModeDistance = distAvg;

        curLevel = curLevel + 1;
        if (curLevel >= maxFLWTlevels) {
            // put "max levels reached, exiting"
            //asLog("dywapitch max levels reached, exiting\n");
            cont = false;
            break;
        }

        // downsample
        if (curSamNb < 2) {
            //asLog("dywapitch not enough samples, exiting\n");
            cont = false;
            break;
        }
        for (i = 0; i < curSamNb / 2; i++) {
            sam[i] = (sam[2 * i] + sam[2 * i + 1]) / 2.0;
        }
        curSamNb /= 2;
    }

    //_dywapitch_dynamicprocess(pitchtracker, pitch)
    return (function (pitchtracker, pitch) {
        if (pitch === 0.0) {
            return -1.0;
        }

        var estimatedPitch = -1,
            acceptedError = 0.2,
            maxConfidence = 5;
        if (pitch !== -1) {
            // I have a pitch here

            if (pitchtracker._prevPitch === -1) {
                // no Previous
                estimatedPitch = pitch;
                pitchtracker._prevPitch = pitch;
                pitchtracker._pitchConfidence = 1;
            } else if (Math.abs(pitchtracker._prevPitch - pitch) / pitch < acceptedError) {
                // similar: remember and increment
                pitchtracker._prevPitch = pitch;
                estimatedPitch = pitch;
                pitchtracker._pitchConfidence = Math.min(maxConfidence, pitchtracker._pitchConfidence + 1);
            } else if ((pitchtracker._pitchConfidence >= maxConfidence - 2) && Math.abs(pitchtracker._pitchConfidence - 2 * pitch) / (2 * pitch) < acceptedError) {
                // close to half the last pitch, which is trusted
                estimatedPitch = 2 * pitch;
                pitchtracker._prevPitch = estimatedPitch;
            } else if ((pitchtracker._pitchConfidence >= maxConfidence - 2) && Math.abs(pitchtracker._pitchConfidence - 0.5 * pitch) / (0.5 * pitch) < acceptedError) {
                estimatedPitch = 0.5 * pitch;
                pitchtracker._prevPitch = estimatedPitch;
            } else {
                // Very different value
                if (pitchtracker._pitchConfidence >= 1) {
                    // previous trusted
                    estimatedPitch = pitchtracker._prevPitch;
                    pitchtracker._pitchConfidence = Math.max(0, pitchtracker._pitchConfidence - 1);
                } else {
                    estimatedPitch = pitch;
                    pitchtracker._prevPitch = pitch;
                    pitchtracker._pitchConfidence = 1;
                }
            }
        } else {
            // No pitch
            if (pitchtracker._prevPitch !== -1) {
                // was a pitch before
                if (pitchtracker._pitchConfidence >= 1) {
                    // previous trusted
                    estimatedPitch = pitchtracker._prevPitch;
                    pitchtracker._pitchConfidence = Math.max(0, pitchtracker._pitchConfidence - 1);
                } else {
                    pitchtracker._prevPitch = -1;
                    estimatedPitch = -1;
                    pitchtracker._pitchConfidence = 0;
                }
            }
        }

        if (pitchtracker._pitchConfidence >= 1) {
            pitch = estimatedPitch;
        } else {
            pitch = -1;
        }
        if (pitch === -1) {
            pitch = 0.0;
        }
        return pitch;
    })(pitchtracker, pitchF);
}

function xtract_midicent(f0) {
    if (typeof f0 !== "number") {
        return -1;
    }
    var note = 0.0;
    note = 69 + Math.log(f0 / 440.0) * 17.31234;
    note *= 100;
    note = Math.round(0.5 + note);
    return note;
}

function xtract_spectral_fundamental(spectrum, sample_rate) {
    // Based on work by Motegi and Shimamura
    if (!xtract_assert_array(spectrum))
        return 0;

    function peak_picking(E, window) {
        var o = [],
            N = E.length,
            n;
        if (window === undefined) {
            window = 5;
        }
        for (n = window; n < N - window - 1; n++) {
            var max = 1,
                m;
            for (m = -window; m < window - 1; m++) {
                if (E[n + m] > E[n]) {
                    max = 0;
                    break;
                }
            }
            if (max === 1) {
                o.push(n);
            }
        }
        return o;
    }

    var N = spectrum.length >> 1;
    var amps = spectrum.subarray(0, N);
    var freqs = spectrum.subarray(N);
    var K = N * 2;

    // Create the power spectrum
    var power = new Float64Array(K);
    var n;
    for (n = 0; n < N; n++) {
        power[n] = Math.pow(amps[n], 2);
        power[K - 1 - n] = power[n];
    }

    // Perform autocorrelation using IFFT
    var R = new Float64Array(K);
    inverseTransform(power, R);
    R = undefined;
    R = power;
    power = undefined;

    // Get the peaks
    var p = peak_picking(R, 5);
    if (p.length === 0) {
        return 0;
    }
    p = p[0];

    p = p / sample_rate;
    p = 1 / p;
    return p;
}

/* Vector.c */

function xtract_energy(array, sample_rate, window_ms) {
    if (!xtract_assert_array(array))
        return 0;
    if (typeof sample_rate !== "number") {
        console.error("xtract_energy requires sample_rate to be defined");
        return;
    }
    if (typeof window_ms !== "number") {
        window_ms = 100;
    }
    if (window_ms <= 0) {
        window_ms = 100;
    }
    var N = array.length;
    var L = Math.floor(sample_rate * (window_ms / 1000.0));
    var K = Math.ceil(N / L);
    var result = new Float64Array(K);
    for (var k = 0; k < K; k++) {
        var frame = array.subarray(k * L, k * L + L);
        var rms = xtract_rms_amplitude(frame);
        result[k] = rms;
    }
    return result;
}

function xtract_spectrum(array, sample_rate, withDC, normalise) {
    if (!xtract_assert_array(array))
        return 0;
    if (typeof sample_rate !== "number") {
        console.error("Sample Rate must be defined");
        return null;
    }
    if (withDC === undefined) {
        withDC = false;
    }
    if (normalise === undefined) {
        normalise = false;
    }
    var N = array.length;
    var result, align = 0;
    var amps;
    var freqs;
    if (withDC) {
        result = new Float64Array(N + 2);
    } else {
        align = 1;
        result = new Float64Array(N);
    }
    amps = result.subarray(0, result.length / 2);
    freqs = result.subarray(result.length / 2);
    var reals = new Float64Array(N);
    var imags = new Float64Array(N);
    for (var i = 0; i < N; i++) {
        reals[i] = array[i];
    }
    transform(reals, imags);
    for (var k = align; k <= result.length / 2; k++) {
        amps[k - align] = Math.sqrt((reals[k] * reals[k]) + (imags[k] * imags[k])) / array.length;
        freqs[k - align] = (2 * k / N) * (sample_rate / 2);
    }
    if (normalise) {
        amps = xtract_array_normalise(amps);
    }
    return result;
}

function xtract_complex_spectrum(array, sample_rate, withDC) {
    if (!xtract_assert_array(array))
        return 0;
    if (typeof sample_rate !== "number") {
        console.error("Sample Rate must be defined");
        return null;
    }
    if (withDC === undefined) {
        withDC = false;
    }
    var N = array.length;
    var result, align = 0,
        amps, freqs;
    if (withDC) {
        result = new Float64Array(3 * (N / 2 + 1));
    } else {
        align = 1;
        result = new Float64Array(3 * (N / 2));
    }
    amps = result.subarray(0, 2 * (result.length / 3));
    freqs = result.subarray(2 * (result.length / 3));
    var reals = new Float64Array(N);
    var imags = new Float64Array(N);
    for (var i = 0; i < N; i++) {
        reals[i] = array[i];
    }
    transform(reals, imags);
    for (var k = align; k <= reals.length / 2; k++) {
        amps[(k - align) * 2] = reals[k];
        amps[(k - align) * 2 + 1] = imags[k];
        freqs[k - align] = (2 * k / N) * (sample_rate / 2);
    }
    return result;
}

function xtract_mfcc(spectrum, mfcc) {
    if (!xtract_assert_array(spectrum))
        return 0;
    if (typeof mfcc !== "object") {
        throw ("Invalid MFCC, must be MFCC object built using xtract_init_mfcc");
    }
    if (mfcc.n_filters === 0) {
        throw ("Invalid MFCC, object must be built using xtract_init_mfcc");
    }
    var K = spectrum.length >> 1;
    if (mfcc.filters[0].length !== K) {
        throw ("Lengths do not match");
    }
    var result = new Float64Array(mfcc.n_filters);
    for (var f = 0; f < mfcc.n_filters; f++) {
        result[f] = 0.0;
        var filter = mfcc.filters[f];
        for (var n = 0; n < filter.length; n++) {
            result[f] += spectrum[n] * filter[n];
        }
        if (result[f] < 2e-42) {
            result[f] = 2e-42;
        }
        result[f] = Math.log(result[f]);
    }
    return xtract_dct(result);
}

function xtract_dct(array) {
    if (!xtract_assert_array(array))
        return 0;
    var N = array.length;
    var result = new Float64Array(N);
    if (array.reduce) {
        result.forEach(function (e, i, a) {
            var nN = i / N;
            a[i] = array.reduce(function (r, d, m) {
                return r + d * Math.cos(Math.PI * nN * (m + 0.5));
            });
        });
    } else {
        for (var n = 0; n < N; n++) {
            var nN = n / N;
            for (var m = 0; m < N; m++) {
                result[n] += array[m] * Math.cos(Math.PI * nN * (m + 0.5));
            }
        }
    }
    return result;
}

function xtract_dct_2(array, dct) {
    if (!xtract_assert_array(array))
        return 0;
    var N = array.length;
    if (dct === undefined) {
        dct = xtract_init_dct(N);
    }
    var result = new Float64Array(N);
    result[0] = xtract_array_sum(array);
    if (result.forEach && array.reduce) {
        result.forEach(function (e, k, ar) {
            ar[k] = array.reduce(function (a, b, n) {
                return a + b * dct.wt[k][n];
            });
        });
    } else {
        for (var k = 1; k < N; k++) {
            for (var n = 0; n < N; n++) {
                result[k] += array[n] * dct.wt[k][n];
            }
        }
    }
    return result;
}

function xtract_autocorrelation(array) {
    if (!xtract_assert_array(array))
        return 0;
    var n = array.length;
    var result = new Float64Array(n);
    while (n--) {
        var corr = 0;
        for (var i = 0; i < array.length - n; i++) {
            corr += array[i] * array[i + n];
        }
        result[n] = corr / array.length;
    }
    return result;
}

function xtract_amdf(array) {
    if (!xtract_assert_array(array))
        return 0;
    var n = array.length;
    var result = new Float64Array(n);
    while (n--) {
        var md = 0.0;
        for (var i = 0; i < array.length - n; i++) {
            md += Math.abs(array[i] - array[i + n]);
        }
        result[n] = md / array.length;
    }
    return result;
}

function xtract_asdf(array) {
    if (!xtract_assert_array(array))
        return 0;
    var n = array.length;
    var result = new Float64Array(n);
    while (n--) {
        var sd = 0.0;
        for (var i = 0; i < array.length - n; i++) {
            sd += Math.pow(array[i] - array[i + n], 2);
        }
        result[n] = sd / array.length;
    }
    return result;
}

function xtract_bark_coefficients(spectrum, bark_limits) {
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

function xtract_peak_spectrum(spectrum, q, threshold) {
    if (!xtract_assert_array(spectrum))
        return 0;
    var N = spectrum.length;
    var K = N >> 1;
    var max = 0.0,
        y = 0.0,
        y2 = 0.0,
        y3 = 0.0,
        p = 0.0;
    if (typeof q !== "number") {
        throw ("xtract_peak_spectrum requires second argument to be sample_rate/N");
    }
    if (threshold < 0 || threshold > 100) {
        threshold = 0;
    }
    var result = new Float64Array(N);
    var ampsIn = spectrum.subarray(0, K);
    var freqsIn = spectrum.subarray(K);
    var ampsOut = result.subarray(0, K);
    var freqsOut = result.subarray(K);
    max = xtract_array_max(ampsIn);
    threshold *= 0.01 * max;
    for (var n = 1; n < N - 1; n++) {
        if (ampsIn[n] >= threshold) {
            if (ampsIn[n] > ampsIn[n - 1] && ampsIn[n] > ampsIn[n + 1]) {
                y = ampsIn[n - 1];
                y2 = ampsIn[n];
                y3 = ampsIn[n + 1];
                p = 0.5 * (y - y3) / (ampsIn[n - 1] - 2 * (y2 + ampsIn[n + 1]));
                freqsOut[n] = q * (n + 1 + p);
                ampsOut[n] = y2 - 0.25 * (y - y3) * p;
            } else {
                ampsOut[n] = 0;
                freqsOut[n] = 0;
            }
        } else {
            ampsOut[n] = 0;
            freqsOut[n] = 0;
        }
    }
    return result;
}

function xtract_harmonic_spectrum(peakSpectrum, f0, threshold) {
    if (!xtract_assert_array(peakSpectrum))
        return 0;
    var N = peakSpectrum.length;
    var K = N >> 1;
    var result = new Float64Array(N);
    var ampsIn = peakSpectrum.subarray(0, K);
    var freqsIn = peakSpectrum.subarray(K);
    var ampsOut = result.subarray(0, K);
    var freqsOut = result.subarray(K);
    var n = K;
    if (f0 === undefined || threshold === undefined) {
        throw ("harmonic_spectrum requires f0 and threshold to be numbers and defined");
    }
    if (threshold > 1) {
        threshold /= 100.0;
    }
    while (n--) {
        if (freqsIn[n] !== 0.0) {
            var ratio = freqsIn[n] / f0;
            var nearest = Math.round(ratio);
            var distance = Math.abs(nearest - ratio);
            if (distance > threshold) {
                ampsOut[n] = 0.0;
                freqsOut[n] = 0.0;
            } else {
                ampsOut[n] = ampsIn[n];
                freqsOut[n] = freqsIn[n];
            }
        } else {
            result[n] = 0.0;
            freqsOut[n] = 0.0;
        }
    }
    return result;
}

function xtract_lpc(autocorr) {
    if (!xtract_assert_array(autocorr))
        return 0;
    var i, j, r, error = autocorr[0];
    var N = autocorr.length;
    var L = N - 1;
    var lpc = new Float64Array(L);
    var ref = new Float64Array(L);
    if (error === 0.0) {
        return lpc;
    }

    for (i = 0; i < L; i++) {
        r = -autocorr[i + 1];
        for (j = 0; j < i; j++) {
            r -= lpc[j] * autocorr[i - j];
        }
        r /= error;
        ref[i] = r;

        lpc[i] = r;
        for (j = 0; j < (i >> 1); j++) {
            var tmp = lpc[j];
            lpc[j] += r * lpc[i - 1 - j];
            lpc[i - 1 - j] += r * tmp;
        }
        if (i % 2) {
            lpc[j] += lpc[j] * r;
        }
        error *= 1.0 - r * r;
    }
    return lpc;
}

function xtract_lpcc(lpc, Q) {
    if (!xtract_assert_array(lpc))
        return 0;
    var N = lpc.length;
    var n, k, sum, order = N - 1,
        cep_length;
    if (typeof Q !== "number") {
        Q = N - 1;
    }
    cep_length = Q;

    var result = new Float64Array(cep_length);
    for (n = 1; n < Q && n < cep_length; n++) {
        sum = 0;
        for (k = 1; k < n; k++) {
            sum += k * result[k - 1] * lpc[n - k];
        }
        result[n - 1] = lpc[n] + sum / n;
    }

    for (n = order + 1; n <= cep_length; n++) {
        sum = 0.0;
        for (k = n - (order - 1); k < n; k++) {
            sum += k * result[k - 1] * lpc[n - k];
        }
        result[n - 1] = sum / n;
    }
    return result;
}

function xtract_pcp(spectrum, M, fs) {
    if (!xtract_assert_array(spectrum))
        return 0;
    var N = spectrum.length >> 1;
    if (typeof M !== "object") {
        if (typeof fs !== "number" || fs <= 0.0) {
            throw ("Cannot dynamically compute M if fs is undefined / not a valid sample rate");
        }
        M = xtract_init_pcp(N, fs);
    }
    var amps = spectrum.subarray(1, N);
    var PCP = new Float64Array(12);
    for (var l = 0; l < amps.length; l++) {
        var p = M[l];
        PCP[l] += Math.pow(Math.abs(amps[l]), 2);
    }
    return PCP;
}

function xtract_yin(array) {
    // Uses the YIN process
    if (!xtract_assert_array(array))
        return 0;
    var T = array.length;
    var d = new Float64Array(array.length);
    var r = new array.constructor(array.length);

    var d_sigma = 0;
    for (var tau = 1; tau < T; tau++) {
        var sigma = 0;
        for (var t = 1; t < T - tau; t++) {
            sigma += Math.pow(array[t] - array[t + tau], 2);
        }
        d[tau] = sigma;
        d_sigma += sigma;
        r[tau] = d[tau] / ((1 / tau) * d_sigma);
    }
    return r;
}

function xtract_onset(timeData, frameSize) {
    if (!xtract_assert_array(timeData))
        return 0;
    if (frameSize === undefined) {
        throw ("All arguments for xtract_onset must be defined: xtract_onset(timeData, frameSize)");
    }

    var frames = xtract_get_data_frames(timeData, frameSize, frameSize, false);
    var N = frames.length;
    var X = [];
    var real = new Float64Array(frameSize);
    var imag = new Float64Array(frameSize);
    var K = frameSize / 2 + 1;
    var n;
    for (var i = 0; i < N; i++) {
        for (n = 0; n < frameSize; n++) {
            real[n] = frames[i][n];
            imag[n] = 0.0;
        }
        transform(real, imag);
        X[i] = xtract_array_interlace([real.subarray(0, K), imag.subarray(0, K)]);
    }

    function angle(real, imag) {
        if (imag === undefined && real.length === 2) {
            return Math.atan2(real[1], real[0]);
        }
        return Math.atan2(imag, real);
    }

    function abs(real, imag) {
        if (imag === undefined && real.length === 2) {
            return Math.sqrt(Math.pow(real[0], 2) + Math.pow(real[1], 2));
        }
        return Math.sqrt(Math.pow(real, 2) + Math.pow(imag, 2));
    }

    function princarg(phaseIn) {
        //phase=mod(phasein+pi,-2*pi)+pi;
        return (phaseIn + Math.PI) % (-2 * Math.PI) + Math.PI;
    }

    function complex_mul(cplx_pair_A, cplx_pair_B) {
        if (cplx_pair_A.length !== 2 || cplx_pair_B.length !== 2) {
            throw ("Both arguments must be numeral arrays of length 2");
        }
        var result = new cplx_pair_A.constructor(2);
        result[0] = cplx_pair_A[0] * cplx_pair_B[0] - cplx_pair_A[1] * cplx_pair_B[1];
        result[1] = cplx_pair_A[0] * cplx_pair_B[1] + cplx_pair_A[1] * cplx_pair_B[0];
        return result;
    }

    var E = new timeData.constructor(N);
    for (var k = 0; k < K; k++) {
        var phase_prev = angle(X[0].subarray(2 * k, 2 * k + 2));
        var phase_delta = angle(X[0].subarray(2 * k, 2 * k + 2));
        for (n = 1; n < N; n++) {
            var phi = princarg(phase_prev + phase_delta);
            var exp = [Math.cos(phi), Math.sin(phi)];
            var XT = complex_mul(X[n].subarray(2 * k, 2 * k + 2), exp);
            XT[0] = X[n][2 * k] - XT[0];
            XT[1] = X[n][2 * k + 1] - XT[1];
            E[n] += abs(XT);
            var phase_now = angle(X[n].subarray(2 * k, 2 * k + 2));
            phase_delta = phase_now - phase_prev;
            phase_prev = phase_now;
        }
    }

    for (n = 0; n < N; n++) {
        E[n] /= frameSize;
    }
    return E;
}

function xtract_resample(data, p, q, n) {
    if (!xtract_assert_array(data))
        return 0;
    // Same function call as matlab:
    // data is the array
    // p is the target sample rate
    // q is the source sample rate
    // n is the desired filter order, n==1024 if undefined

    function filter(N, c) {
        var c_b, Re, Im, b;
        c_b = Math.floor(c * N);
        Re = new Float64Array(N);
        Im = new Float64Array(N);
        var i, j;
        for (i = 0; i < c_b; i++) {
            Re[i] = 1;
        }
        for (i = N - c_b + 1; i < N; i++) {
            Re[i] = 1;
        }
        inverseTransform(Re, Im);
        // Scale and shift into Im
        for (i = 0; i < N; i++) {
            j = (i + (N >> 1)) % N;
            Im[i] = Re[j] / N;
            // Apply compute blackman-harris to Im
            var rad = (Math.PI * i) / (N);
            Im[i] *= 0.35875 - 0.48829 * Math.cos(2 * rad) + 0.14128 * Math.cos(4 * rad) - 0.01168 * Math.cos(6 * rad);
        }
        return Im;
    }

    function polyn(data, K) {
        var N = data.length;
        var x = [0, data[0], data[1]];
        var dst = new Float64Array(K);
        var ratio = K / N;
        var tinc = 1 / ratio;
        var n = 0,
            t = 0,
            k;
        for (k = 0; k < K; k++) {
            if (t === n) {
                // Points lie on same time
                dst[k] = data[n];
            } else {
                var y = (t - n - 1) * (t - n) * x[0] - 2 * (t - n - 1) * (t - n + 1) * x[1] + (t - n) * (t - n + 1) * x[2];
                dst[k] = y / 2;
            }
            t += tinc;
            if (t >= n + 1) {
                n = Math.floor(t);
                x[0] = data[n - 1];
                x[1] = data[n];
                if (n + 1 < N) {
                    x[2] = data[n + 1];
                } else {
                    x[2] = 0.0;
                }
            }
        }
        return dst;
    }

    function zp(a) {
        var b = new Float64Array(a.length * 2);
        for (var n = 0; n < a.length; n++) {
            b[n] = a[n];
        }
        return b;
    }

    function r2c(x) {
        var real = zp(x);
        var imag = new Float64Array(real.length);
        transform(real, imag);
        return {
            real: real,
            imag: imag
        };
    }

    function W(N) {
        var w = new Float64Array(N);
        for (i = 0; i < N; i++) {
            var rad = (Math.PI * i) / (N);
            w[i] = 0.35875 - 0.48829 * Math.cos(2 * rad) + 0.14128 * Math.cos(4 * rad) - 0.01168 * Math.cos(6 * rad);
        }
        return w;
    }

    function overlap(X, b) {
        var i, f;
        var Y = new Float64Array(X.length);
        var N = b.length;
        var N2 = 2 * N;
        var B = r2c(b);
        var Xi = xtract_get_data_frames(X, N, N, false);
        var Yi = xtract_get_data_frames(Y, N, N, false);
        var x_last = new Float64Array(N);
        var y_last = new Float64Array(N);
        var w = W(N2);
        var xF = {
            real: new Float64Array(N2),
            imag: new Float64Array(N2)
        };
        var yF = {
            real: new Float64Array(N2),
            imag: new Float64Array(N2)
        };
        for (f = 0; f < Xi.length; f++) {
            for (i = 0; i < N; i++) {
                xF.real[i] = x_last[i] * w[i];
                xF.real[i + N] = Xi[f][i] * w[i + N];
                x_last[i] = Xi[f][i];
                xF.imag[i] = 0;
                xF.imag[i + N] = 0;
            }
            transform(xF.real, xF.imag);
            for (i = 0; i < N2; i++) {
                yF.real[i] = xF.real[i] * B.real[i] - xF.imag[i] * B.imag[i];
                yF.imag[i] = xF.imag[i] * B.real[i] + xF.real[i] * B.imag[i];
            }
            transform(yF.imag, yF.real);
            // Perform fft_shift and scale
            for (i = 0; i < N; i++) {
                var h = yF.real[i + N] / N;
                yF.real[i + N] = yF.real[i] / N;
                yF.real[i] = h;
            }
            for (i = 0; i < N; i++) {
                Yi[f][i] = (yF.real[i] + y_last[i]);
                y_last[i] = yF.real[i + N];
            }
        }
        return Y;
    }

    // Determine which way to go
    var b, N = data.length;
    if (typeof n !== "number" || n <= 0) {
        n = 512;
    }
    if (p === q) {
        return data;
    }
    var ratio = (p / q);
    var K = Math.floor(N * ratio);
    var dst;
    if (p > q) {
        // Upsampling
        // 1. Expand Data range
        dst = polyn(data, K);
        // 2. Filter out spurious energy above q
        b = filter(n, 1 / ratio);
        overlap(data, b);
    } else {
        // Downsampling
        // 1. Filter out energy above p
        b = filter(n, ratio / 2);
        var ds1 = overlap(data, b);
        // 2. Decrease data range
        dst = polyn(ds1, K);
    }
    return dst;
}

function xtract_init_dft(N) {
    var dft = {
        N: N / 2 + 1,
        real: [],
        imag: []
    };
    var power_const = -2.0 * Math.PI / N;
    for (var k = 0; k < dft.N; k++) {
        var power_k = power_const * k;
        dft.real[k] = new Float64Array(N);
        dft.imag[k] = new Float64Array(N);
        for (var n = 0; n < N; n++) {
            var power = power_k * n;
            dft.real[k][n] = Math.cos(power);
            dft.imag[k][n] = Math.sin(power);
        }
    }
    return dft;
}

function xtract_init_dct(N) {
    var dct = {
        N: N,
        wt: []
    };
    for (var k = 0; k < N; k++) {
        dct.wt[k] = new Float64Array(N);
        for (var n = 0; n < N; n++) {
            dct.wt[k][n] = Math.cos(Math.PI * k * (n + 0.5) / N);
        }
    }
    return dct;
}

function xtract_init_mfcc(N, nyquist, style, freq_min, freq_max, freq_bands) {
    var mfcc = {
        n_filters: freq_bands,
        filters: []
    };
    var norm = 1,
        M = N / 2,
        height, norm_fact, n;

    if (freq_bands <= 1) {
        return null;
    }
    var mel_freq_max = 1127 * Math.log(1 + freq_max / 700);
    var mel_freq_min = 1127 * Math.log(1 + freq_min / 700);
    var freq_bw_mel = (mel_freq_max - mel_freq_min) / freq_bands;

    var mel_peak = new Float64Array(freq_bands + 2);
    var lin_peak = new Float64Array(freq_bands + 2);
    var fft_peak = new Float64Array(freq_bands + 2);
    var height_norm = new Float64Array(freq_bands);
    mel_peak[0] = mel_freq_min;
    lin_peak[0] = freq_min;
    fft_peak[0] = Math.floor(lin_peak[0] / nyquist * M);

    for (n = 1; n < (freq_bands + 2); ++n) {
        //roll out peak locations - mel, linear and linear on fft window scale
        mel_peak[n] = mel_peak[n - 1] + freq_bw_mel;
        lin_peak[n] = 700 * (Math.exp(mel_peak[n] / 1127) - 1);
        fft_peak[n] = Math.floor(lin_peak[n] / nyquist * M);
    }

    for (n = 0; n < freq_bands; n++) {
        //roll out normalised gain of each peak
        if (style === "XTRACT_EQUAL_GAIN") {
            height = 1;
            norm_fact = norm;
        } else {
            height = 2 / (lin_peak[n + 2] - lin_peak[n]);
            norm_fact = norm / (2 / (lin_peak[2] - lin_peak[0]));
        }
        height_norm[n] = height * norm_fact;
    }

    var i = 0,
        inc;
    var next_peak;
    for (n = 0; n < freq_bands; n++) {
        // calculate the rise increment
        if (n === 0) {
            inc = height_norm[n] / fft_peak[n];
        } else {
            inc = height_norm[n] / (fft_peak[n] - fft_peak[n - 1]);
        }
        var val = 0;
        // Create array
        mfcc.filters[n] = new Float64Array(N);
        // fill in the rise
        for (; i <= fft_peak[n]; i++) {
            mfcc.filters[n][i] = val;
            val += inc;
        }
        // calculate the fall increment
        inc = height_norm[n] / (fft_peak[n + 1] - fft_peak[n]);

        val = 0;
        next_peak = fft_peak[n + 1];

        // reverse fill the 'fall'
        for (i = Math.floor(next_peak); i > fft_peak[n]; i--) {
            mfcc.filters[n][i] = val;
            val += inc;
        }
    }
    return mfcc;
}

function xtract_init_wavelet() {
    return {
        _prevPitch: -1,
        _pitchConfidence: -1
    };
}

function xtract_init_pcp(N, fs, f_ref) {
    if (typeof fs !== "number" || typeof N !== "number") {
        throw ('The Sample Rate and sample count have to be defined: xtract_init_pcp(N, fs, f_ref)');
    }
    if (N <= 0 || N !== Math.floor(N)) {
        throw ("The sample count, N, must be a positive integer: xtract_init_pcp(N, fs, f_ref)");
    }
    if (fs <= 0.0) {
        throw ('The Sample Rate must be a positive number: xtract_init_pcp(N, fs, f_ref)');
    }
    if (typeof f_ref !== "number" || f_ref <= 0.0 || f_ref >= fs / 2) {
        //("Assuming f_ref to be 48.9994294977Hz");
        f_ref = 48.9994294977;
    }

    var M = new Float64Array(N - 1);
    var fs2 = fs / 2;
    for (var l = 1; l < N; l++) {
        var f = (2 * l / N) * fs2;
        M[l - 1] = Math.round(12 * Math.log2((f / N) * f_ref)) % 12;
    }
    return M;
}

function xtract_init_bark(N, sampleRate, bands) {
    if (typeof bands !== "number" || bands < 0 || bands > 26) {
        bands = 26;
    }
    var edges = [0, 100, 200, 300, 400, 510, 630, 770, 920, 1080, 1270, 1480, 1720, 2000, 2320, 2700, 3150, 3700, 4400, 5300, 6400, 7700, 9500, 12000, 15500, 20500, 27000];
    var band_limits = new Int32Array(bands);
    while (bands--) {
        band_limits[bands] = (edges[bands] / sampleRate) * N;
    }
    return band_limits;
}
