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

var jsXtract = (function (urlroot) {
    var Module;
    if ((typeof global === "undefined" && typeof window !== "undefined") && typeof WebAssembly !== "undefined") {
        fetch(urlroot+"jsXtract-wasm.wasm").then(function(response) {
            return response.arrayBuffer();
        }).then(function (bytes) {
            window.Module = {};
            window.Module.wasmBinary = bytes;
            window.Module.postRun = [function() {
                Module.xtract_array_sum = {};
                Module.xtract_array_sum.fp32 = Module.cwrap("xtract_array_sum_fp32", "number", ["array", "number"]);
                Module.xtract_array_sum.fp64 = Module.cwrap("xtract_array_sum_fp64", "number", ["array", "number"]);
                Module.xtract_array_sum.fp32_pinned = Module.cwrap("xtract_array_sum_fp32", "number", ["number", "number"]);
                Module.xtract_array_sum.fp64_pinned = Module.cwrap("xtract_array_sum_fp64", "number", ["number", "number"]);
                Module.xtract_array_max = {};
                Module.xtract_array_max.fp32 = Module.cwrap("xtract_array_max_fp32", "number", ["array", "number"]);
                Module.xtract_array_max.fp64 = Module.cwrap("xtract_array_max_fp64", "number", ["array", "number"]);
                Module.xtract_array_max.fp32_pinned = Module.cwrap("xtract_array_max_fp32", "number", ["number", "number"]);
                Module.xtract_array_max.fp64_pinned = Module.cwrap("xtract_array_max_fp64", "number", ["number", "number"]);
                Module.xtract_array_min = {};
                Module.xtract_array_min.fp32 = Module.cwrap("xtract_array_min_fp32", "number", ["array", "number"]);
                Module.xtract_array_min.fp64 = Module.cwrap("xtract_array_min_fp64", "number", ["array", "number"]);
                Module.xtract_array_min.fp32_pinned = Module.cwrap("xtract_array_min_fp32", "number", ["number", "number"]);
                Module.xtract_array_min.fp64_pinned = Module.cwrap("xtract_array_min_fp64", "number", ["number", "number"]);
                Module.xtract_array_scale = {};
                Module.xtract_array_scale.fp32 = Module.cwrap("xtract_array_scale_fp32", "number", ["number", "number"]);
                Module.xtract_array_scale.fp64 = Module.cwrap("xtract_array_scale_fp64", "number", ["number", "number"]);
                Module.xtract_variance = {};
                Module.xtract_variance.fp32 = Module.cwrap("xtract_variance_fp32", "number", ["array", "number"]);
                Module.xtract_variance.fp64 = Module.cwrap("xtract_variance_fp64", "number", ["array", "number"]);
                Module.xtract_variance.fp32_pinned = Module.cwrap("xtract_variance_fp32", "number", ["number", "number"]);
                Module.xtract_variance.fp64_pinned = Module.cwrap("xtract_variance_fp64", "number", ["number", "number"]);
                Module.xtract_average_deviation = {};
                Module.xtract_average_deviation.fp32 = Module.cwrap("xtract_average_deviation_fp32", "number", ["array", "number"]);
                Module.xtract_average_deviation.fp64 = Module.cwrap("xtract_average_deviation_fp64", "number", ["array", "number"]);
                Module.xtract_average_deviation.fp32_pinned = Module.cwrap("xtract_average_deviation_fp32", "number", ["number", "number"]);
                Module.xtract_average_deviation.fp64_pinned = Module.cwrap("xtract_average_deviation_fp64", "number", ["number", "number"]);
                Module.xtract_spectral_centroid = {};
                Module.xtract_spectral_centroid.fp32 = Module.cwrap("xtract_spectral_centroid_fp32", "number", ["array", "number"]);
                Module.xtract_spectral_centroid.fp64 = Module.cwrap("xtract_spectral_centroid_fp64", "number", ["array", "number"]);
                Module.xtract_spectral_centroid.fp32_pinned = Module.cwrap("xtract_spectral_centroid_fp32", "number", ["number", "number"]);
                Module.xtract_spectral_centroid.fp64_pinned = Module.cwrap("xtract_spectral_centroid_fp64", "number", ["number", "number"]);
                Module.xtract_spectral_variance = {};
                Module.xtract_spectral_variance.fp32 = Module.cwrap("xtract_spectral_variance_fp32", "number", ["array", "number", "number"]);
                Module.xtract_spectral_variance.fp64 = Module.cwrap("xtract_spectral_variance_fp64", "number", ["array", "number", "number"]);
                Module.xtract_spectral_variance.fp32_pinned = Module.cwrap("xtract_spectral_variance_fp32", "number", ["number", "number", "number"]);
                Module.xtract_spectral_variance.fp64_pinned = Module.cwrap("xtract_spectral_variance_fp64", "number", ["number", "number", "number"]);
                Module.xtract_rms_amplitude = {};
                Module.xtract_rms_amplitude.fp32 = Module.cwrap("xtract_rms_amplitude_fp32", "number", ["array", "number"]);
                Module.xtract_rms_amplitude.fp64 = Module.cwrap("xtract_rms_amplitude_fp64", "number", ["array", "number"]);
                Module.xtract_rms_amplitude.fp32_pinned = Module.cwrap("xtract_rms_amplitude_fp32", "number", ["number", "number"]);
                Module.xtract_rms_amplitude.fp64_pinned = Module.cwrap("xtract_rms_amplitude_fp64", "number", ["number", "number"]);
                Module.xtract_autocorrelation = {};
                Module.xtract_autocorrelation.fp32 = Module.cwrap("xtract_autocorrelation_fp32", "number", ["number", "number", "number"]);
                Module.xtract_autocorrelation.fp64 = Module.cwrap("xtract_autocorrelation_fp64", "number", ["number", "number", "number"]);
            }];
            var sc = document.createElement("script");
            sc.setAttribute("src", urlroot+"jsXtract-wasm.js");
            document.querySelector("head").appendChild(sc);
        });
    }

    var memory = (function() {
        function malloc(size) {
            if (typeof size !== "number" || size <= 0 || size != Math.floor(size)) {
                throw("malloc size must be positive integer");
            }
            if (Module) {
                return Module._malloc(size);
            }
            return 0;
        }

        function createFP32Array(ptr, number) {
            var elem = ptr >> 2,
                array;
            if (Module && elem > 0) {
                array = Module.HEAPF32.subarray(elem,elem+number);
                allocations.push(new MemoryObject(array, ptr, number, Module.HEAPF32));
            } else {
                array = new Float32Array(number);
            }
            return array;
        }

        function createFP64Array(ptr, number) {
            var elem = ptr >> 4,
                array;
            if (Module && elem > 0) {
                array = Module.HEAPF64.subarray(elem,elem+number);
                allocations.push(new MemoryObject(array, ptr, number, Module.HEAPF64));
            } else {
                array = new Float64Array(number);
            }
            return array;
        }

        function isMemoryPinned(array) {
            var heap;
            if (Module === undefined) {
                return false;
            }
            if (array.constructor == Float32Array) {
                heap = Module.HEAPF32;
            } else if (array.constructor == Float64Array) {
                heap = Module.HEAPF64;
            } else {
                return false;
            }
            return heap.buffer == array.buffer;
        }

        function findPinnedObjectIndex(array) {
            var heap;
            if (array.constructor == Float32Array) {
                heap = Module.HEAPF32;
            } else if (array.constructor == Float64Array) {
                heap = Module.HEAPF64;
            } else {
                return false;
            }
            index = allocations.findIndex(function(entry) {
                return entry.array === array;
            });
            return index;
        }

        function getPinnedObject(array) {
            var i = findPinnedObjectIndex(array);
            if (i >= 0) {
                return allocations[i];
            }
            return false;
        }

        function free(array) {
            var heap, index, memblock;
            if (isMemoryPinned(array) === false) {
                return;
            }
            if (Module === undefined) {
                return;
            }
            index = findPinnedObjectIndex(array);
            if (index === -1) {
                throw("MEMLEAK: Cannot locate memblock to free, but it is pinned.")
            }
            memblock = allocations[index];
            Module._free(memblock.ptr);
            allocations.splice(index, 1);
        }

        var allocations = [];
        var MemoryObject = function(array, ptr, number, heap) {
            Object.defineProperties(this, {
                "array": {
                    "value": array
                },
                "length": {
                    "value": number
                },
                "stack": {
                    "value": heap
                },
                "ptr": {
                    "value": ptr
                }
            });
        }

        var memoryController = {};
        Object.defineProperties(memoryController, {
            "allocateFP32Array": {
                "value": function(numElements) {
                    var ptr;
                    if (typeof numElements != "number" || numElements <= 0 || numElements != Math.floor(numElements)) {
                        throw("Elemnt count must be positive integer");
                    }

                    ptr = malloc(numElements*4);
                    return createFP32Array(ptr, numElements);
                }
            },
            "allocateFP64Array": {
                "value": function(numElements) {
                    var ptr;
                    if (typeof numElements != "number" || numElements <= 0 || numElements != Math.floor(numElements)) {
                        throw("Elemnt count must be positive integer");
                    }

                    ptr = malloc(numElements*8);
                    return createFP64Array(ptr, numElements);
                }
            },
            "isPinned": {
                "value": function (array) {
                    return isMemoryPinned(array);
                }
            },
            "getPinnedAddress": {
                "value": function(array) {
                    var p;
                    if (isMemoryPinned(array) == false) {
                        return false;
                    }
                    p = getPinnedObject(array);
                    if (typeof p == "object") {
                        return p.ptr;
                    }
                    return false;
                }
            },
            "free": {
                "value": function (array) {
                    free(array);
                }
            },
            "copy": {
                "value": function (src, dst) {
                    var i;
                    for (i=0; i<src.length; i++)
                        dst[i] = src[i];
                    for (i=src.length; i<dst.length; i++)
                        dst[i] = 0.0;
                }
            }
        });
        return memoryController;
    })();

    var pub_obj = {};
    var functions ={};
    Object.defineProperties(pub_obj, {
        "wasm": {
            "get": function() {
                return Module;
            }
        },
        "functions": {
            get: function() {
                return functions;
            }
        },
        "memory": {
            "get": function() {
                return memory;
            }
        }
    });

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

    function xtract_array_scale(data, factor) {
        if (!xtract_assert_array(data))
            return 0;
        if (typeof factor !== "number") {
            return 0;
        }
        var i = 0,
            l = data.length,
            a = xtract_array_copy(data);
        for (i = 0; i < l; i++) {
            a[i] *= factor;
        }
        return a;
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

    function xtract_spectral_centroid(spectrum) {
        if (!xtract_assert_array(spectrum))
            return 0;
        var N = spectrum.length;
        var n = N >> 1;
        var amps = spectrum.subarray(0, n);
        var freqs = spectrum.subarray(n);
        var A_d = xtract_array_sum(amps);
        if (A_d === 0.0) {
            return 0.0;
        }
        var sum = 0.0;
        while (n--) {
            sum += freqs[n] * (amps[n] / A_d);
        }
        return sum;
    }

    function xtract_spectral_variance(spectrum, spectral_centroid) {
        if (!xtract_assert_array(spectrum))
            return 0;
        if (typeof spectral_centroid !== "number") {
            spectral_centroid = xtract_spectral_centroid(spectrum);
        }
        var A = 0,
            result = 0;
        var N = spectrum.length;
        var n = N >> 1;
        var amps = spectrum.subarray(0, n);
        var freqs = spectrum.subarray(n, N);
        var A_d = xtract_array_sum(amps);
        while (n--) {
            result += Math.pow(freqs[n] - spectral_centroid, 2) * (amps[n] / A_d);
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

    Object.defineProperties(functions, {
        "array_sum": {
            "value": function(data) {
                var N = data.length, ptr;
                if (!Module) {
                    return xtract_array_sum(data);
                }
                if (data.constructor == Float32Array) {
                    if (memory.isPinned(data)) {
                        ptr = memory.getPinnedAddress(data);
                        return Module.xtract_array_sum.fp32_pinned(ptr, N);
                    } else {
                        return Module.xtract_array_sum.fp32(new Uint8Array(data.buffer), N);
                    }
                }
                else if (data.constructor == Float64Array) {
                    if (memory.isPinned(data)) {
                        ptr = memory.getPinnedAddress(data);
                        return Module.xtract_array_sum.fp64_pinned(ptr, N);
                    } else {
                        return Module.xtract_array_sum.fp64(new Uint8Array(data.buffer), N);
                    }
                }
                else {
                    return xtract_array_sum(data);
                }
            }
        },
        "array_max": {
            "value": function (data) {
                var N = data.length, ptr;
                if (!Module) {
                    return xtract_array_max(data);
                }
                if (data.constructor == Float32Array) {
                    if (memory.isPinned(data)) {
                        ptr = memory.getPinnedAddress(data);
                        return Module.xtract_array_max.fp32_pinned(ptr, N);
                    } else {
                        return Module.xtract_array_max.fp32(new Uint8Array(data.buffer), N);
                    }
                }
                else if (data.constructor == Float64Array) {
                    if (memory.isPinned(data)) {
                        ptr = memory.getPinnedAddress(data);
                        return Module.xtract_array_max.fp64_pinned(ptr, N);
                    } else {
                        return Module.xtract_array_max.fp64(new Uint8Array(data.buffer), N);
                    }
                }
                else {
                    return xtract_array_max(data);
                }
            }
        },
        "array_min": {
            "value": function (data) {
                var N = data.length, ptr;
                if (!Module) {
                    return xtract_array_min(data);
                }
                if (data.constructor == Float32Array) {
                    if (memory.isPinned(data)) {
                        ptr = memory.getPinnedAddress(data);
                        return Module.xtract_array_min.fp32_pinned(ptr, N);
                    } else {
                        return Module.xtract_array_min.fp32(new Uint8Array(data.buffer), N);
                    }
                }
                else if (data.constructor == Float64Array) {
                    if (memory.isPinned(data)) {
                        ptr = memory.getPinnedAddress(data);
                        return Module.xtract_array_min.fp64_pinned(ptr, N);
                    } else {
                        return Module.xtract_array_min.fp64(new Uint8Array(data.buffer), N);
                    }
                }
                else {
                    return xtract_array_min(data);
                }
            }
        },
        "array_scale": {
            "value": function (data, factor) {
                var N = data.length, ptr;
                if (!Module) {
                    return xtract_array_scale(data, factor);
                }
                if (data.constructor == Float32Array) {
                    if (memory.isPinned(data)) {
                        ptr = memory.getPinnedAddress(data);
                        return Module.xtract_array_scale.fp32(ptr, factor, N);
                    } else {
                        var mem = memory.allocateFP32Array(data.length);
                        memory.copy(data,mem);
                        ptr = memory.getPinnedAddress(mem);
                        var result = Module.xtract_array_scale.fp32(ptr, factor, N);
                        memory.copy(mem,data);
                        memory.free(mem);
                        return result;
                    }
                }
                else if (data.constructor == Float64Array) {
                    if (memory.isPinned(data)) {
                        ptr = memory.getPinnedAddress(data);
                        return Module.xtract_array_scale.fp32(ptr, factor, N);
                    } else {
                        var mem = memory.allocateFP64Array(data.length);
                        memory.copy(data,mem);
                        ptr = memory.getPinnedAddress(mem);
                        var result = Module.xtract_array_scale.fp64(ptr, factor, N);
                        memory.copy(mem,data);
                        memory.free(mem);
                        return result;
                    }
                }
                else {
                    return xtract_array_scale(data, factor);
                }
            }
        },
        "variance": {
            "value": function(data, mean) {
                var N = data.length, ptr;
                if (!Module) {
                    return xtract_variance(data);
                }
                if (data.constructor == Float32Array) {
                    if (memory.isPinned(data)) {
                        ptr = memory.getPinnedAddress(data);
                        return Module.xtract_variance.fp32_pinned(ptr, N);
                    } else {
                        return Module.xtract_variance.fp32(new Uint8Array(data.buffer), N);
                    }
                }
                else if (data.constructor == Float64Array) {
                    if (memory.isPinned(data)) {
                        ptr = memory.getPinnedAddress(data);
                        return Module.xtract_variance.fp64_pinned(ptr, N);
                    } else {
                        return Module.xtract_variance.fp64(new Uint8Array(data.buffer), N);
                    }
                }
                else {
                    return xtract_variance(data);
                }
            }
        },
        "average_deviation": {
            "value": function(data, mean) {
                var N = data.length, ptr;
                if (!Module) {
                    return xtract_average_deviation(data);
                }
                if (data.constructor == Float32Array) {
                    if (memory.isPinned(data)) {
                        ptr = memory.getPinnedAddress(data);
                        return Module.xtract_average_deviation.fp32_pinned(ptr, N);
                    } else {
                        return Module.xtract_average_deviation.fp32(new Uint8Array(data.buffer), N);
                    }
                }
                else if (data.constructor == Float64Array) {
                    if (memory.isPinned(data)) {
                        ptr = memory.getPinnedAddress(data);
                        return Module.xtract_average_deviation.fp64_pinned(ptr, N);
                    } else {
                        return Module.xtract_average_deviation.fp64(new Uint8Array(data.buffer), N);
                    }
                }
                else {
                    return xtract_average_deviation(data);
                }
            }
        },
        "spectral_centroid": {
            "value": function (data) {
                var N = data.length, ptr;
                if (!Module) {
                    return xtract_spectral_centroid(data);
                }
                if (data.constructor == Float32Array) {
                    if (memory.isPinned(data)) {
                        ptr = memory.getPinnedAddress(data);
                        return Module.xtract_spectral_centroid.fp32_pinned(ptr, N);
                    } else {
                        return Module.xtract_spectral_centroid.fp32(new Uint8Array(data.buffer), N);
                    }
                } else if (data.constructor == Float64Array) {
                    if (memory.isPinned(data)) {
                        ptr = memory.getPinnedAddress(data);
                        return Module.xtract_spectral_centroid.fp64_pinned(ptr, N);
                    } else {
                        return Module.xtract_spectral_centroid.fp64(new Uint8Array(data.buffer), N);
                    }
                } else {
                    return xtract_spectral_centroid(data);
                }
            }
        },
        "spectral_variance": {
            "value": function (data, spectral_centroid) {
                var N = data.length, ptr;
                if (!Module) {
                    return xtract_spectral_variance(data, spectral_centroid);
                }
                if (data.constructor == Float32Array) {
                    if (memory.isPinned(data)) {
                        ptr = memory.getPinnedAddress(data);
                        return Module.xtract_spectral_variance.fp32_pinned(ptr, N);
                    } else {
                        return Module.xtract_spectral_variance.fp32(new Uint8Array(data.buffer), spectral_centroid, N);
                    }
                } else if (data.constructor == Float64Array) {
                    if (memory.isPinned(data)) {
                        ptr = memory.getPinnedAddress(data);
                        return Module.xtract_spectral_variance.fp64_pinned(ptr, N);
                    } else {
                        return Module.xtract_spectral_variance.fp64(new Uint8Array(data.buffer), spectral_centroid, N);
                    }
                } else {
                    return xtract_spectral_variance(data, spectral_centroid);
                }
            }
        },
        "rms_amplitude": {
            "value": function (data) {
                var N = data.length, ptr;
                if (!Module) {
                    return xtract_rms_amplitude(data);
                }
                if (data.constructor == Float32Array) {
                    if (memory.isPinned(data)) {
                        ptr = memory.getPinnedAddress(data);
                        return Module.xtract_rms_amplitude.fp32_pinned(ptr, N);
                    } else {
                        return Module.xtract_rms_amplitude.fp32(new Uint8Array(data.buffer), N);
                    }
                } else if (data.constructor == Float64Array) {
                    if (memory.isPinned(data)) {
                        ptr = memory.getPinnedAddress(data);
                        return Module.xtract_rms_amplitude.fp64_pinned(ptr, N);
                    } else {
                        return Module.xtract_rms_amplitude.fp64(new Uint8Array(data.buffer), N);
                    }
                } else {
                    return xtract_rms_amplitude(data);
                }
            }
        },
        "autocorrelation": {
            "value": function(data) {
                var N = data.length, ptr, copymem;
                if (!Module) {
                    return xtract_autocorrelation(data);
                }
                if (data.constructor == Float32Array) {
                    copymem = memory.allocateFP32Array(data.length);
                    if (memory.isPinned(data)) {
                        ptr = memory.getPinnedAddress(data);
                        Module.xtract_autocorrelation.fp32(ptr, memory.getPinnedAddress(copymem), N);
                        return copymem;
                    } else {
                        var mem = memory.allocateFP32Array(data.length);
                        memory.copy(data, mem);
                        ptr = memory.getPinnedAddress(mem);
                        Module.xtract_autocorrelation.fp32(ptr, memory.getPinnedAddress(copymem), N);
                        memory.free(mem);
                        return copymem;
                    }
                }
                else if (data.constructor == Float64Array) {
                    copymem = memory.allocateFP64Array(data.length);
                    if (memory.isPinned(data)) {
                        ptr = memory.getPinnedAddress(data);
                        Module.xtract_autocorrelation.fp64(ptr, memory.getPinnedAddress(copymem), N);
                        return copymem;
                    } else {
                        var mem = memory.allocateFP64Array(data.length);
                        memory.copy(data, mem);
                        ptr = memory.getPinnedAddress(mem);
                        Module.xtract_autocorrelation.fp64(ptr, memory.getPinnedAddress(copymem), N);
                        memory.free(mem);
                        return copymem;
                    }
                }
                else {
                    return xtract_autocorrelation(data);
                }
            }
        }
    })
    return pub_obj;
})(urlroot);
