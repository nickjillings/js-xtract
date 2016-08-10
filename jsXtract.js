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

"use strict";

// This work is based upon LibXtract developed by Jamie Bullock
//https://github.com/jamiebullock/LibXtract

// A Few Polyfills:
if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (searchString, position) {
        var subjectString = this.toString();
        if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
            position = subjectString.length;
        }
        position -= searchString.length;
        var lastIndex = subjectString.indexOf(searchString, position);
        return lastIndex !== -1 && lastIndex === position;
    };
}

function xtract_is_denormal(num) {
    if (Math.abs(num) <= 2.2250738585072014e-308) {
        return true;
    }
    return false;
}

function xtract_array_sum(data) {
    var sum = 0;
    for (var n = 0; n < data.length; n++) {
        sum += data[n];
    }
    return sum;
}

function xtract_array_min(data) {
    var min = Infinity;
    for (var n = 0; n < data.length; n++) {
        if (data[n] < min) {
            min = data[n];
        }
    }
    return min;
}

function xtract_array_max(data) {
    var max = data[0];
    for (var n = 1; n < data.length; n++) {
        if (data[n] > max) {
            max = data[n];
        }
    }
    return max;
}

function xtract_array_normalise(data) {
    var max = xtract_array_max(data);
    if (max === 1.0) {
        return data;
    }
    for (var n = 0; n < data.length; n++) {
        data[n] /= max;
    }
    return data;
}

function xtract_array_bound(data, min, max) {
    if (typeof min != "number" && typeof max != "number") {
        return data;
    }
    if (min >= max) {
        console.error("Invalid boundaries! Minimum cannot be greater than maximum");
        return [];
    }
    var result = new data.constructor(data.length);
    for (var n = 0; n < data.length; n++) {
        result[n] = Math.min(Math.max(data[n], min), max);
    }
    return result;
}

function xtract_array_interlace(data) {
    var length = data.length;
    for (var argument of arguments) {
        if (argument.length != length) {
            console.error("All argument lengths must be the same");
        }
    }
    var num_args = arguments.length;
    var result = new data.constructor(num_args * length);
    for (var k = 0; k < length; k++) {
        for (var j = 0; j < num_args; j++) {
            result[k * num_args + j] = arguments[j][k];
        }
    }
    return result;
}

function xtract_array_deinterlace(data, num_arrays) {
    if (typeof num_arrays != "number" || num_arrays <= 0) {
        console.error("num_arrays must be a positive integer");
    }
    if (num_arrays == 1) {
        return data;
    }
    var result = [];
    var N = data.length / num_arrays;
    if (N != Math.round(N)) {
        console.error("Cannot safely divide data into " + num_arrays + " sub arrays");
    }
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

/* Scalar.c */

function xtract_mean(array) {
    return xtract_array_sum(array) / array.length;
}

function xtract_temporal_centroid(energyArray, sample_rate, window_ms) {
    if (typeof sample_rate != "number") {
        console.error("xtract_temporal_centroid requires sample_rate to be a number");
        return;
    }
    if (typeof window_ms != "number") {
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
    return num / den;
}

function xtract_variance(array, mean) {
    if (typeof mean != "number") {
        mean = xtract_mean(array);
    }
    var result = 0.0;
    for (var n = 0; n < array.length; n++) {
        result += Math.pow(array[n] - mean, 2);
    }
    return result /= (array.length - 1);
}

function xtract_standard_deviation(array, variance) {
    if (typeof variance != "number") {
        variance = xtract_variance(array);
    }
    return Math.sqrt(variance);
}

function xtract_average_deviation(array, mean) {
    if (typeof mean != "number") {
        mean = xtract_mean(array);
    }
    var result = 0.0;
    for (var n = 0; n < array.length; n++) {
        result += Math.abs(array[n] - mean);
    }
    return result /= array.length;
}

function xtract_skewness(array, mean, standard_deviation) {
    if (typeof mean != "number") {
        mean = xtract_mean(array);
    }
    if (typeof standard_deviation != "number") {
        standard_deviation = xtract_standard_deviation(array, xtract_variance(data, mean));
    }
    var result = 0.0;
    for (var n = 0; n < array.length; n++) {
        result += Math.pow((array[n] - mean) / standard_deviation, 3);
    }
    return result /= array.length;
}

function xtract_kurtosis(array, mean, standard_deviation) {
    if (typeof mean != "number") {
        mean = xtract_mean(array);
    }
    if (typeof standard_deviation != "number") {
        standard_deviation = xtract_standard_deviation(array, xtract_variance(data, mean));
    }
    var result = 0.0;
    for (var n = 0; n < array.length; n++) {
        result += Math.pow((array[n] - mean) / standard_deviation, 4);
    }
    return result / array.length;
}

function xtract_spectral_centroid(spectrum) {
    var N = spectrum.length;
    var n = N >> 1;
    var amps = spectrum.subarray(0, n);
    var freqs = spectrum.subarray(n);
    var Amps = new Float64Array(n);
    for (var i = 0; i < n; i++) {
        Amps[i] = amps[i];
    }
    amps = xtract_array_normalise(Amps);
    var A_d = xtract_array_sum(amps) / n;
    if (A_d == 0.0) {
        return 0.0;
    }
    var sum = 0.0;
    while (n--) {
        sum += freqs[n] * (amps[n] / A_d);
    }
    return sum / (N >> 1);
}

function xtract_spectral_mean(spectrum) {
    var N = spectrum.length;
    var n = N >> 1;
    var amps = spectrum.subarray(0, n);
    var sum = xtract_array_sum(amps);
    return sum / n;
}

function xtract_spectral_variance(spectrum, spectral_mean) {
    if (typeof spectral_mean != "number") {
        spectral_mean = xtract_spectral_centroid(spectrum);
    }
    var A = 0,
        result = 0;
    var N = spectrum.length;
    var n = N >> 1;
    var amps = spectrum.subarray(0, n);
    var freqs = spectrum.subarray(n);
    if (amps.reduce) {
        A = amps.reduce(function (a, b) {
            return a + b;
        });
    } else {
        A = 0.0;
        for (var i = 0; i < n; i++) {
            A += amps[i];
        }
    }
    while (n--) {
        result += Math.pow(freqs[n] - spectral_mean, 2) * amps[n];
    }
    return result /= A;
}

function xtract_spectral_spread(spectrum, spectral_centroid) {
    if (typeof spectral_centroid != "number") {
        spectral_centroid = xtract_spectral_centroid(spectrum);
    }
    return xtract_spectral_variance(spectrum, spectral_centroid);
}

function xtract_spectral_standard_deviation(spectrum, spectral_variance) {
    if (typeof spectral_variance != "number") {
        spectral_variance = xtract_spectral_variance(spectrum);
    }
    return Math.sqrt(spectral_variance);
}

function xtract_spectral_skewness(spectrum, spectral_mean, spectral_standard_deviation) {
    if (typeof spectral_mean != "number") {
        spectral_mean = xtract_spectral_mean(spectrum);
    }
    if (typeof spectral_standard_deviation != "number") {
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
    return result /= Math.pow(spectral_standard_deviation, 3);
}

function xtract_spectral_kurtosis(spectrum, spectral_mean, spectral_standard_deviation) {
    if (typeof spectral_mean != "number") {
        spectral_mean = xtract_spectral_mean(spectrum);
    }
    if (typeof spectral_standard_deviation != "number") {
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

function xtract_tristimulus_1(spectrum, f0) {
    if (typeof f0 != "number") {
        console.error("xtract_tristimulus_1 requires f0 to be defined and a number");
        return null;
    }
    var h = 0,
        den = 0.0,
        p1 = 0.0,
        temp = 0.0;
    var N = spectrum.length;
    var K = N >> 1;
    var amps = spectrum.subarray(0, K);
    var freqs = spectrum.subarray(K);

    for (var i = 0; i < K; i++) {
        temp = amps[i];
        if (temp != 0) {
            den += temp;
            h = Math.floor(freqs[i] / f0 + 0.5);
            if (h == 1) {
                p1 += temp;
            }
        }
    }

    if (den == 0.0 || p1 == 0.0) {
        return 0.0;
    } else {
        return p1 / den;
    }
}

function xtract_tristimulus_2(spectrum, f0) {
    if (typeof f0 != "number") {
        console.error("xtract_tristimulus_1 requires f0 to be defined and a number");
        return null;
    }
    var den, p2, p3, p4, ps, temp, h = 0;
    den = p2 = p3 = p4 = ps = temp = 0.0;
    var N = spectrum.length;
    var K = N >> 1;
    var amps = spectrum.subarray(0, K);
    var freqs = spectrum.subarray(K);

    for (var i = 0; i < K; i++) {
        temp = amps[i];
        if (temp != 0) {
            den += temp;
            h = Math.floor(freqs[i] / f0 + 0.5);
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
        }
    }
    ps = p2 + p3 + p4;
    if (den == 0.0 || ps == 0.0) {
        return 0.0;
    } else {
        return ps / den;
    }
}

function xtract_tristimulus_3(spectrum, f0) {
    if (typeof f0 != "number") {
        console.error("xtract_tristimulus_1 requires f0 to be defined and a number");
        return null;
    }
    var den = 0.0,
        num = 0.0,
        temp = 0.0;
    var N = spectrum.length;
    var K = N >> 1;
    var amps = spectrum.subarray(0, n);
    var freqs = spectrum.subarray(n);

    for (var i = 0; i < K; i++) {
        temp = amps[i];
        if (temp != 0.0) {
            den += temp;
            h = Math.floor(freqs[i] / f0 + 0.5);
            if (h >= 5) {
                num += temp;
            }
        }
    }
    if (den == 0.0 || num == 0.0) {
        return 0.0
    } else {
        return num / den;
    }
}

function xtract_smoothness(spectrum) {
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
    var result = 0;
    for (var n = 1; n < timeArray.length; n++) {
        if (timeArray[n] * timeArray[n - 1] < 0) {
            result++;
        }
    }
    return result / timeArray.length;
}

function xtract_rolloff(spectrum, sampleRate, threshold) {
    if (typeof sampleRate != "number" || typeof threshold != "number") {
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
    var result = 0;
    for (var n = 0; n < barkBandsArray.length; n++) {
        result += Math.pow(barkBandsArray[n], 0.23);
    }
    return result;
}

function xtract_flatness(spectrum) {
    var count = 0,
        denormal_found = false,
        num = 1.0,
        den = 0.0,
        temp = 0.0;
    var N = spectrum.length;
    var K = N >> 1;
    var amps = spectrum.subarray(0, K);

    for (var n = 0; n < K; n++) {
        if (amps[n] != 0.0) {
            if (xtract_is_denormal(num)) {
                denormal_found = true;
                break;
            }
            num *= amps[n];
            den += amps[n];
            count++;
        }
    }
    if (count == 0) {
        return 0;
    }
    num = Math.pow(num, 1.0 / K);
    den /= K;

    return num / den;
}

function xtract_flatness_db(spectrum, flatness) {
    if (typeof flatness != "number") {
        flatness = xtract_flatness(spectrum);
    }
    return 10.0 * Math.log10(flatness);
}

function xtract_tonality(spectrum, flatness_db) {
    if (typeof flatness_db != "number") {
        flatness_db = xtract_flatness_db(spectrum);
    }
    return Math.min(flatness_db / -60.0, 1);
}

function xtract_crest(data, max, mean) {
    if (typeof max != "number") {
        max = xtract_array_max(data);
    }
    if (typeof mean != "number") {
        mean = xtract_mean(data);
    }
    return max / mean;
}

function xtract_noisiness(h, p) {
    return (p - h) / p;
}

function xtract_rms_amplitude(timeArray) {
    var result = 0;
    for (var n = 0; n < timeArray.length; n++) {
        result += timeArray[n] * timeArray[n];
    }
    return Math.sqrt(result / timeArray.length);
}

function xtract_spectral_inharmonicity(peakSpectrum, f0) {
    if (typeof f0 != "number") {
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
        if (amps[n] != 0.0) {
            h = Math.floor(freqs[n] / f0 + 0.5);
            var mag_sq = Math.pow(amps[n], 2);
            num += Math.abs(freqs[n] - h * f0) * mag_sq
            den += mag_sq;
        }
    }
    return (2 * num) / (f0 * den);
}

function xtract_power(magnitudeArray) {
    return null;
}

function xtract_odd_even_ratio(harmonicSpectrum, f0) {
    if (typeof f0 != "number") {
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
        if (temp != 0.0) {
            h = Math.floor(freqs[n] / f0 + 0.5);
            if (h % 2 != 0) {
                odd += temp;
            } else {
                even += temp;
            }
        }
    }

    if (odd == 0.0 || even == 0.0) {
        return 0.0;
    } else {
        return odd / even;
    }
}

function xtract_sharpness(barkBandsArray) {
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
    if (typeof threshold != "number") {
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

function xtract_highest_value(data, threshold) {
    if (typeof threshold != "number") {
        threshold = +Infinity;
    }
    var result = +Infinity;
    for (var n = 0; n < data.length; n++) {
        if (data[n] >= threshold) {
            result = Math.max(result, data[n]);
        }
    }
    return result;
}

function xtract_sum(data) {
    return xtract_array_sum(data);
}

function xtract_nonzero_count(data) {
    var count = 0;
    for (var n = 0; n < data.length; n++) {
        if (data[n] != 0) {
            count++;
        }
    }
    return count;
}

function xtract_hps(spectrum) {
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
    if (M <= 1) {
        console.error("Input Data is too short for HPS");
        return null;
    }

    for (var i = 0; i < M; ++i) {
        tempProduct = amps[i] * amps[i * 2] * amps[i * 3];
        if (tempProduct > peak) {
            peak = tempProduct;
            peak_index = i;
        }
    }

    for (var i = 0; i < K; i++) {
        if (amps[i] > largest1_lwr && i != peak_index) {
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
    if (typeof sampleRate != "number") {
        sampleRate = 44100.0;
    }
    var sub_arr = new Float64Array(timeArray.length);
    var N = sub_arr.length;
    var M = N / 2;
    for (var n = 0; n < N; n++) {
        sub_arr[n] = timeArray[n];
    }

    var threshold_peak = 0.8,
        threshold_centre = 0.3,
        err_tau_1 = 0,
        array_max = 0;

    array_max = xtract_array_max(sub_arr);
    threshold_peak *= array_max;
    threshold_centre *= array_max;

    for (var n = 0; n < sub_arr.length; n++) {
        if (sub_arr[n] > threshold_peak) {
            sub_arr[n] = threshold_peak;
        } else if (sub_arr[n] < -threshold_peak) {
            sub_arr[n] = -threshold_peak;
        }

        if (sub_arr[n] < threshold_centre) {
            sub_arr[n] = 0;
        } else {
            sub_arr[n] -= threshold_centre;
        }
    }

    for (var n = 1; n < M; n++) {
        err_tau_1 += Math.abs(sub_arr[n] - sub_arr[n + 1]);
    }
    for (var tau = 2; tau < M; tau++) {
        var err_tau_x = 0;
        for (var n = 1; n < M; n++) {
            err_tau_x += Math.abs(sub_arr[n] - sub_arr[n + tau]);
        }
        if (err_tau_x < err_tau_1) {
            var f0 = sampleRate / (tau + (err_tau_x / err_tau_1));
            return f0;
        }
    }
    return -0;
}

function xtract_failsafe_f0(timeArray, sampleRate) {
    return xtract_f0(timeArray, sampleRate);
}

function xtract_wavelet_f0(timeArray, sampleRate, pitchtracker) {
    if (pitchtracker == undefined) {
        console.error("xtract_wavelet_f0 requires pitchtracker to be defined");
        return null;
    }
    if (xtract_array_sum(timeArray) == 0) {
        return;
    }

    function _power2p(value) {
        if (value == 0) {
            return 1;
        }
        if (value == 2) {
            return 1;
        }
        if (value & 0x1) {
            return 0;
        }
        return (_power2p(value >> 1));
    }

    function _bitcount(value) {
        if (value == 0) {
            return 0;
        }
        if (value == 1) {
            return 1;
        }
        if (value == 2) {
            return 2;
        }
        return _bitcount(value >> 1) + 1;
    }

    function _ceil_power2(value) {
        if (_power2p(value)) {
            return value;
        }

        if (value == 1) {
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
            res <<= 1
        };
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
        }
        //_dywapitch_computeWaveletPitch(samples, startsample, samplecount)
    var samples = timeArray,
        startsample = 0,
        samplecount = timeArray.length;
    var pitchF = 0.0;
    var j, si, si1;

    samplecount = _floor_power2(samplecount);
    var sam = new Float64Array(samplecount);
    for (var i = 0; i < samplecount; i++) {
        sam[i] = samples[i];
    }

    var curSamNb = samplecount;

    var distances = new Int32Array(samplecount);
    var mins = new Int32Array(samplecount);
    var maxs = new Int32Array(samplecount);
    var nbMins, nbMaxs;

    var maxFLWTlevels = 6;
    var maxF = 3000.;
    var differenceLevelsN = 3;
    var maximaThresholdRatio = 0.75;

    var ampltitudeThreshold;
    var theDC = 0.0; {
        var maxValue = 0.0;
        var minValue = 0.0;
        for (var i = 0; i < samplecount; i++) {
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
    }

    var curLevel = 0;
    var curModeDistance = -1.;
    var delta;

    var cont = true;

    while (cont) {
        delta = Math.floor(44100. / (_2power(curLevel) * maxF));
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

        for (var i = 2; i < curSamNb; i++) {
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

        if (nbMins == 0 && nbMaxs == 0) {
            cont = false;
            break;
        }

        var d;
        //memset(distances, 0, samplecount*sizeof(int));
        for (var i = 0; i < samplecount; i++) {
            distances[i] = 0.0;
        }
        for (var i = 0; i < nbMins; i++) {
            for (j = 1; j < differenceLevelsN; j++) {
                if (i + j < nbMins) {
                    d = _iabs(mins[i] - mins[i + j]);
                    distances[d] = distances[d] + 1;
                }
            }
        }
        for (var i = 0; i < nbMaxs; i++) {
            for (var j = 1; j < differenceLevelsN; j++) {
                if (i + j < nbMaxs) {
                    d = _iabs(maxs[i] - maxs[i + j]);
                    //asLog("dywapitch i=%ld j=%ld d=%ld\n", i, j, d);
                    distances[d] = distances[d] + 1;
                }
            }
        }

        var bestDistance = -1;
        var bestValue = -1;
        for (var i = 0; i < curSamNb; i++) {
            var summed = 0;
            for (var j = -delta; j <= delta; j++) {
                if (i + j >= 0 && i + j < curSamNb)
                    summed += distances[i + j];
            }
            //asLog("dywapitch i=%ld summed=%ld bestDistance=%ld\n", i, summed, bestDistance);
            if (summed == bestValue) {
                if (i == 2 * bestDistance)
                    bestDistance = i;

            } else if (summed > bestValue) {
                bestValue = summed;
                bestDistance = i;
            }
        }

        var distAvg = 0.0;
        var nbDists = 0;
        for (var j = -delta; j <= delta; j++) {
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
                pitchF = 44100. / (_2power(curLevel - 1) * curModeDistance);
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
        for (var i = 0; i < curSamNb / 2; i++) {
            sam[i] = (sam[2 * i] + sam[2 * i + 1]) / 2.0;
        }
        curSamNb /= 2;
    }

    //_dywapitch_dynamicprocess(pitchtracker, pitch)
    pitchF = function (pitchtracker, pitchF) {
        if (pitch == 0.0) {
            return -1.0;
        }

        var estimatedPitch = -1,
            acceptedError = 0.2,
            maxConfidence = 5;
        if (pitch != -1) {
            // I have a pitch here

            if (pitchtracker._prevPitch == -1) {
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
            if (pitchtracker._prevPitch != -1) {
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
        if (pitch == -1) {
            pitch = 0.0;
        }
        return pitch;
    }
    return pitchF;
}

function xtract_midicent(f0) {
    var note = 0.0;
    note = 69 + Math.log(f0 / 440.0) * 17.31234;
    note *= 100;
    note = Math.round(0.5 + note);
    return note;
}

/* Vector.c */

function xtract_energy(array, sample_rate, window_ms) {
    if (typeof sample_rate != "number") {
        console.error("xtract_energy requires sample_rate to be defined");
        return;
    }
    if (typeof window_ms != "number") {
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
    if (typeof sample_rate != "number") {
        console.error("Sample Rate must be defined");
        return null;
    }
    if (withDC == undefined) {
        withDC = false;
    }
    if (normalise == undefined) {
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
    for (var k = align; k < result.length / 2; k++) {
        amps[k - align] = Math.sqrt((reals[k] * reals[k]) + (imags[k] * imags[k])) / array.length;
        freqs[k - align] = (2 * k / N) * (sample_rate / 2);
    }
    if (normalise) {
        var max = xtract_array_max(amps);
        for (var n = 0; n < amps.length; n++) {
            amps[n] /= max;
        }
    }
    return result;
}

function xtract_complex_spectrum(array, sample_rate, withDC) {
    if (typeof sample_rate != "number") {
        console.error("Sample Rate must be defined");
        return null;
    }
    if (withDC == undefined) {
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
    for (var k = align; k < reals.length / 2 + 1; k++) {
        amps[(k - align) * 2] = reals[k];
        amps[(k - align) * 2 + 1] = imags[k];
        freqs[k - align] = (2 * k / N) * (sample_rate / 2);
    }
    return result;
}

function xtract_mfcc(spectrum, mfcc) {
    if (typeof mfcc != "object") {
        console.error("Invalid MFCC, must be MFCC object built using xtract_init_mfcc");
        return null;
    }
    if (mfcc.n_filters == 0) {
        console.error("Invalid MFCC, object must be built using xtract_init_mfcc");
        return null;
    }
    var K = spectrum.length >> 1;
    if (mfcc.filters[0].length != K) {
        console.error("Lengths do not match");
        return null;
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
    var N = array.length;
    var result = new Float64Array(N);
    for (var n = 0; n < N; n++) {
        var nN = n / N;
        if (array.reduce) {
            result[n] = array.reduce(function (sum, value, m) {
                return sum + value * Math.cos(Math.PI * nN * (m + 0.5));
            }, 0.0)
        } else {
            for (var m = 0; m < N; m++) {
                result[n] += array[m] * Math.cos(Math.PI * nN * (m + 0.5));
            }
        }
    }
    return result;
}

function xtract_dct_2(array, dct) {
    var N = array.length;
    if (dct == undefined) {
        dct = xtract_init_dct(N);
    }
    var result = new Float64Array(N);
    result[0] = xtract_array_sum(array);
    for (var k = 1; k < N; k++) {
        for (var n = 0; n < N; n++) {
            result[k] += array[n] * dct.wt[k][n];
        }
    }
    return result;
}

function xtract_autocorrelation(array) {
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
    if (bark_limits == undefined) {
        console.error("xtract_bark_coefficients requires compute limits from xtract_init_bark");
        return null;
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
    var N = spectrum.length;
    var K = N >> 1;
    var max = 0.0,
        y = 0.0,
        y2 = 0.0,
        y3 = 0.0,
        p = 0.0;
    if (typeof q != "number") {
        console.error("xtract_peak_spectrum requires second argument to be sample_rate/N");
    }
    if (threshold < 0 || threshold > 100) {
        threshold = 0;
        console.log("peak_spectrum threshold must be between 0 and 100");
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
    var N = peakSpectrum.length;
    var K = N >> 1;
    var result = new Float64Array(N);
    var ampsIn = peakSpectrum.subarray(0, K);
    var freqsIn = peakSpectrum.subarray(K);
    var ampsOut = result.subarray(0, K);
    var freqsOut = result.subarray(K);
    var n = K;
    if (f0 == undefined || threshold == undefined) {
        console.error("harmonic_spectrum requires f0 and threshold to be numbers and defined");
        return null;
    }
    if (threshold > 1) {
        threshold /= 100.0;
        console.log("harmonic_spectrum assuming integer for threshold inserted, operating at t=" + threshold);
    }
    while (n--) {
        if (freqsIn[n] != 0.0) {
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
    var i, j, r, ref, error = autocorr[0];
    var N = autocorr.length;
    var L = N - 1;
    var lpc = new Float64Array(L);
    var ref = new Float64Array(L);
    if (error == 0.0) {
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
    var N = lpc.length;
    var n, k, sum, order = N - 1,
        cep_length;
    if (typeof Q != "number") {
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
    var N = spectrum.length >> 1;
    if (typeof M != "object") {
        if (typeof fs != "number" || fs <= 0.0) {
            console.error("Cannot dynamically compute M if fs is undefined / not a valid sample rate");
            return [];
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
    if (timeData == undefined || frameSize == undefined) {
        console.error("All arguments for xtract_onset must be defined: xtract_onset(timeData, frameSize)");
    }

    var frames = timeData.xtract_get_data_frames(frameSize, frameSize, false);
    var N = frames.length;
    var X = [];
    var real = new Float64Array(frameSize);
    var imag = new Float64Array(frameSize);
    var K = frameSize / 2 + 1;
    for (var i = 0; i < N; i++) {
        for (var n = 0; n < frameSize; n++) {
            real[n] = frames[i][n];
            imag[n] = 0.0;
        }
        transform(real, imag);
        X[i] = xtract_array_interlace(real.subarray(0, K), imag.subarray(0, K));
    }

    function angle(real, imag) {
        if (imag == undefined && real.length == 2) {
            return Math.atan2(real[1], real[0]);
        }
        return Math.atan2(imag, real);
    }

    function abs(real, imag) {
        if (imag == undefined && real.length == 2) {
            return Math.sqrt(Math.pow(real[0], 2) + Math.pow(real[1], 2));
        }
        return Math.sqrt(Math.pow(real, 2) + Math.pow(imag, 2));
    }

    function princarg(phaseIn) {
        //phase=mod(phasein+pi,-2*pi)+pi;
        return (phaseIn + Math.PI) % (-2 * Math.PI) + Math.PI;
    }

    function complex_mul(cplx_pair_A, cplx_pair_B) {
        if (cplx_pair_A.length != 2 || cplx_pair_B.length != 2) {
            console.error("Both arguments must be numeral arrays of length 2");
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
        for (var n = 1; n < N; n++) {
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

    for (var n = 0; n < N; n++) {
        E[n] /= frameSize;
    }
    return E;
}

function xtract_resample(data, p, q, n) {
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
            if (t == n) {
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

    function overlap(X, b) {
        var i, f;
        var Y = new Float64Array(X.length);
        var N = b.length;
        var N2 = 2 * N;
        var B = {
            real: zp(b),
            imag: new Float64Array(N * 2)
        }
        transform(B.real, B.imag);
        var Xi = X.xtract_get_data_frames(N, N, false);
        var Yi = Y.xtract_get_data_frames(N, N, false);
        var x_last = new Float64Array(N);
        var y_last = new Float64Array(N);
        var w = new Float64Array(N2);
        for (i = 0; i < N2; i++) {
            var rad = (Math.PI * i) / (N2);
            w[i] = 0.35875 - 0.48829 * Math.cos(2 * rad) + 0.14128 * Math.cos(4 * rad) - 0.01168 * Math.cos(6 * rad);
        }
        var xF = {
            real: new Float64Array(N2),
            imag: new Float64Array(N2)
        }
        var yF = {
            real: new Float64Array(N2),
            imag: new Float64Array(N2)
        }
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
    if (typeof n != "number" || n <= 0) {
        n = 512;
    }
    if (p == q) {
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
        var b = filter(n, 1 / ratio);
        overlap(data, b);
    } else {
        // Downsampling
        // 1. Filter out energy above p
        var b = filter(n, ratio / 2);
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
    }
    var power_const = -2.0 * Math.PI / N;;
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
    }
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
        height, norm_fact;

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

    for (var n = 1; n < (freq_bands + 2); ++n) {
        //roll out peak locations - mel, linear and linear on fft window scale
        mel_peak[n] = mel_peak[n - 1] + freq_bw_mel;
        lin_peak[n] = 700 * (Math.exp(mel_peak[n] / 1127) - 1);
        fft_peak[n] = Math.floor(lin_peak[n] / nyquist * M);
    }

    for (var n = 0; n < freq_bands; n++) {
        //roll out normalised gain of each peak
        if (style == "XTRACT_EQUAL_GAIN") {
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
    for (var n = 0; n < freq_bands; n++) {
        // calculate the rise increment
        if (n == 0) {
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
    }
}

function xtract_init_pcp(N, fs, f_ref) {
    if (typeof fs != "number" || typeof N != "number") {
        console.error('The Sample Rate and sample count have to be defined: xtract_init_pcp(N, fs, f_ref)');
    }
    if (N <= 0 || N != Math.floor(N)) {
        console.error("The sample count, N, must be a positive integer: xtract_init_pcp(N, fs, f_ref)");
    }
    if (fs <= 0.0) {
        console.error('The Sample Rate must be a positive number: xtract_init_pcp(N, fs, f_ref)');
    }
    if (typeof f_ref != "number" || f_ref <= 0.0 || f_ref >= fs / 2) {
        console.log("Assuming f_ref to be 48.9994294977Hz");
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

function xtract_init_bark(N, sampleRate) {
    var edges = [0, 100, 200, 300, 400, 510, 630, 770, 920, 1080, 1270, 1480, 1720, 2000, 2320, 2700, 3150, 3700, 4400, 5300, 6400, 7700, 9500, 12000, 15500, 20500, 27000];
    var bands = 26;
    var band_limits = new Int32Array(bands);
    while (bands--) {
        band_limits[bands] = (edges[bands] / sampleRate) * N;
    }
    return band_limits;
}

var jsXtract = function () {
    var resultObject = function () {}
    var _mfcc, _bark, _wavelet, _result = {};

    this.init_mfcc = function (N, nyquist, style, freq_min, freq_max, freq_bands) {
        _mfcc = xtract_init_mfcc(N, nyquist, style, freq_min, freq_max, freq_bands);
        return _mfcc;
    }
    this.init_bark = function (N, sampleRate) {
        _bark = xtract_init_bark(N, sampleRate);
        return _bark;
    }
    this.init_wavelet = function () {
        _wavelet = xtract_init_wavelet();
        return _wavelet;
    }

    this.clearResult = function () {
        _result = {};
    }

    this.toJSON = function () {
        var json = '{';
        for (var property in _result) {
            if (!json.endsWith('{') && !json.endsWith(',')) {
                json = json + ', ';
            }
            if (typeof _result[property] == "number") {
                json = json + '"' + property + '": ' + _result[property];
            } else if (typeof _result[property] == "object") {
                switch (_result[property].constructor) {
                    case Array:
                    case Float32Array:
                    case Float64Array:
                    case TimeData:
                    case SpectrumData:
                    case PeakSpectrumData:
                    case HarmonicSpectrumData:
                        // Array
                        json = json + '"' + property + '": ' + _result[property].toJSON();
                    default:
                        break;
                }
            }
        }
        return json + '}';
    }
    
    Object.defineProperty(this, "mfcc", {
        'get': function () {
            return _mfcc;
        },
        'set': function () {}
    });
    Object.defineProperty(this, "bark", {
        'get': function () {
            return _bark;
        },
        'set': function () {}
    });
    Object.defineProperty(this, "wavelet", {
        'get': function () {
            return _wavelet;
        },
        'set': function () {}
    });
    Object.defineProperty(this, "result", {
        'get': function () {
            return _result;
        },
        'set': function () {}
    });
}


// Prototype for Time Domain based data
var TimeData = function (N, sampleRate) {
    if (sampleRate <= 0) {
        sampleRate = undefined;
        console.log("Invalid parameter for 'sampleRate' for TimeData");
    }

    var _data, _length, _Fs;

    if (typeof N == "object") {
        var src, src_data;
        if (N.constructor == TimeData) {
            src = N;
            src_data = src.getData();
        } else if (N.constructor == Float32Array || N.constructor == Float64Array) {
            src = N;
            src_data = N;
        } else {
            console.error("TimeData: Invalid object passed as first argument.");
        }
        _length = src.length;
        _data = new Float64Array(_length);
        for (var n = 0; n < _length; n++) {
            _data[n] = src_data[n];
        }
    } else if (typeof N == "number") {
        if (N <= 0 || N != Math.floor(N)) {
            console.error("TimeData: Invalid number passed as first argument.");
        } else {
            _length = N;
            _data = new Float64Array(_length);
        }
    } else {
        console.error("TimeData: Constructor has invalid operators!");
    }
    this.__proto__ = new jsXtract();
    this.__proto__.constructor = TimeData;

    _Fs = sampleRate;

    this.getData = function () {
        return _data;
    }

    this.zeroData = function () {
        if (_data.fill) {
            _data.fill(0);
        } else {
            for (var n = 0; n < _data.length; n++) {
                _data[n] = 0;
            }
        }
        this.clearResult();
    }

    this.copyDataFrom = function (src, N, offset) {
        if (typeof src != "object" || src.length == undefined) {
            console.error("copyDataFrom requires src to be an Array or TypedArray");
        }
        if (offset == undefined) {
            offset = 0;
        }
        if (N == undefined) {
            N = Math.min(src.length, _data.length);
        }
        N = Math.min(N + offset, _data.length);
        for (var n = 0; n < N; n++) {
            _data[n + offset] = src[n];
        }
        this.clearResult();
    }

    this.duplicate = function () {
        var copy = this.prototype.constructor(_data.length);
        copy.copyDataFrom(_data);
    }

    Object.defineProperty(this, "sampleRate", {
        'get': function () {
            return _Fs
        },
        'set': function (sampleRate) {
            if (_Fs == undefined) {
                _Fs = sampleRate;
            } else {
                console.error("Cannot set one-time variable");
            }
        }
    });
    Object.defineProperty(this, "length", {
        'value': _length,
        'writable': false,
        'enumerable': true
    });

    // Array Properties
    Object.defineProperty(this, "minimum", {
        'value': function () {
            if (this.result.minimum == undefined) {
                this.result.minimum = xtract_array_min(_data);
            }
            return this.result.minimum;
        }
    });
    Object.defineProperty(this, "maximum", {
        'value': function () {
            if (this.result.maximum == undefined) {
                this.result.maximum = xtract_array_max(_data);
            }
            return this.result.maximum;
        }
    });
    Object.defineProperty(this, "sum", {
        'value': function () {
            if (this.result.sum == undefined) {
                this.result.sum = xtract_array_sum(_data);
            }
            return this.result.sum;
        }
    });

    Object.defineProperty(this, "getFrames", {
        'value': function (frameSize, hopSize) {
            if (typeof frameSize != "number" || frameSize <= 0 || frameSize != Math.floor(frameSize)) {
                console.error("frameSize must be a defined, positive integer");
            }
            if (typeof hopSize != "number") {
                hopSize = frameSize;
            }
            var num_frames = Math.ceil(_length / frameSize);
            var result_frames = [];
            for (var i = 0; i < num_frames; i++) {
                var frame = new TimeData(hopSize, _Fs);
                frame.copyDataFrom(_data.subarray(frameSize * i, frameSize * i + hopSize));
                result_frames.push(frame);
            }
            return result_frames;
        }
    })

    // Features

    Object.defineProperty(this, "mean", {
        'value': function () {
            if (this.result.mean == undefined) {
                this.result.mean = xtract_mean(_data);
            }
            return this.result.mean;
        }
    });

    Object.defineProperty(this, "temporal_centroid", {
        'value': function (window_ms) {
            if (this.result.temporal_centroid == undefined) {
                this.energy(window_ms);
                this.result.temporal_centroid = xtract_temporal_centroid(this.result.energy.data, _Fs, window_ms);
            }
            return this.result.temporal_centroid;
        }
    });

    Object.defineProperty(this, "variance", {
        'value': function () {
            if (this.result.variance == undefined) {
                this.result.variance = xtract_variance(_data, this.mean());
            }
            return this.result.variance;
        }
    });
    Object.defineProperty(this, "standard_deviation", {
        'value': function () {
            if (this.result.standard_deviation == undefined) {
                this.result.standard_deviation = xtract_standard_deviation(_data, this.variance());
            }
            return this.result.standard_deviation;
        }
    });
    Object.defineProperty(this, "average_deviation", {
        'value': function () {
            if (this.result.average_deviation == undefined) {
                this.result.average_deviation = xtract_average_deviation(_data, this.mean());
            }
            return this.result.average_deviation;
        }
    });
    Object.defineProperty(this, "skewness", {
        'value': function () {
            if (this.result.skewness == undefined) {
                this.result.skewness = xtract_skewness(_data, this.mean(), this.standard_deviation());
            }
            return this.result.skewness;
        }
    });
    Object.defineProperty(this, "kurtosis", {
        'value': function () {
            if (this.result.kurtosis == undefined) {
                this.result.kurtosis = xtract_kurtosis(_data, this.mean(), this.standard_deviation());
            }
            return this.result.kurtosis;
        }
    });
    Object.defineProperty(this, "zcr", {
        'value': function () {
            if (this.result.zcr == undefined) {
                this.result.zcr = xtract_zcr(_data);
            }
            return this.result.zcr;
        }
    });
    Object.defineProperty(this, "crest_factor", {
        'value': function () {
            if (this.result.crest_factor == undefined) {
                this.result.crest_factor = xtract_crest(_amps, this.maximum(), this.mean());
            }
            return this.result.crest_factor;
        }
    });
    Object.defineProperty(this, "rms_amplitude", {
        'value': function () {
            if (this.result.rms_amplitude == undefined) {
                this.result.rms_amplitude = xtract_rms_amplitude(_data);
            }
            return this.result.rms_amplitude;
        }
    });
    Object.defineProperty(this, "lowest_value", {
        'value': function (threshold) {
            if (this.result.lowest_value == undefined) {
                this.result.lowest_value = xtract_lowest_value(_data, threshold);
            }
            return this.result.lowest_value;
        }
    });
    Object.defineProperty(this, "highest_value", {
        'value': function (threshold) {
            if (this.result.highest_value == undefined) {
                this.result.highest_value = xtract_highest_value(_data, threshold);
            }
            return this.result.highest_value;
        }
    });
    Object.defineProperty(this, "nonzero_count", {
        'value': function () {
            if (this.result.nonzero_count == undefined) {
                this.result.nonzero_count = xtract_nonzero_count(_data);
            }
            return this.result.nonzero_count;
        }
    });
    Object.defineProperty(this, "f0", {
        'value': function () {
            if (this.result.f0 == undefined) {
                this.result.f0 = xtract_f0(_data, _Fs);
            }
            return this.result.f0;
        }
    });

    // Vector features
    Object.defineProperty(this, "energy", {
        'value': function (window_ms) {
            if (this.result.energy == undefined || this.result.energy.window_ms != window_ms) {
                this.result.energy = {
                    'data': xtract_energy(_data, _Fs, window_ms),
                    'window_ms': window_ms
                };
            }
            return this.result.energy;
        }
    });

    Object.defineProperty(this, "spectrum", {
        'value': function () {
            if (this.result.spectrum == undefined) {
                var _spec = xtract_spectrum(_data, _Fs, true, false);
                this.result.spectrum = new SpectrumData(_spec.length/2, _Fs);
                this.result.spectrum.copyDataFrom(_spec);
                return this.result.spectrum;
            }
        }
    });

    Object.defineProperty(this, "dct", {
        'value': function () {
            if (this.result.dct == undefined) {
                this.result.dct = xtract_dct_2(_data, _dct);
            }
            return this.result.dct;
        }
    });

    Object.defineProperty(this, "autocorrelation", {
        'value': function () {
            if (this.result.autocorrelation == undefined) {
                this.result.autocorrelation = xtract_autocorrelation(_data);
            }
            return this.result.autocorrelation;
        }
    });

    Object.defineProperty(this, "amdf", {
        'value': function () {
            if (this.result.amdf == undefined) {
                this.result.amdf = xtract_amdf(_data);
            }
            return this.result.amdf;
        }
    });

    Object.defineProperty(this, "asdf", {
        'value': function () {
            if (this.result.asdf == undefined) {
                this.result.asdf = xtract_asdf(_data);
            }
            return this.result.asdf;
        }
    });

    Object.defineProperty(this, "yin", {
        'value': function () {
            if (this.result.yin == undefined) {
                this.result.yin = xtract_yin(_data);
            }
            return this.result.yin;
        }
    });

    Object.defineProperty(this, "onset", {
        'value': function (frameSize) {
            if (this.result.onset == undefined || this.result.onset.frameSize != frameSize) {
                this.result.onset = {
                    'data': xtract_onset(_data, frameSize),
                    'frameSize': frameSize
                };
            }
            return this.result.onset;
        }
    });

    Object.defineProperty(this, "resample", {
        'value': function (targetSampleRate) {
            if (_Fs == undefined) {
                console.error("Source sampleRate must be defined");
            }
            if (typeof targetSampleRate != "number" || targetSampleRate <= 0) {
                console.error("Target sampleRate must be a positive number");
            }
            var resampled = xtract_resample(_data, targetSampleRate, _Fs);
            var reply = new TimeData(resampled.length, targetSampleRate);
            reply.copyDataFrom(resampled);
            this.result.resample = reply;
            return reply;
        }
    });

    Object.defineProperty(this, "pitch", {
        'value': function () {
            if (_Fs == undefined) {
                console.error("Sample rate must be defined");
            }
            if (this.result.pitch == undefined) {
                this.result.pitch = xtract_pitch_FB(_data, _Fs);
            }
            return this.result.pitch;
        }
    });
}

// Prototpye for the Spectrum data type
var SpectrumData = function (N, sampleRate) {
    // N specifies the number of elements to create. Actually creates 2N to hold amplitudes and frequencies.
    // If sampleRate is null, calculate using radians per second [0, pi/2]
    if (N == undefined || N <= 0) {
        console.error("SpectrumData constructor requires N to be a defined, whole number");
        return;
    }
    if (sampleRate == undefined) {
        sampleRate = Math.PI;
    }
    this.__proto__ = new jsXtract();
    this.__proto__.constructor = SpectrumData;
    var _data = new Float64Array(2 * N);
    var _amps = _data.subarray(0, N);
    var _freqs = _data.subarray(N, 2 * N);
    var _length = N;
    var _Fs = sampleRate;
    var _f0 = undefined;

    function computeFrequencies() {
        for (var i = 0; i < N; i++) {
            _freqs[i] = (i / N) * (_Fs / 2);
        }
    }

    computeFrequencies();

    this.getData = function () {
        return _data;
    }

    this.zeroData = function () {
        if (_amps.fill) {
            _amps.fill(0);
        } else {
            for (var n = 0; n < _data.length; n++) {
                _amps[n] = 0;
            }
        }
        this.clearResult();
    }

    this.copyDataFrom = function (src, N, offset) {
        if (typeof src != "object" || src.length == undefined) {
            console.error("copyDataFrom requires src to be an Array or TypedArray");
        }
        if (offset == undefined) {
            offset = 0;
        }
        if (N == undefined) {
            N = Math.min(src.length, _amps.length);
        }
        N = Math.min(N + offset, _amps.length);
        for (var n = 0; n < N; n++) {
            _amps[n + offset] = src[n];
        }
        this.clearResult();
    }

    this.duplicate = function () {
        var copy = this.prototype.constructor(_length);
        copy.copyDataFrom(_amps);
    }

    Object.defineProperty(this, "sampleRate", {
        'get': function () {
            return _Fs
        },
        'set': function (sampleRate) {
            if (_Fs == Math.PI) {
                _Fs = sampleRate;
                computeFrequencies();
                _barkBands = xtract_init_bark(N, _Fs);
            } else {
                console.error("Cannot set one-time variable");
            }
        }
    });

    Object.defineProperty(this, "f0", {
        'get': function () {
            return _f0
        },
        'set': function (f0) {
            if (typeof f0 == "number") {
                _f0 = f0;
            }
            return _f0;
        }
    });

    Object.defineProperty(this, "length", {
        'value': _length,
        'writable': false,
        'enumerable': true
    });

    // Array Properties
    Object.defineProperty(this, "minimum", {
        'value': function () {
            if (this.result.minimum == undefined) {
                this.result.minimum = xtract_array_min(_amps);
            }
            return this.result.minimum;
        }
    });
    Object.defineProperty(this, "maximum", {
        'value': function () {
            if (this.result.maximum == undefined) {
                this.result.maximum = xtract_array_max(_amps);
            }
            return this.result.maximum;
        }
    });
    Object.defineProperty(this, "sum", {
        'value': function () {
            if (this.result.sum == undefined) {
                this.result.sum = xtract_array_sum(_amps);
            }
            return this.result.sum;
        }
    });

    // Features

    Object.defineProperty(this, "spectral_centroid", {
        'value': function () {
            if (this.result.spectral_centroid == undefined) {
                this.result.spectral_centroid = xtract_spectral_centroid(_data);
            }
            return this.result.spectral_centroid;
        }
    });

    Object.defineProperty(this, "spectral_mean", {
        'value': function () {
            if (this.result.spectral_mean == undefined) {
                this.result.spectral_mean = xtract_spectral_mean(_data);
            }
            return this.result.spectral_mean;
        }
    });

    Object.defineProperty(this, "spectral_variance", {
        'value': function () {
            if (this.result.spectral_variance == undefined) {
                this.result.spectral_variance = xtract_spectral_variance(_data, this.spectral_mean());
            }
            return this.result.spectral_variance;
        }
    });

    Object.defineProperty(this, "spectral_spread", {
        'value': function () {
            if (this.result.spectral_spread == undefined) {
                this.result.spectral_spread = xtract_spectral_spread(_data, this.spectral_centroid());
            }
            return this.result.spectral_spread;
        }
    });

    Object.defineProperty(this, "spectral_standard_deviation", {
        'value': function () {
            if (this.result.spectral_standard_deviation == undefined) {
                this.result.spectral_standard_deviation = xtract_spectral_standard_deviation(_data, this.spectral_variance());
            }
            return this.result.spectral_standard_deviation;
        }
    });

    Object.defineProperty(this, "spectral_skewness", {
        'value': function () {
            if (this.result.spectral_skewness == undefined) {
                this.result.spectral_skewness = xtract_spectral_skewness(_data, this.spectral_mean(), this.spectral_standard_deviation());
            }
            return this.result.spectral_skewness;
        }
    });

    Object.defineProperty(this, "spectral_kurtosis", {
        'value': function () {
            if (this.result.spectral_kurtosis == undefined) {
                this.result.spectral_kurtosis = xtract_spectral_kurtosis(_data, this.spectral_mean(), this.spectral_standard_deviation());
            }
            return this.result.spectral_kurtosis;
        }
    });

    Object.defineProperty(this, "irregularity_k", {
        'value': function () {
            if (this.result.irregularity_k == undefined) {
                this.result.irregularity_k = xtract_irregularity_k(_data);
            }
            return this.result.irregularity_k;
        }
    });

    Object.defineProperty(this, "irregularity_j", {
        'value': function () {
            if (this.result.irregularity_j == undefined) {
                this.result.irregularity_j = xtract_irregularity_j(_data);
            }
            return this.result.irregularity_j;
        }
    });

    Object.defineProperty(this, "tristimulus_1", {
        'value': function () {
            if (this.result.tristimulus_1 == undefined) {
                this.result.tristimulus_1 = xtract_tristimulus_1(_data, _f0);
            }
            return this.result.tristimulus_1;
        }
    });

    Object.defineProperty(this, "tristimulus_2", {
        'value': function () {
            if (this.result.tristimulus_2 == undefined) {
                this.result.tristimulus_2 = xtract_tristimulus_2(_data, _f0);
            }
            return this.result.tristimulus_2;
        }
    });

    Object.defineProperty(this, "tristimulus_3", {
        'value': function () {
            if (this.result.tristimulus_3 == undefined) {
                this.result.tristimulus_3 = xtract_tristimulus_3(_data, _f0);
            }
            return this.result.tristimulus_3;
        }
    });

    Object.defineProperty(this, "smoothness", {
        'value': function () {
            if (this.result.smoothness == undefined) {
                this.result.smoothness = xtract_smoothness(_data);
            }
            return this.result.smoothness;
        }
    });

    Object.defineProperty(this, "rolloff", {
        'value': function (threshold) {
            if (this.result.rolloff == undefined) {
                this.result.rolloff = xtract_rolloff(_data, _Fs, threshold);
            }
            return this.result.rolloff;
        }
    });

    Object.defineProperty(this, "loudness", {
        'value': function () {
            if (this.result.loudness == undefined) {
                this.result.loudness = xtract_loudness(this.bark_coefficients());
            }
            return this.result.loudness;
        }
    });

    Object.defineProperty(this, "sharpness", {
        'value': function () {
            if (this.result.sharpness == undefined) {
                this.result.sharpness = xtract_sharpness(this.bark_coefficients());
            }
            return this.result.sharpness;
        }
    });

    Object.defineProperty(this, "flatness", {
        'value': function () {
            if (this.result.flatness == undefined) {
                this.result.flatness = xtract_flatness(_data);
            }
            return this.result.flatness;
        }
    });

    Object.defineProperty(this, "flatness_db", {
        'value': function () {
            if (this.result.flatness_db == undefined) {
                this.result.flatness_db = xtract_flatness_db(_data, this.flatness());
            }
            return this.result.flatness_db;
        }
    });

    Object.defineProperty(this, "tonality", {
        'value': function () {
            if (this.result.tonality == undefined) {
                this.result.tonality = xtract_tonality(_data, this.flatness_db());
            }
            return this.result.tonality;
        }
    });

    Object.defineProperty(this, "spectral_crest_factor", {
        'value': function () {
            if (this.result.spectral_crest_factor == undefined) {
                this.result.spectral_crest_factor = xtract_crest(_amps, this.maximum(), this.spectral_mean());
            }
            return this.result.spectral_crest_factor;
        }
    })

    Object.defineProperty(this, "spectral_slope", {
        'value': function () {
            if (this.result.spectral_slope == undefined) {
                this.result.spectral_slope = xtract_spectral_slope(_data);
            }
            return this.result.spectral_slope;
        }
    });

    Object.defineProperty(this, "nonzero_count", {
        'value': function () {
            if (this.result.nonzero_count == undefined) {
                this.result.nonzero_count = xtract_nonzero_count(_amps);
            }
            return this.result.nonzero_count;
        }
    });

    Object.defineProperty(this, "hps", {
        'value': function () {
            if (this.result.hps == undefined) {
                this.result.hps = xtract_hps(_data);
            }
            return this.result.hps;
        }
    });

    Object.defineProperty(this, "mfcc", {
        'value': function () {
            if (_mfcc = undefined) {
                console.error("Run init_mfcc(freq_bands, freq_min, freq_max, style) first");
                return null;
            }
            if (this.result.mfcc == undefined) {
                this.result.mfcc = xtract_mfcc(_data);
            }
            return this.result.mfcc;
        }
    });

    Object.defineProperty(this, "dct", {
        'value': function () {
            if (this.result.dct == undefined) {
                this.result.dct = xtract_dct_2(_amps, _dct);
            }
            return this.result.dct;
        }
    });
    
    Object.defineProperty(this, "bark_coefficients", {
        'value': function() {
            if (this.result.bark_coefficients == undefined) {
                if (this.bark == undefined) {
                    this.init_bark(_length,_Fs);
                }
                this.result.bark_coefficients = xtract_bark_coefficients(_data, this.bark);
            }
            return this.result.bark_coefficients;
        }
    })

    Object.defineProperty(this, "peak_spectrum", {
        'value': function (threshold) {
            if (this.result.peak_spectrum == undefined) {
                this.result.peak_spectrum = new PeakSpectrumData(_length, _Fs);
                var ps = xtract_peak_spectrum(_data, _Fs / _length, threshold);
                this.result.peak_spectrum.copyDataFrom(ps.subarray(0, _length));
            }
            return this.result.peak_spectrum;
        }
    });

}

var PeakSpectrumData = function (N, sampleRate) {
    if (N == undefined || N <= 0) {
        console.error("SpectrumData constructor requires N to be a defined, whole number");
        return;
    }
    if (sampleRate == undefined) {
        sampleRate = Math.PI;
    }
    this.__proto__ = new SpectrumData(N);
    this.__proto__.constructor = PeakSpectrumData;

    // Peak Specturm features
    Object.defineProperty(this, "spectral_inharmonicity", {
        'value': function () {
            if (this.result.spectral_inharmonicity == undefined) {
                this.result.spectral_inharmonicity = xtract_spectral_inharmonicity(_data, _f0);
            }
            return this.result.spectral_inharmonicity;
        }
    });

    Object.defineProperty(this, "harmonic_spectrum", {
        'value': function (f0, threshold) {
            if (this.result.harmonic_spectrum == undefined) {
                this.result.harmonic_spectrum = new HarmonicSpectrumData(_length, _Fs);
                var hs = xtract_harmonic_spectrum(_data, f0, threshold);
                this.result.harmonic_spectrum.copyDataFrom(hs.subarray(0, _length));
            }
            return this.result.harmonic_spectrum;
        }
    });
}

var HarmonicSpectrumData = function (N, sampleRate) {
    if (N == undefined || N <= 0) {
        console.error("SpectrumData constructor requires N to be a defined, whole number");
        return;
    }
    if (sampleRate == undefined) {
        sampleRate = Math.PI;
    }
    this.__proto__ = new PeakSpectrumData(N);
    this.__proto__.constructor = HarmonicSpectrumData;

    // Harmonic Spectrum features
    Object.defineProperty(this, "odd_even_ratio", {
        'value': function () {
            if (this.result.odd_even_ratio == undefined) {
                this.result.odd_even_ratio = xtract_odd_even_ratio(_data, _f0);
            }
            return this.result.odd_even_ratio;
        }
    });
}

Float32Array.prototype.xtract_get_data_frames = function (frame_size, hop_size, copy) {
    if (typeof frame_size != "number") {
        throw ("xtract_get_data_frames requires the frame_size to be defined");
    }
    if (frame_size <= 0 || frame_size != Math.floor(frame_size)) {
        throw ("xtract_get_data_frames requires the frame_size to be a positive integer");
    }
    if (hop_size == undefined) {
        hop_size = frame_size;
    }
    if (hop_size <= 0 || hop_size != Math.floor(hop_size)) {
        throw ("xtract_get_data_frames requires the hop_size to be a positive integer");
    }
    var frames = [];
    var N = this.length;
    var K = Math.ceil(N / hop_size);
    var sub_frame;
    for (var k = 0; k < K; k++) {
        var offset = k * hop_size;
        if (copy) {
            sub_frame = new Float64Array(frame_size);
            for (var n = 0; n < frame_size && n + offset < this.length; n++) {
                sub_frame[n] = this[n + offset];
            }
        } else {
            sub_frame = this.subarray(offset, offset + frame_size);
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

Float64Array.prototype.xtract_get_data_frames = function (frame_size, hop_size, copy) {
    if (typeof frame_size != "number") {
        throw ("xtract_get_data_frames requires the frame_size to be defined");
    }
    if (frame_size <= 0 || frame_size != Math.floor(frame_size)) {
        throw ("xtract_get_data_frames requires the frame_size to be a positive integer");
    }
    if (hop_size == undefined) {
        hop_size = frame_size;
    }
    if (hop_size <= 0 || hop_size != Math.floor(hop_size)) {
        throw ("xtract_get_data_frames requires the hop_size to be a positive integer");
    }
    var frames = [];
    var N = this.length;
    var K = Math.ceil(N / hop_size);
    var sub_frame;
    for (var k = 0; k < K; k++) {
        var offset = k * hop_size;
        if (copy) {
            sub_frame = new Float64Array(frame_size);
            for (var n = 0; n < frame_size && n + offset < this.length; n++) {
                sub_frame[n] = this[n + offset];
            }
        } else {
            sub_frame = this.subarray(offset, offset + frame_size);
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

Float32Array.prototype.xtract_process_frame_data = function (func, sample_rate, frame_size, hop_size, arg_this) {
    if (typeof func != "function") {
        throw ("xtract_process_frame_data requires func to be a defined function");
    }
    if (typeof sample_rate != "number") {
        throw ("xtract_get_data_frames requires sample_rate to be defined");
    }
    if (typeof frame_size != "number") {
        throw ("xtract_get_data_frames requires the frame_size to be defined");
    }
    if (frame_size <= 0 || frame_size != Math.floor(frame_size)) {
        throw ("xtract_get_data_frames requires the frame_size to be a positive integer");
    }
    if (hop_size == undefined) {
        hop_size = frame_size;
    }
    if (hop_size <= 0 || hop_size != Math.floor(hop_size)) {
        throw ("xtract_get_data_frames requires the hop_size to be a positive integer");
    }
    var frames = this.xtract_get_data_frames(frame_size, hop_size);
    var result = {
        num_frames: frames.length,
        results: []
    };
    var fft_size = frame_size >> 1;
    var frame_time = 0;
    var data = {
        frame_size: frame_size,
        hop_size: hop_size,
        sample_rate: sample_rate,
        TimeData: undefined,
        SpectrumData: undefined
    };
    var prev_data = undefined;
    var prev_result = undefined;
    for (var frame of frames) {
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

Float64Array.prototype.xtract_process_frame_data = function (func, sample_rate, frame_size, hop_size, arg_this) {
    if (typeof func != "function") {
        throw ("xtract_process_frame_data requires func to be a defined function");
    }
    if (typeof sample_rate != "number") {
        throw ("xtract_get_data_frames requires sample_rate to be defined");
    }
    if (typeof frame_size != "number") {
        throw ("xtract_get_data_frames requires the frame_size to be defined");
    }
    if (frame_size <= 0 || frame_size != Math.floor(frame_size)) {
        throw ("xtract_get_data_frames requires the frame_size to be a positive integer");
    }
    if (hop_size == undefined) {
        hop_size = frame_size;
    }
    if (hop_size <= 0 || hop_size != Math.floor(hop_size)) {
        throw ("xtract_get_data_frames requires the hop_size to be a positive integer");
    }
    var frames = this.xtract_get_data_frames(frame_size, hop_size);
    var result = {
        num_frames: frames.length,
        results: []
    };
    var fft_size = frame_size >> 1;
    var frame_time = 0;
    var data = {
        frame_size: frame_size,
        hop_size: hop_size,
        sample_rate: sample_rate,
        TimeData: undefined,
        SpectrumData: undefined
    };
    var prev_data = undefined;
    var prev_result = undefined;
    for (var frame of frames) {
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

Float32Array.prototype.toJSON = function() {
    var json = '[';
    var n = 0;
    while(n < this.length) {
        json = json + this[n];
        if (this[n+1] != undefined) {
            json = json +',';
        }
        n++;
    }
    return json + ']';
}

Float64Array.prototype.toJSON = function() {
    var json = '[';
    var n = 0;
    while(n < this.length) {
        json = json + this[n];
        if (this[n+1] != undefined) {
            json = json +',';
        }
        n++;
    }
    return json + ']';
}

/* 
 * Free FFT and convolution (JavaScript)
 * 
 * Copyright (c) 2014 Project Nayuki
 * https://www.nayuki.io/page/free-small-fft-in-multiple-languages
 * 
 * (MIT License)
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * - The above copyright notice and this permission notice shall be included in
 *   all copies or substantial portions of the Software.
 * - The Software is provided "as is", without warranty of any kind, express or
 *   implied, including but not limited to the warranties of merchantability,
 *   fitness for a particular purpose and noninfringement. In no event shall the
 *   authors or copyright holders be liable for any claim, damages or other
 *   liability, whether in an action of contract, tort or otherwise, arising from,
 *   out of or in connection with the Software or the use or other dealings in the
 *   Software.
 */


/* 
 * Computes the discrete Fourier transform (DFT) of the given complex vector, storing the result back into the vector.
 * The vector can have any length. This is a wrapper function.
 */
function transform(real, imag) {
    if (real.length != imag.length)
        throw "Mismatched lengths";

    var n = real.length;
    if (n == 0)
        return;
    else if ((n & (n - 1)) == 0) // Is power of 2
        transformRadix2(real, imag);
    else // More complicated algorithm for arbitrary sizes
        transformBluestein(real, imag);
}


/* 
 * Computes the inverse discrete Fourier transform (IDFT) of the given complex vector, storing the result back into the vector.
 * The vector can have any length. This is a wrapper function. This transform does not perform scaling, so the inverse is not a true inverse.
 */
function inverseTransform(real, imag) {
    transform(imag, real);
}


/* 
 * Computes the discrete Fourier transform (DFT) of the given complex vector, storing the result back into the vector.
 * The vector's length must be a power of 2. Uses the Cooley-Tukey decimation-in-time radix-2 algorithm.
 */
function transformRadix2(real, imag) {
    // Initialization
    if (real.length != imag.length)
        throw "Mismatched lengths";
    var n = real.length;
    if (n == 1) // Trivial transform
        return;
    var levels = -1;
    for (var i = 0; i < 32; i++) {
        if (1 << i == n)
            levels = i; // Equal to log2(n)
    }
    if (levels == -1)
        throw "Length is not a power of 2";
    var cosTable = new Array(n / 2);
    var sinTable = new Array(n / 2);
    for (var i = 0; i < n / 2; i++) {
        cosTable[i] = Math.cos(2 * Math.PI * i / n);
        sinTable[i] = Math.sin(2 * Math.PI * i / n);
    }

    // Bit-reversed addressing permutation
    for (var i = 0; i < n; i++) {
        var j = reverseBits(i, levels);
        if (j > i) {
            var temp = real[i];
            real[i] = real[j];
            real[j] = temp;
            temp = imag[i];
            imag[i] = imag[j];
            imag[j] = temp;
        }
    }

    // Cooley-Tukey decimation-in-time radix-2 FFT
    for (var size = 2; size <= n; size *= 2) {
        var halfsize = size / 2;
        var tablestep = n / size;
        for (var i = 0; i < n; i += size) {
            for (var j = i, k = 0; j < i + halfsize; j++, k += tablestep) {
                var tpre = real[j + halfsize] * cosTable[k] + imag[j + halfsize] * sinTable[k];
                var tpim = -real[j + halfsize] * sinTable[k] + imag[j + halfsize] * cosTable[k];
                real[j + halfsize] = real[j] - tpre;
                imag[j + halfsize] = imag[j] - tpim;
                real[j] += tpre;
                imag[j] += tpim;
            }
        }
    }

    // Returns the integer whose value is the reverse of the lowest 'bits' bits of the integer 'x'.
    function reverseBits(x, bits) {
        var y = 0;
        for (var i = 0; i < bits; i++) {
            y = (y << 1) | (x & 1);
            x >>>= 1;
        }
        return y;
    }
}


/* 
 * Computes the discrete Fourier transform (DFT) of the given complex vector, storing the result back into the vector.
 * The vector can have any length. This requires the convolution function, which in turn requires the radix-2 FFT function.
 * Uses Bluestein's chirp z-transform algorithm.
 */
function transformBluestein(real, imag) {
    // Find a power-of-2 convolution length m such that m >= n * 2 + 1
    if (real.length != imag.length)
        throw "Mismatched lengths";
    var n = real.length;
    var m = 1;
    while (m < n * 2 + 1)
        m *= 2;

    // Trignometric tables
    var cosTable = new Array(n);
    var sinTable = new Array(n);
    for (var i = 0; i < n; i++) {
        var j = i * i % (n * 2); // This is more accurate than j = i * i
        cosTable[i] = Math.cos(Math.PI * j / n);
        sinTable[i] = Math.sin(Math.PI * j / n);
    }

    // Temporary vectors and preprocessing
    var areal = new Array(m);
    var aimag = new Array(m);
    for (var i = 0; i < n; i++) {
        areal[i] = real[i] * cosTable[i] + imag[i] * sinTable[i];
        aimag[i] = -real[i] * sinTable[i] + imag[i] * cosTable[i];
    }
    for (var i = n; i < m; i++)
        areal[i] = aimag[i] = 0;
    var breal = new Array(m);
    var bimag = new Array(m);
    breal[0] = cosTable[0];
    bimag[0] = sinTable[0];
    for (var i = 1; i < n; i++) {
        breal[i] = breal[m - i] = cosTable[i];
        bimag[i] = bimag[m - i] = sinTable[i];
    }
    for (var i = n; i <= m - n; i++)
        breal[i] = bimag[i] = 0;

    // Convolution
    var creal = new Array(m);
    var cimag = new Array(m);
    convolveComplex(areal, aimag, breal, bimag, creal, cimag);

    // Postprocessing
    for (var i = 0; i < n; i++) {
        real[i] = creal[i] * cosTable[i] + cimag[i] * sinTable[i];
        imag[i] = -creal[i] * sinTable[i] + cimag[i] * cosTable[i];
    }
}


/* 
 * Computes the circular convolution of the given real vectors. Each vector's length must be the same.
 */
function convolveReal(x, y, out) {
    if (x.length != y.length || x.length != out.length)
        throw "Mismatched lengths";
    var zeros = new Array(x.length);
    for (var i = 0; i < zeros.length; i++)
        zeros[i] = 0;
    convolveComplex(x, zeros, y, zeros.slice(), out, zeros.slice());
}


/* 
 * Computes the circular convolution of the given complex vectors. Each vector's length must be the same.
 */
function convolveComplex(xreal, ximag, yreal, yimag, outreal, outimag) {
    if (xreal.length != ximag.length || xreal.length != yreal.length || yreal.length != yimag.length || xreal.length != outreal.length || outreal.length != outimag.length)
        throw "Mismatched lengths";

    var n = xreal.length;
    xreal = xreal.slice();
    ximag = ximag.slice();
    yreal = yreal.slice();
    yimag = yimag.slice();

    transform(xreal, ximag);
    transform(yreal, yimag);
    for (var i = 0; i < n; i++) {
        var temp = xreal[i] * yreal[i] - ximag[i] * yimag[i];
        ximag[i] = ximag[i] * yreal[i] + xreal[i] * yimag[i];
        xreal[i] = temp;
    }
    inverseTransform(xreal, ximag);
    for (var i = 0; i < n; i++) { // Scaling (because this FFT implementation omits it)
        outreal[i] = xreal[i] / n;
        outimag[i] = ximag[i] / n;
    }
}
