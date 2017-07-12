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
Testing suite for js-xtract array manipulation function calls 
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

describe("Array Manipulation", function () {
    describe("xtract_assert_array", function () {
        it("should return false if array is undefined", function (done) {
            assert.ok(sandbox.xtract_assert_array() === false);
            done();
        });
        it("should return false if array is not object", function (done) {
            assert.ok(sandbox.xtract_assert_array(1) === false);
            done();
        });
        it("should return false if array is array-like object", function (done) {
            assert.ok(sandbox.xtract_assert_array({}) === false);
            done();
        });
        it("should return false if array is length of 0", function (done) {
            assert.ok(sandbox.xtract_assert_array([]) === false);
            done();
        });
        it("should return true if array has length", function (done) {
            assert.ok(sandbox.xtract_assert_array([1]));
            done();
        });
    });
    describe("xtract_array_sum", function () {
        it("should return 0 if array is undefined", function (done) {
            assert.equal(0, sandbox.xtract_array_sum(undefined));
            done();
        });
        it("should return 0 if array is empty", function (done) {
            assert.equal(0, sandbox.xtract_array_sum([]));
            done();
        });
        it("should return 6 if array is [1,2,3]", function (done) {
            assert.equal(6, sandbox.xtract_array_sum([1, 2, 3]));
            done();
        });
        it("should return 1 if array is impulse", function (done) {
            assert.equal(1, sandbox.xtract_array_sum(impulse));
            done();
        });
    });
    describe("xtract_array_min", function () {
        it("should return Infinity if array is undefined", function (done) {
            assert.equal(Infinity, sandbox.xtract_array_min(undefined));
            done();
        });
        it("should return Infinity if array is empty", function (done) {
            assert.equal(Infinity, sandbox.xtract_array_min([]));
            done();
        });
        it("should return 1 if array is [1,2,3]", function (done) {
            assert.equal(1, sandbox.xtract_array_min([1, 2, 3]));
            done();
        });
        it("should return 0 if array is impulse", function (done) {
            assert.equal(0, sandbox.xtract_array_min(impulse));
            done();
        });
    });
    describe("xtract_array_max", function () {
        it("should return -Infinity if array is undefined", function (done) {
            assert.equal(-Infinity, sandbox.xtract_array_max(undefined));
            done();
        });
        it("should return -Infinity if array is empty", function (done) {
            assert.equal(-Infinity, sandbox.xtract_array_max([]));
            done();
        });
        it("should return 1 if array is [1,2,3]", function (done) {
            assert.equal(3, sandbox.xtract_array_max([1, 2, 3]));
            done();
        });
        it("should return 1 if array is impulse", function (done) {
            assert.equal(1, sandbox.xtract_array_max(impulse));
            done();
        });
    });
    describe("xtract_array_scale", function () {
        it("should return 0 if array is undefined", function (done) {
            assert.equal(0, sandbox.xtract_array_scale(undefined));
            done();
        });
        it("should return 0 if array is empty", function (done) {
            assert.equal(0, sandbox.xtract_array_scale([]));
            done();
        });
        it("should return [0.5, 1, 1.5] if array is [1,2,3] and f=0.5", function (done) {
            assert.equal(0.5, sandbox.xtract_array_scale([1, 2, 3], 0.5)[0]);
            done();
        });
    });
    describe("xtract_array_normalise", function () {
        it("should return 0 if array is undefined", function (done) {
            assert.equal(0, sandbox.xtract_array_normalise(undefined));
            done();
        });
        it("should return 0 if array is empty", function (done) {
            assert.equal(0, sandbox.xtract_array_normalise([]));
            done();
        });
        it("should return [0.333, 0.666, 1.0] if array is [1,2,3]", function (done) {
            assert.equal(1, sandbox.xtract_array_normalise([1, 2, 3])[2]);
            done();
        });
    });
    describe("xtract_array_bound", function () {
        it("should return 0 if array is undefined", function (done) {
            assert.equal(0, sandbox.xtract_array_bound(undefined));
            done();
        });
        it("should return 0 if array is empty", function (done) {
            assert.equal(0, sandbox.xtract_array_bound([]));
            done();
        });
        it("should return [1,2,3] if array is [1,2,3]", function (done) {
            assert.equal(2, sandbox.xtract_array_bound([1, 2, 3])[1]);
            done();
        });
        it("should return max=0.5 and min=-1.0 of sine wave", function (done) {
            var wave = sandbox.xtract_array_bound(sine, undefined, 0.5);
            assert.equal(0.5, sandbox.xtract_array_max(wave));
            assert.equal(-1.0, Number(sandbox.xtract_array_min(wave).toPrecision(2)));
            done();
        });
        it("should return min=0.5 and max=1.0 of sine wave", function (done) {
            var wave = sandbox.xtract_array_bound(sine, 0.5);
            assert.equal(1.0, Number(sandbox.xtract_array_max(wave).toPrecision(2)));
            assert.equal(0.5, Number(sandbox.xtract_array_min(wave).toPrecision(2)));
            done();
        });
    });
    describe("xtract_array_interlace", function () {
        it("should return [] if data is undefined", function (done) {
            var ret = sandbox.xtract_array_interlace(undefined);
            assert.equal("object", typeof ret);
            assert.equal(0, ret.length);
            done();
        });
        it("should return [] if data is empty", function (done) {
            var ret = sandbox.xtract_array_interlace([]);
            assert.equal("object", typeof ret);
            assert.equal(0, ret.length);
            done();
        });
        it("should return [1,2,3] if data is [[1,2,3]]", function (done) {
            var ret = sandbox.xtract_array_interlace([[1, 2, 3]]);
            assert.equal(1, ret[0]);
            assert.equal(2, ret[1]);
            assert.equal(3, ret[2]);
            done();
        });
        it("should return [1,1,2,2,3,3] if data is [[1,2,3],[1,2,3]]", function (done) {
            var ret = sandbox.xtract_array_interlace([[1, 2, 3], [1, 2, 3]]);
            assert.equal(1, ret[0]);
            assert.equal(1, ret[1]);
            assert.equal(2, ret[2]);
            assert.equal(2, ret[3]);
            assert.equal(3, ret[4]);
            assert.equal(3, ret[5]);
            done();
        });
    });
    describe("xtract_array_deinterlace", function () {
        it("should return [] if data is undefined", function (done) {
            var ret = sandbox.xtract_array_deinterlace(undefined);
            assert.equal("object", typeof ret);
            assert.equal(0, ret.length);
            done();
        });
        it("should return [] if data is empty", function (done) {
            var ret = sandbox.xtract_array_deinterlace([]);
            assert.equal("object", typeof ret);
            assert.equal(0, ret.length);
            done();
        });
        it("should return [1,2,3] if data is [1,2,3]", function (done) {
            var ret = sandbox.xtract_array_deinterlace([1, 2, 3], 1);
            assert.equal("object", typeof ret);
            assert.equal(1, ret[0][0]);
            assert.equal(2, ret[0][1]);
            assert.equal(3, ret[0][2]);
            done();
        });
        it("should return [[1],[2],[3]] if data is [[1,2,3]]", function (done) {
            var ret = sandbox.xtract_array_deinterlace([1, 2, 3], 3);
            assert.equal(1, ret[0][0]);
            assert.equal(2, ret[1][0]);
            assert.equal(3, ret[2][0]);
            done();
        });
        it("should return [1,1,2,2,3,3] if data is [[1,2,3],[1,2,3]]", function (done) {
            var ret = sandbox.xtract_array_deinterlace([1, 1, 2, 2, 3, 3], 2);
            assert.equal(1, ret[0][0]);
            assert.equal(1, ret[1][0]);
            assert.equal(2, ret[0][1]);
            assert.equal(2, ret[1][1]);
            assert.equal(3, ret[0][2]);
            assert.equal(3, ret[1][2]);
            done();
        });
    });
    describe("xtract_get_number_of_frames", function () {
        it("should equal 1 when data.length is 1024 and hop_size is 1024", function (done) {
            assert.equal(1, sandbox.xtract_get_number_of_frames(sine, 1024));
            done();
        });
        it("should equal 2 when data.length is 1024 and hop_size is 512", function (done) {
            assert.equal(2, sandbox.xtract_get_number_of_frames(new Float32Array(1024), 512));
            done();
        });
        it("should equal 8 when data.length is 1024 and hop_size is 128", function (done) {
            assert.equal(8, sandbox.xtract_get_number_of_frames(new Float32Array(1024), 128));
            done();
        });
    });
    describe("xtract_get_data_frames", function () {
        it("should return 8 frames when data.length is 1024 and frame_size is 128", function (done) {
            assert.equal(8, sandbox.xtract_get_data_frames(new Float32Array(1024), 128).length);
            done();
        });
        it("should return 16 frames when data.length is 1024, frame_size is 128 and hop_size is 64", function (done) {
            assert.equal(16, sandbox.xtract_get_data_frames(new Float32Array(1024), 128, 64).length);
            done();
        });
    });
    describe("xtract_frame_from_array", function () {
        it("should return first frame when index = 0", function (done) {
            var N = 128,
                sub = new Float64Array(N),
                n;
            sandbox.xtract_frame_from_array(sine, sub, 0, N, N);
            for (n = 0; n < N; n++) {
                assert.equal(sub[n], sine[n]);
            }
            done();
        });
        it("should return first frame when index = 1", function (done) {
            var N = 128,
                sub = new Float64Array(N),
                n;
            sandbox.xtract_frame_from_array(sine, sub, 1, N, N);
            for (n = 0; n < N; n++) {
                assert.equal(sub[n], sine[n + N]);
            }
            done();
        });
    });
});
