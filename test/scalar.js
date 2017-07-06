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

/*
Testing suite for js-xtract scalar function calls 
*/
/* globals require, describe, it, module, Float64Array, Float32Array */

var assert = require('assert');
var vm = require("vm");
var fs = require("fs");
var sandbox = {
    globalVar: 1
};
vm.createContext(sandbox);
module.exports = function (path, context) {
    var data = fs.readFileSync(path);
    vm.runInNewContext(data, context, path);
};
module.exports('./jsXtract.min.js', sandbox);

var sine = function () {
    var N = 1024,
        store = new Float64Array(N),
        s = 1.0 / (N - 1);
    for (var n = 0; n < N; n++) {
        store[n] = Math.sin(Math.PI * 2 * s * n);
    }
    return store;
}();

var impulse = function () {
    var N = 1024,
        store = new Float64Array(N);
    store[0] = 1.0;
    return store;
}();

var sinef = function (f0, fs) {
    if (fs === undefined || typeof fs != "number" || fs <= 0) {
        fs = 44100.0;
    }
    if (f0 === undefined || typeof f0 != "number" || f0 <= 0) {
        f0 = 1000.0;
    }
    var store = new Float64Array(1024),
        ts = 1.0 / fs;
    for (var n = 0; n < 1024; n++) {
        store[n] = Math.sin(2.0 * Math.PI * f0 * (n * ts));
    }
    return store;
};

var sine_spectrum = sandbox.xtract_spectrum(sine, 44100, true, false);
var impulse_spectrum = sandbox.xtract_spectrum(impulse, 44100, true, false);

describe('Scalar', function () {
    describe('xtract_mean', function () {
        it('should equal to 0 if array is undefined', function (done) {
            assert.equal(0, sandbox.xtract_mean(undefined));
            done();
        });
        it('should equal to 0 if array is empty', function (done) {
            assert.equal(0, sandbox.xtract_mean([]));
            done();
        });
        it('should equal to 2 if array is [1,2,3]', function (done) {
            assert.equal(2, sandbox.xtract_mean([1, 2, 3]));
            done();
        });
        it('should equal to ~0 if array is sine', function (done) {
            assert.ok(sandbox.xtract_mean(sine) < 0.001);
            done();
        });
        it('should equal to 0.0009765625 if array is impulse', function (done) {
            assert.equal(0.0009765625, sandbox.xtract_mean(impulse));
            done();
        });
    });
    describe('xtract_variance', function () {
        it('should equal to 0 if array is undefined', function (done) {
            assert.equal(0, sandbox.xtract_variance(undefined));
            done();
        });
        it('should equal to 0 if array is empty', function (done) {
            assert.equal(0, sandbox.xtract_variance([]));
            done();
        });
        it('should equal to 1 if array is [1,2,3]', function (done) {
            assert.equal(1, sandbox.xtract_variance([1, 2, 3]));
            done();
        });
        it('should equal to ~0.5 if array is sine', function (done) {
            assert.equal(0.5, Number(sandbox.xtract_variance(sine).toPrecision(3)));
            done();
        });
        it('should equal to 0.0009765625 if array is impulse', function (done) {
            assert.equal(0.0009765625, sandbox.xtract_variance(impulse));
            done();
        });
    });
    describe('xtract_standard_deviation', function () {
        it('should equal to 0 if array is undefined', function (done) {
            assert.equal(0, sandbox.xtract_standard_deviation(undefined));
            done();
        });
        it('should equal to 0 if array is empty', function (done) {
            assert.equal(0, sandbox.xtract_standard_deviation([]));
            done();
        });
        it('should equal to 1 if array is [1,2,3]', function (done) {
            assert.equal(1, sandbox.xtract_standard_deviation([1, 2, 3]));
            done();
        });
        it('should equal to ~0.707 if array is sine', function (done) {
            assert.equal(0.707, Number(sandbox.xtract_standard_deviation(sine).toPrecision(3)));
            done();
        });
        it('should equal to ~0.0313 if array is impulse', function (done) {
            assert.equal(0.0313, Number(sandbox.xtract_standard_deviation(impulse).toPrecision(3)));
            done();
        });
    });
    describe('xtract_average_deviation', function () {
        it('should equal to 0 if array is undefined', function (done) {
            assert.equal(0, sandbox.xtract_average_deviation(undefined));
            done();
        });
        it('should equal to 0 if array is empty', function (done) {
            assert.equal(0, sandbox.xtract_average_deviation([]));
            done();
        });
        it('should equal to ~0.667 if array is [1,2,3]', function (done) {
            assert.equal(0.667, Number(sandbox.xtract_average_deviation([1, 2, 3]).toPrecision(3)));
            done();
        });
        it('should equal to ~0.636 if array is sine', function (done) {
            assert.equal(0.636, Number(sandbox.xtract_average_deviation(sine).toPrecision(3)));
            done();
        });
        it('should equal to ~0.001951 if array is impulse', function (done) {
            assert.equal(0.001951, Number(sandbox.xtract_average_deviation(impulse).toPrecision(4)));
            done();
        });
    });
    describe('xtract_skewness', function () {
        it('should equal to 0 if array is undefined', function (done) {
            assert.equal(0, sandbox.xtract_skewness(undefined));
            done();
        });
        it('should equal to 0 if array is empty', function (done) {
            assert.equal(0, sandbox.xtract_skewness([]));
            done();
        });
        it('should equal to 0 if array is [1,2,3]', function (done) {
            assert.equal(0, sandbox.xtract_skewness([1, 2, 3]));
            done();
        });
        it('should equal to ~0 if array is sine', function (done) {
            assert.ok(sandbox.xtract_skewness(sine) < 0.001);
            done();
        });
        it('should equal to ~31.9 if array is impulse', function (done) {
            assert.equal(31.9, Number(sandbox.xtract_skewness(impulse).toPrecision(3)));
            done();
        });
    });
    describe('xtract_kurtosis', function () {
        it('should equal to 0 if array is undefined', function (done) {
            assert.equal(0, sandbox.xtract_kurtosis(undefined));
            done();
        });
        it('should equal to 0 if array is empty', function (done) {
            assert.equal(0, sandbox.xtract_kurtosis([]));
            done();
        });
        it('should equal to ~0.667 if array is [1,2,3]', function (done) {
            assert.equal(0.667, Number(sandbox.xtract_kurtosis([1, 2, 3]).toPrecision(3)));
            done();
        });
        it('should equal to ~1.5 if array is sine', function (done) {
            assert.equal(1.5, Number(sandbox.xtract_kurtosis(sine).toPrecision(2)));
            done();
        });
        it('should equal to ~1020 if array is impulse', function (done) {
            assert.equal(1020, Number(sandbox.xtract_kurtosis(impulse).toPrecision(4)));
            done();
        });
    });
    describe('xtract_spectral_centroid', function () {
        it('should equal to 0 if array is undefined', function (done) {
            assert.equal(0, sandbox.xtract_spectral_centroid(undefined));
            done();
        });
        it('should equal to 0 if array is empty', function (done) {
            assert.equal(0, sandbox.xtract_spectral_centroid([]));
            done();
        });
        it('should equal to 92Hz if array is spectrum of sine', function (done) {
            assert.equal(92, Number(sandbox.xtract_spectral_centroid(sine_spectrum).toPrecision(2)));
            done();
        });
        it('should equal to 11k if array is spectrum of impulse', function (done) {
            assert.equal(11000, Number(sandbox.xtract_spectral_centroid(impulse_spectrum).toPrecision(2)));
            done();
        });
    });
    describe('xtract_spectral_mean', function () {
        it('should equal to 0 if array is undefined', function (done) {
            assert.equal(0, sandbox.xtract_spectral_mean(undefined));
            done();
        });
        it('should equal to 0 if array is empty', function (done) {
            assert.equal(0, sandbox.xtract_spectral_mean([]));
            done();
        });
        it('should equal to 0.000986 if array is spectrum of sine', function (done) {
            assert.equal(0.000986, Number(sandbox.xtract_spectral_mean(sine_spectrum).toPrecision(3)));
            done();
        });
        it('should equal to 0.000977 if array is spectrum of impulse', function (done) {
            assert.equal(0.000977, Number(sandbox.xtract_spectral_mean(impulse_spectrum).toPrecision(3)));
            done();
        });
    });
    describe('xtract_spectral_variance', function () {
        it('should equal to 0 if array is undefined', function (done) {
            assert.equal(0, sandbox.xtract_spectral_variance(undefined));
            done();
        });
        it('should equal to 0 if array is empty', function (done) {
            assert.equal(0, sandbox.xtract_spectral_variance([]));
            done();
        });
        /*
        it('should equal to 0 if array is spectrum of sine', function (done) {
            assert.equal(0, Number(sandbox.xtract_spectral_variance(sine_spectrum).toPrecision(2)));
            done();
        });
        it('should equal to 11k if array is spectrum of impulse', function (done) {
            assert.equal(11000, Number(sandbox.xtract_spectral_variance(impulse_spectrum).toPrecision(2)));
            done();
        });
        */
    });
    describe('xtract_spectral_standard_deviation', function () {
        it('should equal to 0 if array is undefined', function (done) {
            assert.equal(0, sandbox.xtract_spectral_standard_deviation(undefined));
            done();
        });
        it('should equal to 0 if array is empty', function (done) {
            assert.equal(0, sandbox.xtract_spectral_standard_deviation([]));
            done();
        });
        it('should equal to 764 if array is spectrum of sine', function (done) {
            assert.equal(764, Number(sandbox.xtract_spectral_standard_deviation(sine_spectrum).toPrecision(3)));
            done();
        });
        it('should equal to 6380 if array is spectrum of impulse', function (done) {
            assert.equal(6380, Number(sandbox.xtract_spectral_standard_deviation(impulse_spectrum).toPrecision(3)));
            done();
        });
    });
    describe('xtract_spectral_skewness', function () {
        it('should equal to 0 if array is undefined', function (done) {
            assert.equal(0, sandbox.xtract_spectral_skewness(undefined));
            done();
        });
        it('should equal to 0 if array is empty', function (done) {
            assert.equal(0, sandbox.xtract_spectral_skewness([]));
            done();
        });
        it('should equal to 19.9 if array is spectrum of sine', function (done) {
            assert.equal(19.9, Number(sandbox.xtract_spectral_skewness(sine_spectrum).toPrecision(3)));
            done();
        });
        it('should equal to 1.3 if array is spectrum of impulse', function (done) {
            assert.equal(1.3, Number(sandbox.xtract_spectral_skewness(impulse_spectrum).toPrecision(3)));
            done();
        });
    });
    describe('xtract_spectral_kurtosis', function () {
        it('should equal to 0 if array is undefined', function (done) {
            assert.equal(0, sandbox.xtract_spectral_kurtosis(undefined));
            done();
        });
        it('should equal to 0 if array is empty', function (done) {
            assert.equal(0, sandbox.xtract_spectral_kurtosis([]));
            done();
        });
        it('should equal to 441 if array is spectrum of sine', function (done) {
            assert.equal(441, Number(sandbox.xtract_spectral_kurtosis(sine_spectrum).toPrecision(3)));
            done();
        });
        it('should equal to 1.8 if array is spectrum of impulse', function (done) {
            assert.equal(1.8, Number(sandbox.xtract_spectral_kurtosis(impulse_spectrum).toPrecision(3)));
            done();
        });
    });
    describe('xtract_irregularity_k', function () {
        it('should equal to 0 if array is undefined', function (done) {
            assert.equal(0, sandbox.xtract_irregularity_k(undefined));
            done();
        });
        it('should equal to 0 if array is empty', function (done) {
            assert.equal(0, sandbox.xtract_irregularity_k([]));
            done();
        });
        it('should equal to ~1 if array is spectrum of sine', function (done) {
            assert.equal(0.987, Number(sandbox.xtract_irregularity_k(sine_spectrum).toPrecision(3)));
            done();
        });
        it('should equal to ~0 if array is spectrum of impulse', function (done) {
            assert.ok(sandbox.xtract_irregularity_k(impulse_spectrum) < 0.001);
            done();
        });
    });
    describe('xtract_irregularity_j', function () {
        it('should equal to 0 if array is undefined', function (done) {
            assert.equal(0, sandbox.xtract_irregularity_j(undefined));
            done();
        });
        it('should equal to 0 if array is empty', function (done) {
            assert.equal(0, sandbox.xtract_irregularity_j([]));
            done();
        });
        it('should equal to 2 if array is spectrum of sine', function (done) {
            assert.equal(2, Number(sandbox.xtract_irregularity_j(sine_spectrum).toPrecision(3)));
            done();
        });
        it('should equal to 0 if array is spectrum of impulse', function (done) {
            assert.equal(0, Number(sandbox.xtract_irregularity_j(impulse_spectrum).toPrecision(3)));
            done();
        });
    });
    describe('xtract_tristimulus_1', function () {
        it('should equal to 0 if array is undefined', function (done) {
            assert.equal(0, sandbox.xtract_tristimulus_1(undefined));
            done();
        });
        it('should equal to 0 if array is empty', function (done) {
            assert.equal(0, sandbox.xtract_tristimulus_1([]));
            done();
        });
        it('should equal to ~1 if array is spectrum of sine', function (done) {
            assert.ok(sandbox.xtract_tristimulus_1(sine_spectrum, 44100 / 1024) > 0.98);
            done();
        });
    });
    describe('xtract_tristimulus_2', function () {
        it('should equal to 0 if array is undefined', function (done) {
            assert.equal(0, sandbox.xtract_tristimulus_2(undefined));
            done();
        });
        it('should equal to 0 if array is empty', function (done) {
            assert.equal(0, sandbox.xtract_tristimulus_2([]));
            done();
        });
        it('should equal to ~0 if array is spectrum of sine', function (done) {
            assert.ok(sandbox.xtract_tristimulus_2(sine_spectrum, 44100 / 1024) < 0.01);
            done();
        });
    });
    describe('xtract_tristimulus_3', function () {
        it('should equal to 0 if array is undefined', function (done) {
            assert.equal(0, sandbox.xtract_tristimulus_3(undefined));
            done();
        });
        it('should equal to 0 if array is empty', function (done) {
            assert.equal(0, sandbox.xtract_tristimulus_3([]));
            done();
        });
        it('should equal to ~0 if array is spectrum of sine', function (done) {
            assert.ok(sandbox.xtract_tristimulus_3(sine_spectrum, 44100 / 1024) < 0.01);
            done();
        });
    });
    describe('xtract_smoothness', function () {
        it('should equal to 0 if array is undefined', function (done) {
            assert.equal(0, sandbox.xtract_smoothness(undefined));
            done();
        });
        it('should equal to 0 if array is empty', function (done) {
            assert.equal(0, sandbox.xtract_smoothness([]));
            done();
        });
        it('should equal to 359 if array is spectrum of sine', function (done) {
            assert.equal(359, Number(sandbox.xtract_smoothness(sine_spectrum).toPrecision(3)));
            done();
        });
        it('should equal to 0 if array is spectrum of impulse', function (done) {
            assert.ok(sandbox.xtract_smoothness(impulse_spectrum) < 0.001);
            done();
        });
    });
    describe('xtract_zcr', function () {
        it('should equal to 0 if array is undefined', function (done) {
            assert.equal(0, sandbox.xtract_zcr(undefined));
            done();
        });
        it('should equal to 0 if array is empty', function (done) {
            assert.equal(0, sandbox.xtract_zcr([]));
            done();
        });
        it('should equal to 1/N if array is of sine', function (done) {
            assert.equal(1 / sine.length, sandbox.xtract_zcr(sine));
            done();
        });
        it('should equal to 0 if array is of impulse', function (done) {
            assert.equal(0, sandbox.xtract_zcr(impulse));
            done();
        });
    });
    describe('xtract_rolloff', function () {
        it('should equal to 0 if array is undefined', function (done) {
            assert.equal(0, sandbox.xtract_rolloff(undefined));
            done();
        });
        it('should equal to 0 if array is empty', function (done) {
            assert.equal(0, sandbox.xtract_rolloff([]));
            done();
        });
        it('should equal to ~20k if array is of impulse', function (done) {
            assert.equal(20000, Number(sandbox.xtract_rolloff(impulse_spectrum, 44100, 90).toPrecision(1)));
            done();
        });
    });
    describe('xtract_loudness', function () {
        var bark_limits = sandbox.xtract_init_bark(1024, 44100);
        it('should equal to 0 if array is undefined', function (done) {
            assert.equal(0, sandbox.xtract_loudness(undefined));
            done();
        });
        it('should equal to 0 if array is empty', function (done) {
            assert.equal(0, sandbox.xtract_loudness([]));
            done();
        });
        it('should equal to 5.065870190241803 if array is of sine', function (done) {
            var barks = sandbox.xtract_bark_coefficients(sine_spectrum, bark_limits);
            assert.equal(5.065870190241803, sandbox.xtract_loudness(barks));
            done();
        });
        it('should equal to 10.172043580560036 if array is of impulse', function (done) {
            var barks = sandbox.xtract_bark_coefficients(impulse_spectrum, bark_limits);
            assert.equal(10.172043580560036, sandbox.xtract_loudness(barks));
            done();
        });
    });
    describe('xtract_flatness', function () {
        it('should equal to 0 if array is undefined', function (done) {
            assert.equal(0, sandbox.xtract_flatness(undefined));
            done();
        });
        it('should equal to 0 if array is empty', function (done) {
            assert.equal(0, sandbox.xtract_flatness([]));
            done();
        });
        it('should equal to ~0 if array is of sine', function (done) {
            assert.ok(sandbox.xtract_flatness(sine_spectrum) < 0.01);
            done();
        });
        it('should equal to ~1 if array is of impulse', function (done) {
            assert.ok(sandbox.xtract_flatness(impulse_spectrum) > 0.98);
            done();
        });
    });
    describe('xtract_flatness_db', function () {
        it('should equal to 0 if array is undefined', function (done) {
            assert.equal(0, sandbox.xtract_flatness_db(undefined));
            done();
        });
        it('should equal to 0 if array is empty', function (done) {
            assert.equal(0, sandbox.xtract_flatness_db([]));
            done();
        });
        it('should equal to ~-24dB if array is of sine', function (done) {
            assert.equal(10.0 * Math.log10(sandbox.xtract_flatness(sine_spectrum)), sandbox.xtract_flatness_db(sine_spectrum));
            done();
        });
        it('should equal to 0dB if array is of impulse', function (done) {
            assert.equal(10.0 * Math.log10(sandbox.xtract_flatness(impulse_spectrum)), sandbox.xtract_flatness_db(impulse_spectrum));
            done();
        });
    });
    describe('xtract_tonality', function () {
        it('should equal to 0 if array is undefined', function (done) {
            assert.equal(0, sandbox.xtract_tonality(undefined));
            done();
        });
        it('should equal to 0 if array is empty', function (done) {
            assert.equal(0, sandbox.xtract_tonality([]));
            done();
        });
        it('should equal to 0.405840274557258 if array is spectrum of sine', function (done) {
            assert.equal(0.405840274557258, sandbox.xtract_tonality(sine_spectrum));
            done();
        });
        it('should equal to ~0 if array is spectrum of impulse', function (done) {
            assert.ok(sandbox.xtract_tonality(impulse_spectrum) < 0.01);
            done();
        });
    });
    describe('xtract_crest', function () {
        it('should equal to 0 if array is undefined', function (done) {
            assert.equal(0, sandbox.xtract_crest(undefined));
            done();
        });
        it('should equal to 0 if array is empty', function (done) {
            assert.equal(0, sandbox.xtract_crest([]));
            done();
        });
        it('should equal to 506.746332627167 if array is spectrum of sine', function (done) {
            assert.equal(506.746332627167, sandbox.xtract_crest(sine_spectrum.subarray(0, 513)));
            done();
        });
        it('should equal to ~1 if array is spectrum of impulse', function (done) {
            assert.equal(1, Number(sandbox.xtract_crest(impulse_spectrum.subarray(0, 513)).toPrecision(2)));
            done();
        });
    });
    describe('xtract_rms_amplitude', function () {
        it('should equal to 0 if array is undefined', function (done) {
            assert.equal(0, sandbox.xtract_rms_amplitude(undefined));
            done();
        });
        it('should equal to 0 if array is empty', function (done) {
            assert.equal(0, sandbox.xtract_rms_amplitude([]));
            done();
        });
        it('should equal to ~0.707 if array is of sine', function (done) {
            assert.equal(0.707, Number(sandbox.xtract_rms_amplitude(sine).toPrecision(3)));
            done();
        });
        it('should equal to SQRT(1/N) if array is of impulse', function (done) {
            assert.equal(Math.sqrt(1 / impulse.length), sandbox.xtract_rms_amplitude(impulse));
            done();
        });
    });
    describe('xtract_spectral_inharmonicity', function () {
        it('should equal to 0 if array is undefined', function (done) {
            assert.equal(0, sandbox.xtract_spectral_inharmonicity(undefined));
            done();
        });
        it('should equal to 0 if array is empty', function (done) {
            assert.equal(0, sandbox.xtract_spectral_inharmonicity([]));
            done();
        });
    });
    describe('xtract_odd_even_ratio', function () {
        it('should equal to 0 if array is undefined', function (done) {
            assert.equal(0, sandbox.xtract_odd_even_ratio(undefined));
            done();
        });
        it('should equal to 0 if array is empty', function (done) {
            assert.equal(0, sandbox.xtract_odd_even_ratio([]));
            done();
        });
    });
    describe('xtract_sharpness', function () {
        var bark_limits = sandbox.xtract_init_bark(1024, 44100);
        it('should equal to 0 if array is undefined', function (done) {
            assert.equal(0, sandbox.xtract_sharpness(undefined));
            done();
        });
        it('should equal to 0 if array is empty', function (done) {
            assert.equal(0, sandbox.xtract_sharpness([]));
            done();
        });
        it('should equal to 0.3903750243172459 if array is of sine', function (done) {
            var barks = sandbox.xtract_bark_coefficients(sine_spectrum, bark_limits);
            assert.equal(0.3903750243172459, sandbox.xtract_sharpness(barks));
            done();
        });
        it('should equal to 1.2369119868301146 if array is of impulse', function (done) {
            var barks = sandbox.xtract_bark_coefficients(impulse_spectrum, bark_limits);
            assert.equal(1.2369119868301146, sandbox.xtract_sharpness(barks));
            done();
        });
    });
    describe('xtract_spectral_slope', function () {
        it('should equal to 0 if array is undefined', function (done) {
            assert.equal(0, sandbox.xtract_spectral_slope(undefined));
            done();
        });
        it('should equal to 0 if array is empty', function (done) {
            assert.equal(0, sandbox.xtract_spectral_slope([]));
            done();
        });
        it('should equal to ~0 if array is of sine', function (done) {
            assert.ok(sandbox.xtract_spectral_slope(sine_spectrum) < 0.001);
            done();
        });
        it('should equal to ~0 if array is of impulse', function (done) {
            assert.ok(sandbox.xtract_spectral_slope(impulse_spectrum) < 0.001);
            done();
        });
    });
    describe('xtract_lowest_value', function () {
        it('should equal to 0 if array is undefined', function (done) {
            assert.equal(0, sandbox.xtract_lowest_value(undefined));
            done();
        });
        it('should equal to 0 if array is empty', function (done) {
            assert.equal(0, sandbox.xtract_lowest_value([]));
            done();
        });
        it('should equal to -1 if array is of sine', function (done) {
            assert.equal(-1, Number(sandbox.xtract_lowest_value(sine).toPrecision(2)));
            done();
        });
        it('should equal to 0 if array is of impulse', function (done) {
            assert.equal(0, sandbox.xtract_lowest_value(impulse));
            done();
        });
    });
    describe('xtract_highest_value', function () {
        it('should equal to 0 if array is undefined', function (done) {
            assert.equal(0, sandbox.xtract_highest_value(undefined));
            done();
        });
        it('should equal to 0 if array is empty', function (done) {
            assert.equal(0, sandbox.xtract_highest_value([]));
            done();
        });
        it('should equal to 1 if array is of sine', function (done) {
            assert.equal(1, Number(sandbox.xtract_highest_value(sine).toPrecision(2)));
            done();
        });
        it('should equal to 1 if array is of impulse', function (done) {
            assert.equal(1, sandbox.xtract_highest_value(impulse));
            done();
        });
    });
    describe('xtract_sum', function () {
        it('should equal to 0 if array is undefined', function (done) {
            assert.equal(0, sandbox.xtract_sum(undefined));
            done();
        });
        it('should equal to 0 if array is empty', function (done) {
            assert.equal(0, sandbox.xtract_sum([]));
            done();
        });
        it('should equal to ~0 if array is of sine', function (done) {
            assert.ok(sandbox.xtract_sum(sine) < 0.001);
            done();
        });
        it('should equal to 1 if array is of impulse', function (done) {
            assert.equal(1, sandbox.xtract_sum(impulse));
            done();
        });
    });
    describe('xtract_nonzero_count', function () {
        it('should equal to 0 if array is undefined', function (done) {
            assert.equal(0, sandbox.xtract_nonzero_count(undefined));
            done();
        });
        it('should equal to 0 if array is empty', function (done) {
            assert.equal(0, sandbox.xtract_nonzero_count([]));
            done();
        });
        it('should equal to N-1 if array is of sine', function (done) {
            assert.equal(sine.length - 1, sandbox.xtract_nonzero_count(sine));
            done();
        });
        it('should equal to 1 if array is of impulse', function (done) {
            assert.equal(1, sandbox.xtract_nonzero_count(impulse));
            done();
        });
    });
    describe('xtract_hps', function () {
        it('should equal to 0 if array is undefined', function (done) {
            assert.equal(0, sandbox.xtract_hps(undefined));
            done();
        });
        it('should equal to 0 if array is empty', function (done) {
            assert.equal(0, sandbox.xtract_hps([]));
            done();
        });
        it('should equal to 43.06640625 if array is of sine', function (done) {
            assert.equal(43.06640625, sandbox.xtract_hps(sine_spectrum));
            done();
        });
        it('should equal to 0 if array is of impulse', function (done) {
            assert.equal(0, sandbox.xtract_hps(impulse_spectrum));
            done();
        });
    });
    describe('xtract_f0', function () {
        it('should equal to 0 if array is undefined', function (done) {
            assert.equal(0, sandbox.xtract_f0(undefined));
            done();
        });
        it('should equal to 0 if array is empty', function (done) {
            assert.equal(0, sandbox.xtract_f0([]));
            done();
        });
        it('should equal to -0 if array is of impulse', function (done) {
            assert.equal(-0, sandbox.xtract_f0(impulse, 44100));
            done();
        });
        it('should equal to 1000 if array is of sine 1kHz', function (done) {
            assert.equal(1000, Number(sandbox.xtract_f0(sinef(1000, 44100), 44100).toPrecision(3)));
            done();
        });
    });
    describe('xtract_wavelet_f0', function () {
        it('should equal to 0 if array is undefined', function (done) {
            assert.equal(0, sandbox.xtract_wavelet_f0(undefined));
            done();
        });
        it('should equal to 0 if array is empty', function (done) {
            assert.equal(0, sandbox.xtract_wavelet_f0([]));
            done();
        });
        it('should equal to -1 if array is of sine', function (done) {
            assert.equal(-1, sandbox.xtract_wavelet_f0(sine, 44100, sandbox.xtract_init_wavelet()));
            done();
        });
        it('should equal to -1 if array is of impulse', function (done) {
            assert.equal(-1, sandbox.xtract_wavelet_f0(impulse, 44100, sandbox.xtract_init_wavelet()));
            done();
        });
        it('should equal to 1000 if array is of sine 1kHz', function (done) {
            assert.equal(1000, Number(sandbox.xtract_wavelet_f0(sinef(1000, 44100), 44100, sandbox.xtract_init_wavelet()).toPrecision(3)));
            done();
        });
    });
    describe('xtract_midicent', function () {
        it('should equal to -1 if f0 is undefined', function (done) {
            assert.equal(-1, sandbox.xtract_midicent(undefined));
            done();
        });
        it('should equal to 6901 if f0 is undefined', function (done) {
            assert.equal(6901, sandbox.xtract_midicent(440.00));
            done();
        });
    });
    describe('xtract_spectral_fundamental', function () {
        it('should equal to 0 if array is undefined', function (done) {
            assert.equal(0, sandbox.xtract_spectral_fundamental(undefined));
            done();
        });
        it('should equal to 0 if array is empty', function (done) {
            assert.equal(0, sandbox.xtract_spectral_fundamental([]));
            done();
        });
        it('should equal to 1000 if array is of sine 1kHz', function (done) {
            var sp = sandbox.xtract_spectrum(sinef(1000, 44100), 44100, true, false);
            assert.equal(1000, Number(sandbox.xtract_spectral_fundamental(sp, 44100).toPrecision(2)));
            done();
        });
    });
});
