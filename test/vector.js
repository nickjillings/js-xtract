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

describe("Vector", function () {
    describe("xtract_energy", function () {
        it("should return 0 if array is undefined", function (done) {
            assert.equal(0, sandbox.xtract_energy(undefined));
            done();
        });
        it("should return 0 if array is empty", function (done) {
            assert.equal(0, sandbox.xtract_energy([]));
            done();
        });
        it("should return array if array is data", function (done) {
            var ret = sandbox.xtract_energy(sine, 44100, 1024 / 44100);
            assert.equal("object", typeof ret);
            assert.ok(ret.length);
            assert.ok(ret.length > 0);
            done();
        });
        it("should return RMS if array is singular", function (done) {
            var ret = sandbox.xtract_energy(sine, 44100);
            assert.equal(sandbox.xtract_rms_amplitude(sine), ret[0]);
            assert.ok(ret.length);
            assert.ok(ret.length > 0);
            done();
        });
    });
    describe("xtract_spectrum", function () {
        it("should return 0 if array is undefined", function (done) {
            assert.equal(0, sandbox.xtract_spectrum(undefined, 44100));
            done();
        });
        it("should return 0 if array is empty", function (done) {
            assert.equal(0, sandbox.xtract_spectrum([], 44100));
            done();
        });
        it("should return array if array is data", function (done) {
            var ret = sandbox.xtract_spectrum(sine, 44100);
            assert.equal("object", typeof ret);
            assert.ok(ret.length);
            assert.ok(ret.length > 0);
            done();
        });
        it("should add DC if true", function (done) {
            var a = sandbox.xtract_spectrum(sine, 44100, true, false);
            var b = sandbox.xtract_spectrum(sine, 44100, false, false);
            var ampsA = a.subarray(0, a.length >> 1);
            var ampsB = b.subarray(0, b.length >> 1);
            for (var n = 0; n < ampsB.length; n++) {
                assert.equal(ampsA[n + 1], ampsB[n]);
            }
            assert.equal(Number(sandbox.xtract_mean(sine).toFixed(4)), Number(ampsA[0].toFixed(4)));
            done();
        });
        it("should normalise data if true", function (done) {
            var a = sandbox.xtract_spectrum(sine, 44100, false, true);
            var b = sandbox.xtract_spectrum(sine, 44100, false, false);
            var ampsA = a.subarray(0, a.length >> 1);
            var ampsB = b.subarray(0, a.length >> 1);
            ampsB = sandbox.xtract_array_normalise(ampsB);
            for (var n = 0; n < ampsA.length; n++) {
                assert.equal(ampsA[n], ampsB[n]);
            }
            done();
        });
    });
    describe("xtract_complex_spectrum", function () {
        it("should return 0 if array is undefined", function (done) {
            assert.equal(0, sandbox.xtract_complex_spectrum(undefined));
            done();
        });
        it("should return 0 if array is empty", function (done) {
            assert.equal(0, sandbox.xtract_complex_spectrum([]));
            done();
        });
        it("should return array if array is data", function (done) {
            var ret = sandbox.xtract_complex_spectrum(sine, 44100);
            assert.equal("object", typeof ret);
            assert.ok(ret.length);
            assert.ok(ret.length > 0);
            done();
        });
        it("should add DC if true", function (done) {
            var a = sandbox.xtract_complex_spectrum(sine, 44100, true);
            var b = sandbox.xtract_complex_spectrum(sine, 44100, false);
            var A = sandbox.xtract_array_deinterlace(a.subarray(0, (a.length / 3) * 2), 2);
            var B = sandbox.xtract_array_deinterlace(b.subarray(0, (b.length / 3) * 2), 2);
            assert.equal(A[0].length, B[0].length + 1);
            for (var n = 0; n < b[0].length; n++) {
                assert.equal(A[0][n + 1], B[0][n]);
                assert.equal(A[1][n + 1], B[1][n]);
            }
            done();
        });
    });
    describe("xtract_mfcc", function () {
        it("should return 0 if array is undefined", function (done) {
            assert.equal(0, sandbox.xtract_mfcc(undefined));
            done();
        });
        it("should return 0 if array is empty", function (done) {
            assert.equal(0, sandbox.xtract_mfcc([]));
            done();
        });
        var mfcc = sandbox.xtract_init_mfcc(513, 22050, "XTRACT_EQUAL_GAIN", 100, 20000, 12);
        it("should return array if array is data", function (done) {
            var ret = sandbox.xtract_mfcc(sine_spectrum, mfcc);
            assert.equal("object", typeof ret);
            assert.ok(ret.length);
            assert.ok(ret.length > 0);
            done();
        });
    });
    describe("xtract_dct", function () {
        it("should return 0 if array is undefined", function (done) {
            assert.equal(0, sandbox.xtract_dct(undefined));
            done();
        });
        it("should return 0 if array is empty", function (done) {
            assert.equal(0, sandbox.xtract_dct([]));
            done();
        });
        it("should return array if array is data", function (done) {
            var ret = sandbox.xtract_dct(sine.subarray(0, 128));
            assert.equal("object", typeof ret);
            assert.ok(ret.length);
            assert.ok(ret.length > 0);
            done();
        });
    });
    describe("xtract_dct_2", function () {
        it("should return 0 if array is undefined", function (done) {
            assert.equal(0, sandbox.xtract_dct_2(undefined));
            done();
        });
        it("should return 0 if array is empty", function (done) {
            assert.equal(0, sandbox.xtract_dct_2([]));
            done();
        });
        it("should return array if array is data", function (done) {
            var ret = sandbox.xtract_dct_2(sine.subarray(0, 128));
            assert.equal("object", typeof ret);
            assert.ok(ret.length);
            assert.ok(ret.length > 0);
            done();
        });
    });
    describe("xtract_autocorrelation", function () {
        it("should return 0 if array is undefined", function (done) {
            assert.equal(0, sandbox.xtract_autocorrelation(undefined));
            done();
        });
        it("should return 0 if array is empty", function (done) {
            assert.equal(0, sandbox.xtract_autocorrelation([]));
            done();
        });
        it("should return array if array is data", function (done) {
            var ret = sandbox.xtract_autocorrelation(sine_spectrum);
            assert.equal("object", typeof ret);
            assert.ok(ret.length);
            assert.ok(ret.length > 0);
            done();
        });
    });
    describe("xtract_amdf", function () {
        it("should return 0 if array is undefined", function (done) {
            assert.equal(0, sandbox.xtract_amdf(undefined));
            done();
        });
        it("should return 0 if array is empty", function (done) {
            assert.equal(0, sandbox.xtract_amdf([]));
            done();
        });
        it("should return array if array is data", function (done) {
            var ret = sandbox.xtract_amdf(sine_spectrum);
            assert.equal("object", typeof ret);
            assert.ok(ret.length);
            assert.ok(ret.length > 0);
            done();
        });
    });
    describe("xtract_asdf", function () {
        it("should return 0 if array is undefined", function (done) {
            assert.equal(0, sandbox.xtract_asdf(undefined));
            done();
        });
        it("should return 0 if array is empty", function (done) {
            assert.equal(0, sandbox.xtract_asdf([]));
            done();
        });
        it("should return array if array is data", function (done) {
            var ret = sandbox.xtract_asdf(sine_spectrum);
            assert.equal("object", typeof ret);
            assert.ok(ret.length);
            assert.ok(ret.length > 0);
            done();
        });
    });
    describe("xtract_bark_coefficients", function () {
        it("should return 0 if array is undefined", function (done) {
            assert.equal(0, sandbox.xtract_bark_coefficients(undefined));
            done();
        });
        it("should return 0 if array is empty", function (done) {
            assert.equal(0, sandbox.xtract_bark_coefficients([]));
            done();
        });
        var bark_limits = sandbox.xtract_init_bark(1024, 44100);
        it("should return array if array is data", function (done) {
            var ret = sandbox.xtract_bark_coefficients(sine_spectrum, bark_limits);
            assert.equal("object", typeof ret);
            assert.ok(ret.length);
            assert.ok(ret.length > 0);
            done();
        });
    });
    describe("xtract_peak_spectrum", function () {
        it("should return 0 if array is undefined", function (done) {
            assert.equal(0, sandbox.xtract_peak_spectrum(undefined));
            done();
        });
        it("should return 0 if array is empty", function (done) {
            assert.equal(0, sandbox.xtract_peak_spectrum([]));
            done();
        });
        it("should return array if array is data", function (done) {
            var ret = sandbox.xtract_peak_spectrum(sine_spectrum, 44100 / 1024, 90);
            assert.equal("object", typeof ret);
            assert.ok(ret.length);
            assert.ok(ret.length > 0);
            done();
        });
        it("should return 1 nonzero peak from sine spectrum", function (done) {
            var ret = sandbox.xtract_peak_spectrum(sine_spectrum, 44100 / 1024, 90);
            assert.equal(1, sandbox.xtract_nonzero_count(ret.subarray(0, 513)));
            done();
        });
        it("should return 0 peak from impulse spectrum", function (done) {
            var ret = sandbox.xtract_peak_spectrum(impulse_spectrum, 44100 / 1024, 90);
            assert.equal(0, sandbox.xtract_nonzero_count(ret.subarray(0, 513)));
            done();
        });
    });
    describe("xtract_harmonic_spectrum", function () {
        it("should return 0 if array is undefined", function (done) {
            assert.equal(0, sandbox.xtract_harmonic_spectrum(undefined));
            done();
        });
        it("should return 0 if array is empty", function (done) {
            assert.equal(0, sandbox.xtract_harmonic_spectrum([]));
            done();
        });
        var s = sandbox.xtract_spectrum(sinef(1000, 44100), 44100, false, false);
        var peaks = sandbox.xtract_peak_spectrum(s, 44100 / 1024, 90);
        it("should return array if array is data", function (done) {
            var ret = sandbox.xtract_harmonic_spectrum(peaks, 1000, 90);
            assert.equal("object", typeof ret);
            assert.ok(ret.length);
            assert.ok(ret.length > 0);
            done();
        });
        it("should return 1 nonzero peak from sine spectrum", function (done) {
            var ret = sandbox.xtract_harmonic_spectrum(peaks, 1000, 90);
            assert.equal(1, sandbox.xtract_nonzero_count(ret.subarray(0, 513)));
            done();
        });
    });
    describe("xtract_lpc", function () {
        it("should return 0 if array is undefined", function (done) {
            assert.equal(0, sandbox.xtract_lpc(undefined));
            done();
        });
        it("should return 0 if array is empty", function (done) {
            assert.equal(0, sandbox.xtract_lpc([]));
            done();
        });
        it("should return array if array is data", function (done) {
            var aut = sandbox.xtract_autocorrelation(sine);
            var ret = sandbox.xtract_lpc(aut);
            assert.equal("object", typeof ret);
            assert.ok(ret.length);
            assert.ok(ret.length > 0);
            done();
        });
    });
    describe("xtract_lpcc", function () {
        it("should return 0 if array is undefined", function (done) {
            assert.equal(0, sandbox.xtract_lpcc(undefined));
            done();
        });
        it("should return 0 if array is empty", function (done) {
            assert.equal(0, sandbox.xtract_lpcc([]));
            done();
        });
        it("should return array if array is data", function (done) {
            var aut = sandbox.xtract_lpc(sandbox.xtract_autocorrelation(sine));
            var ret = sandbox.xtract_lpcc(aut, 1);
            assert.equal("object", typeof ret);
            assert.ok(ret.length);
            assert.ok(ret.length > 0);
            done();
        });
    });
    describe("xtract_pcp", function () {
        it("should return 0 if array is undefined", function (done) {
            assert.equal(0, sandbox.xtract_pcp(undefined));
            done();
        });
        it("should return 0 if array is empty", function (done) {
            assert.equal(0, sandbox.xtract_pcp([]));
            done();
        });
        it("should return array if array is data", function (done) {
            var ret = sandbox.xtract_pcp(sine_spectrum, undefined, 44100);
            assert.equal("object", typeof ret);
            assert.ok(ret.length);
            assert.ok(ret.length > 0);
            done();
        });
    });
    describe("xtract_yin", function () {
        it("should return 0 if array is undefined", function (done) {
            assert.equal(0, sandbox.xtract_yin(undefined));
            done();
        });
        it("should return 0 if array is empty", function (done) {
            assert.equal(0, sandbox.xtract_yin([]));
            done();
        });
        it("should return array if array is data", function (done) {
            var ret = sandbox.xtract_yin(sinef(1000, 44100));
            assert.equal("object", typeof ret);
            assert.ok(ret.length);
            assert.ok(ret.length > 0);
            done();
        });
    });
    describe("xtract_onset", function () {
        it("should return 0 if array is undefined", function (done) {
            assert.equal(0, sandbox.xtract_onset(undefined));
            done();
        });
        it("should return 0 if array is empty", function (done) {
            assert.equal(0, sandbox.xtract_onset([]));
            done();
        });
        it("should return array if array is data", function (done) {
            var ret = sandbox.xtract_onset(impulse, 128);
            assert.equal("object", typeof ret);
            assert.ok(ret.length);
            assert.ok(ret.length > 0);
            done();
        });
    });
    describe("xtract_resample", function () {
        it("should return 0 if array is undefined", function (done) {
            assert.equal(0, sandbox.xtract_resample(undefined));
            done();
        });
        it("should return 0 if array is empty", function (done) {
            assert.equal(0, sandbox.xtract_resample([]));
            done();
        });
        it("should return array if array is data", function (done) {
            var ret = sandbox.xtract_resample(impulse, 1, 1);
            assert.equal("object", typeof ret);
            assert.ok(ret.length);
            assert.ok(ret.length > 0);
            done();
        });
        it("should return array of half length is p/q = 0.5", function (done) {
            var ret = sandbox.xtract_resample(impulse, 1, 2);
            assert.equal(impulse.length / 2, ret.length);
            done();
        });
    });
});
