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
}
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
            assert.ok(sandbox.xtract_tristimulus_2(sine_spectrum, 44100 / 1024) < 0.01)
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
            assert.ok(sandbox.xtract_tristimulus_3(sine_spectrum, 44100 / 1024) < 0.01)
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
});
