(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["jsXtract"] = factory();
	else
		root["jsXtract"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./modules/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./modules/freeFFT.js":
/*!****************************!*\
  !*** ./modules/freeFFT.js ***!
  \****************************/
/*! exports provided: transform, inverseTransform, transformRadix2, transformBluestein, convolveComplex */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "transform", function() { return transform; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "inverseTransform", function() { return inverseTransform; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "transformRadix2", function() { return transformRadix2; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "transformBluestein", function() { return transformBluestein; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "convolveComplex", function() { return convolveComplex; });
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
    if (real.length !== imag.length)
        throw "Mismatched lengths";

    var n = real.length;
    if (n === 0)
        return;
    else if ((n & (n - 1)) === 0) // Is power of 2
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
    if (real.length !== imag.length)
        throw "Mismatched lengths";
    var n = real.length;
    if (n === 1) // Trivial transform
        return;
    var levels = calculateNumberLevels(n);
    if (levels === -1)
        throw "Length is not a power of 2";
    var cosTable = new Float64Array(n / 2);
    var sinTable = new Float64Array(n / 2);
    calculateCosSineTables(cosTable, sinTable);

    // Bit-reversed addressing permutation
    bitReverseMap(real, imag);

    // Cooley-Tukey decimation-in-time radix-2 FFT
    for (var size = 2; size <= n; size *= 2) {
        cooleyTukey(real, imag, sinTable, cosTable, size);
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

    function cooleyTukey(real, imag, sinTable, cosTable, size) {
        var i, j, k;
        var n = real.length;
        var halfsize = size / 2;
        var tablestep = n / size;
        for (i = 0; i < n; i += size) {
            for (j = i, k = 0; j < i + halfsize; j++, k += tablestep) {
                var tpre = real[j + halfsize] * cosTable[k] + imag[j + halfsize] * sinTable[k];
                var tpim = -real[j + halfsize] * sinTable[k] + imag[j + halfsize] * cosTable[k];
                real[j + halfsize] = real[j] - tpre;
                imag[j + halfsize] = imag[j] - tpim;
                real[j] += tpre;
                imag[j] += tpim;
            }
        }
    }

    function calculateNumberLevels(N) {
        var i;
        for (i = 0; i < 32; i++) {
            if (1 << i === N) {
                return i;
            }
        }
        return -1;
    }

    function bitReverseMap(real, imag) {
        var i, j, temp;
        for (i = 0; i < n; i++) {
            j = reverseBits(i, levels);
            if (j > i) {
                temp = real[i];
                real[i] = real[j];
                real[j] = temp;
                temp = imag[i];
                imag[i] = imag[j];
                imag[j] = temp;
            }
        }
    }

    function calculateCosSineTables(cosTable, sinTable) {
        var n = cosTable.length,
            i;
        for (i = 0; i < n; i++) {
            cosTable[i] = Math.cos(Math.PI * i / n);
            sinTable[i] = Math.sin(Math.PI * i / n);
        }
    }
}


/*
 * Computes the discrete Fourier transform (DFT) of the given complex vector, storing the result back into the vector.
 * The vector can have any length. This requires the convolution function, which in turn requires the radix-2 FFT function.
 * Uses Bluestein's chirp z-transform algorithm.
 */
function transformBluestein(real, imag) {
    // Find a power-of-2 convolution length m such that m >= n * 2 + 1
    if (real.length !== imag.length)
        throw "Mismatched lengths";
    var i, j;
    var n = real.length;
    var m = 1;
    while (m < n * 2 + 1)
        m *= 2;

    // Trignometric tables
    var cosTable = new Float64Array(n);
    var sinTable = new Float64Array(n);
    (function (cosTable, sinTable) {
        for (i = 0; i < n; i++) {
            j = i * i % (n * 2); // This is more accurate than j = i * i
            cosTable[i] = Math.cos(Math.PI * j / n);
            sinTable[i] = Math.sin(Math.PI * j / n);
        }
    })(cosTable, sinTable);

    // Temporary vectors and preprocessing
    var areal = new Float64Array(m);
    var aimag = new Float64Array(m);

    for (i = 0; i < n; i++) {
        areal[i] = real[i] * cosTable[i] + imag[i] * sinTable[i];
        aimag[i] = -real[i] * sinTable[i] + imag[i] * cosTable[i];
    }
    var breal = new Float64Array(m);
    var bimag = new Float64Array(m);
    breal[0] = cosTable[0];
    bimag[0] = sinTable[0];
    for (i = 1; i < n; i++) {
        breal[i] = breal[m - i] = cosTable[i];
        bimag[i] = bimag[m - i] = sinTable[i];
    }

    // Convolution
    var creal = new Float64Array(m);
    var cimag = new Float64Array(m);
    convolveComplex(areal, aimag, breal, bimag, creal, cimag);

    // Postprocessing
    for (i = 0; i < n; i++) {
        real[i] = creal[i] * cosTable[i] + cimag[i] * sinTable[i];
        imag[i] = -creal[i] * sinTable[i] + cimag[i] * cosTable[i];
    }
}


/*
 * Computes the circular convolution of the given real vectors. Each vector's length must be the same.
 */
function convolveReal(x, y, out) {
    if (x.length !== y.length || x.length !== out.length)
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
    (function () {
        if (xreal.length !== ximag.length || xreal.length !== yreal.length || yreal.length !== yimag.length || xreal.length !== outreal.length || outreal.length !== outimag.length)
            throw "Mismatched lengths";
    })();
    var i;
    var n = xreal.length;
    xreal = xreal.slice();
    ximag = ximag.slice();
    yreal = yreal.slice();
    yimag = yimag.slice();

    transform(xreal, ximag);
    transform(yreal, yimag);
    for (i = 0; i < n; i++) {
        var temp = xreal[i] * yreal[i] - ximag[i] * yimag[i];
        ximag[i] = ximag[i] * yreal[i] + xreal[i] * yimag[i];
        xreal[i] = temp;
    }
    inverseTransform(xreal, ximag);
    for (i = 0; i < n; i++) { // Scaling (because this FFT implementation omits it)
        outreal[i] = xreal[i] / n;
        outimag[i] = ximag[i] / n;
    }
}


/***/ }),

/***/ "./modules/functions/xtract_amdf.js":
/*!******************************************!*\
  !*** ./modules/functions/xtract_amdf.js ***!
  \******************************************/
/*! exports provided: xtract_amdf */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_amdf", function() { return xtract_amdf; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/// <reference path="../../typings/functions.d.ts" />


function xtract_amdf(array) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(array))
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


/***/ }),

/***/ "./modules/functions/xtract_apply_window.js":
/*!**************************************************!*\
  !*** ./modules/functions/xtract_apply_window.js ***!
  \**************************************************/
/*! exports provided: xtract_apply_window */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_apply_window", function() { return xtract_apply_window; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/// <reference path="../../typings/functions.d.ts" />

function xtract_apply_window(X, W) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(X) || !Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(W)) {
        throw ("Both X and W must be defined");
    }
    if (X.length !== W.length) {
        throw ("Both X and W must be the same lengths");
    }
    var N = X.length;
    var Y = new Float64Array(N);
    var n;
    for (n = 0; n < N; n++) {
        Y[n] = X[n] * W[n];
    }
    return Y;
}


/***/ }),

/***/ "./modules/functions/xtract_array_bound.js":
/*!*************************************************!*\
  !*** ./modules/functions/xtract_array_bound.js ***!
  \*************************************************/
/*! exports provided: xtract_array_bound */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_array_bound", function() { return xtract_array_bound; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/* harmony import */ var _xtract_array_min__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./xtract_array_min */ "./modules/functions/xtract_array_min.js");
/* harmony import */ var _xtract_array_max__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./xtract_array_max */ "./modules/functions/xtract_array_max.js");
/// <reference path="../../typings/functions.d.ts" />




function xtract_array_bound(data, min, max) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(data))
        return 0;
    if (typeof min !== "number") {
        min = Object(_xtract_array_min__WEBPACK_IMPORTED_MODULE_1__["xtract_array_min"])(data);
    }
    if (typeof max !== "number") {
        max = Object(_xtract_array_max__WEBPACK_IMPORTED_MODULE_2__["xtract_array_max"])(data);
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


/***/ }),

/***/ "./modules/functions/xtract_array_copy.js":
/*!************************************************!*\
  !*** ./modules/functions/xtract_array_copy.js ***!
  \************************************************/
/*! exports provided: xtract_array_copy */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_array_copy", function() { return xtract_array_copy; });
/// <reference path="../../typings/functions.d.ts" />
function xtract_array_copy(src) {
    var N = src.length,
        dst = new src.constructor(N);
    for (var n = 0; n < N; n++)
        dst[n] = src[n];
    return dst;
}


/***/ }),

/***/ "./modules/functions/xtract_array_deinterlace.js":
/*!*******************************************************!*\
  !*** ./modules/functions/xtract_array_deinterlace.js ***!
  \*******************************************************/
/*! exports provided: xtract_array_deinterlace */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_array_deinterlace", function() { return xtract_array_deinterlace; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/* harmony import */ var _xtract_assert_positive_integer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./xtract_assert_positive_integer */ "./modules/functions/xtract_assert_positive_integer.js");
/// <reference path="../../typings/functions.d.ts" />



function xtract_array_deinterlace(data, num_arrays) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(data)) {
        return [];
    }
    var result, N;
    if (!Object(_xtract_assert_positive_integer__WEBPACK_IMPORTED_MODULE_1__["xtract_assert_positive_integer"])(num_arrays)) {
        throw ("num_arrays must be a positive integer");
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


/***/ }),

/***/ "./modules/functions/xtract_array_interlace.js":
/*!*****************************************************!*\
  !*** ./modules/functions/xtract_array_interlace.js ***!
  \*****************************************************/
/*! exports provided: xtract_array_interlace */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_array_interlace", function() { return xtract_array_interlace; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/// <reference path="../../typings/functions.d.ts" />


function xtract_array_interlace(data) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(data)) {
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


/***/ }),

/***/ "./modules/functions/xtract_array_max.js":
/*!***********************************************!*\
  !*** ./modules/functions/xtract_array_max.js ***!
  \***********************************************/
/*! exports provided: xtract_array_max */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_array_max", function() { return xtract_array_max; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/// <reference path="../../typings/functions.d.ts" />

function xtract_array_max(data) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(data))
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


/***/ }),

/***/ "./modules/functions/xtract_array_min.js":
/*!***********************************************!*\
  !*** ./modules/functions/xtract_array_min.js ***!
  \***********************************************/
/*! exports provided: xtract_array_min */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_array_min", function() { return xtract_array_min; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/// <reference path="../../typings/functions.d.ts" />

function xtract_array_min(data) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(data))
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


/***/ }),

/***/ "./modules/functions/xtract_array_normalise.js":
/*!*****************************************************!*\
  !*** ./modules/functions/xtract_array_normalise.js ***!
  \*****************************************************/
/*! exports provided: xtract_array_normalise */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_array_normalise", function() { return xtract_array_normalise; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/* harmony import */ var _xtract_array_scale__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./xtract_array_scale */ "./modules/functions/xtract_array_scale.js");
/* harmony import */ var _xtract_array_max__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./xtract_array_max */ "./modules/functions/xtract_array_max.js");
/// <reference path="../../typings/functions.d.ts" />




function xtract_array_normalise(data) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(data))
        return 0;
    return Object(_xtract_array_scale__WEBPACK_IMPORTED_MODULE_1__["xtract_array_scale"])(data, 1.0 / Object(_xtract_array_max__WEBPACK_IMPORTED_MODULE_2__["xtract_array_max"])(data));
}


/***/ }),

/***/ "./modules/functions/xtract_array_scale.js":
/*!*************************************************!*\
  !*** ./modules/functions/xtract_array_scale.js ***!
  \*************************************************/
/*! exports provided: xtract_array_scale */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_array_scale", function() { return xtract_array_scale; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/* harmony import */ var _xtract_array_copy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./xtract_array_copy */ "./modules/functions/xtract_array_copy.js");
/// <reference path="../../typings/functions.d.ts" />


function xtract_array_scale(data, factor) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(data))
        return 0;
    if (typeof factor !== "number") {
        return 0;
    }
    var i = 0,
        l = data.length,
        a = Object(_xtract_array_copy__WEBPACK_IMPORTED_MODULE_1__["xtract_array_copy"])(data);
    for (i = 0; i < l; i++) {
        a[i] *= factor;
    }
    return a;
}


/***/ }),

/***/ "./modules/functions/xtract_array_sum.js":
/*!***********************************************!*\
  !*** ./modules/functions/xtract_array_sum.js ***!
  \***********************************************/
/*! exports provided: xtract_array_sum */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_array_sum", function() { return xtract_array_sum; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/// <reference path="../../typings/functions.d.ts" />

function xtract_array_sum(data) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(data))
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


/***/ }),

/***/ "./modules/functions/xtract_array_to_JSON.js":
/*!***************************************************!*\
  !*** ./modules/functions/xtract_array_to_JSON.js ***!
  \***************************************************/
/*! exports provided: xtract_array_to_JSON */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_array_to_JSON", function() { return xtract_array_to_JSON; });
/// <reference path="../../typings/functions.d.ts" />
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


/***/ }),

/***/ "./modules/functions/xtract_asdf.js":
/*!******************************************!*\
  !*** ./modules/functions/xtract_asdf.js ***!
  \******************************************/
/*! exports provided: xtract_asdf */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_asdf", function() { return xtract_asdf; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/// <reference path="../../typings/functions.d.ts" />

function xtract_asdf(array) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(array))
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


/***/ }),

/***/ "./modules/functions/xtract_assert_array.js":
/*!**************************************************!*\
  !*** ./modules/functions/xtract_assert_array.js ***!
  \**************************************************/
/*! exports provided: xtract_assert_array */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_assert_array", function() { return xtract_assert_array; });
/// <reference path="../../typings/functions.d.ts" />
function xtract_assert_array(array) {
    return (typeof array === "object" && array.length !== undefined && array.length > 0);
}


/***/ }),

/***/ "./modules/functions/xtract_assert_positive_integer.js":
/*!*************************************************************!*\
  !*** ./modules/functions/xtract_assert_positive_integer.js ***!
  \*************************************************************/
/*! exports provided: xtract_assert_positive_integer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_assert_positive_integer", function() { return xtract_assert_positive_integer; });
/// <reference path="../../typings/functions.d.ts" />
function xtract_assert_positive_integer(number) {
    return (typeof number === "number" && number >= 0 && number === Math.round(number));
}


/***/ }),

/***/ "./modules/functions/xtract_autocorrelation.js":
/*!*****************************************************!*\
  !*** ./modules/functions/xtract_autocorrelation.js ***!
  \*****************************************************/
/*! exports provided: xtract_autocorrelation */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_autocorrelation", function() { return xtract_autocorrelation; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/// <reference path="../../typings/functions.d.ts" />


function xtract_autocorrelation(array) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(array))
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


/***/ }),

/***/ "./modules/functions/xtract_average_deviation.js":
/*!*******************************************************!*\
  !*** ./modules/functions/xtract_average_deviation.js ***!
  \*******************************************************/
/*! exports provided: xtract_average_deviation */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_average_deviation", function() { return xtract_average_deviation; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/* harmony import */ var _xtract_mean__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./xtract_mean */ "./modules/functions/xtract_mean.js");
/// <reference path="../../typings/functions.d.ts" />


function xtract_average_deviation(array, mean) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(array))
        return 0;
    if (typeof mean !== "number") {
        mean = Object(_xtract_mean__WEBPACK_IMPORTED_MODULE_1__["xtract_mean"])(array);
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


/***/ }),

/***/ "./modules/functions/xtract_bark_coefficients.js":
/*!*******************************************************!*\
  !*** ./modules/functions/xtract_bark_coefficients.js ***!
  \*******************************************************/
/*! exports provided: xtract_bark_coefficients */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_bark_coefficients", function() { return xtract_bark_coefficients; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/// <reference path="../../typings/functions.d.ts" />

function xtract_bark_coefficients(spectrum, bark_limits) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(spectrum))
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


/***/ }),

/***/ "./modules/functions/xtract_chroma.js":
/*!********************************************!*\
  !*** ./modules/functions/xtract_chroma.js ***!
  \********************************************/
/*! exports provided: xtract_chroma */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_chroma", function() { return xtract_chroma; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/// <reference path="../../typings/functions.d.ts" />

function xtract_chroma(spectrum, chromaFilters) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(spectrum)) {
        return 0;
    }
    if (chromaFilters.wts === undefined) {
        throw ("xtract_chroma requires chroma filters from xtract_init_chroma");
    }
    if (chromaFilters.nfft !== spectrum.length / 2) {
        throw ("the FFT lengths of the spectrum (" + spectrum.length / 2 + ") and chroma filterbank (" + chromaFilters.nfft + ") do not match");
    }
    var result = new Float64Array(chromaFilters.nbins);
    for (var i = 0; i < chromaFilters.nbins; i++) {
        var sum = 0;
        for (var j = 0; j < chromaFilters.nfft; j++) {
            sum += chromaFilters.wts[i][j] * spectrum[j];
        }
        result[i] = sum;
    }
    return result;
}


/***/ }),

/***/ "./modules/functions/xtract_complex_spectrum.js":
/*!******************************************************!*\
  !*** ./modules/functions/xtract_complex_spectrum.js ***!
  \******************************************************/
/*! exports provided: xtract_complex_spectrum */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_complex_spectrum", function() { return xtract_complex_spectrum; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/* harmony import */ var _freeFFT__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../freeFFT */ "./modules/freeFFT.js");
/// <reference path="../../typings/functions.d.ts" />



function xtract_complex_spectrum(array, sample_rate, withDC) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(array))
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
    Object(_freeFFT__WEBPACK_IMPORTED_MODULE_1__["transform"])(reals, imags);
    for (var k = align; k <= reals.length / 2; k++) {
        amps[(k - align) * 2] = reals[k];
        amps[(k - align) * 2 + 1] = imags[k];
        freqs[k - align] = (2 * k / N) * (sample_rate / 2);
    }
    return result;
}


/***/ }),

/***/ "./modules/functions/xtract_create_window.js":
/*!***************************************************!*\
  !*** ./modules/functions/xtract_create_window.js ***!
  \***************************************************/
/*! exports provided: xtract_create_window */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_create_window", function() { return xtract_create_window; });
/* harmony import */ var _xtract_assert_positive_integer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_positive_integer */ "./modules/functions/xtract_assert_positive_integer.js");
/// <reference path="../../typings/functions.d.ts" />


function welch(N) {
    var W = new Float64Array(N);
    var n;
    var N12 = (N - 1) / 2;
    for (n = 0; n < N; n++) {
        W[n] = 1.0 - Math.pow((n - N12) / N12, 2);
    }
    return W;
}

function sine(N) {
    var w = new Float64Array(N),
        n;
    var arga = (Math.PI * n) / (N - 1);
    for (n = 0; n < N; n++) {
        w[n] = Math.sin(arga);
    }
    return w;
}

function hann(N) {
    var w = new Float64Array(N),
        n;
    for (n = 0; n < N; n++) {
        w[n] = 0.5 - (1 - Math.cos((Math.PI * 2 * n) / (N - 1)));
    }
    return w;
}

function hamming(N) {
    var w = new Float64Array(N),
        alpha = 25 / 46,
        beta = 21 / 46,
        n;
    for (n = 0; n < N; n++) {
        w[n] = alpha - beta * Math.cos((Math.PI * 2 * n) / (N - 1));
    }
    return w;
}

function xtract_create_window(N, type) {
    if (!Object(_xtract_assert_positive_integer__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_positive_integer"])(N)) {
        throw ("N must be a defined, positive integer");
    }
    if (typeof type !== "string" || type.length === 0) {
        throw ("Type must be defined");
    }
    type = type.toLowerCase();
    switch (type) {
        case "hamming":
            return hamming(N);
        case "welch":
            return welch(N);
        case "sine":
            return sine(N);
        case "hann":
            return hann(N);
        default:
            throw ("Window function\"" + type + "\" not defined");
    }
}


/***/ }),

/***/ "./modules/functions/xtract_crest.js":
/*!*******************************************!*\
  !*** ./modules/functions/xtract_crest.js ***!
  \*******************************************/
/*! exports provided: xtract_crest */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_crest", function() { return xtract_crest; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/* harmony import */ var _xtract_array_max__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./xtract_array_max */ "./modules/functions/xtract_array_max.js");
/* harmony import */ var _xtract_mean__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./xtract_mean */ "./modules/functions/xtract_mean.js");
/// <reference path="../../typings/functions.d.ts" />




function xtract_crest(data, max, mean) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(data))
        return 0;
    if (typeof max !== "number") {
        max = Object(_xtract_array_max__WEBPACK_IMPORTED_MODULE_1__["xtract_array_max"])(data);
    }
    if (typeof mean !== "number") {
        mean = Object(_xtract_mean__WEBPACK_IMPORTED_MODULE_2__["xtract_mean"])(data);
    }
    return max / mean;
}


/***/ }),

/***/ "./modules/functions/xtract_dct.js":
/*!*****************************************!*\
  !*** ./modules/functions/xtract_dct.js ***!
  \*****************************************/
/*! exports provided: xtract_dct */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_dct", function() { return xtract_dct; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/// <reference path="../../typings/functions.d.ts" />


function xtract_dct(array) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(array))
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


/***/ }),

/***/ "./modules/functions/xtract_dct_2.js":
/*!*******************************************!*\
  !*** ./modules/functions/xtract_dct_2.js ***!
  \*******************************************/
/*! exports provided: xtract_dct_2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_dct_2", function() { return xtract_dct_2; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/* harmony import */ var _xtract_init_dct__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./xtract_init_dct */ "./modules/functions/xtract_init_dct.js");
/* harmony import */ var _xtract_array_sum__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./xtract_array_sum */ "./modules/functions/xtract_array_sum.js");
/// <reference path="../../typings/functions.d.ts" />




function xtract_dct_2(array, dct) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(array))
        return 0;
    var N = array.length;
    if (dct === undefined) {
        dct = Object(_xtract_init_dct__WEBPACK_IMPORTED_MODULE_1__["xtract_init_dct"])(N);
    }
    var result = new Float64Array(N);
    result[0] = Object(_xtract_array_sum__WEBPACK_IMPORTED_MODULE_2__["xtract_array_sum"])(array);
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


/***/ }),

/***/ "./modules/functions/xtract_energy.js":
/*!********************************************!*\
  !*** ./modules/functions/xtract_energy.js ***!
  \********************************************/
/*! exports provided: xtract_energy */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_energy", function() { return xtract_energy; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/* harmony import */ var _xtract_rms_amplitude__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./xtract_rms_amplitude */ "./modules/functions/xtract_rms_amplitude.js");
/// <reference path="../../typings/functions.d.ts" />



function xtract_energy(array, sample_rate, window_ms) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(array))
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
        var rms = Object(_xtract_rms_amplitude__WEBPACK_IMPORTED_MODULE_1__["xtract_rms_amplitude"])(frame);
        result[k] = rms;
    }
    return result;
}


/***/ }),

/***/ "./modules/functions/xtract_f0.js":
/*!****************************************!*\
  !*** ./modules/functions/xtract_f0.js ***!
  \****************************************/
/*! exports provided: xtract_f0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_f0", function() { return xtract_f0; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/* harmony import */ var _xtract_array_copy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./xtract_array_copy */ "./modules/functions/xtract_array_copy.js");
/* harmony import */ var _xtract_array_max__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./xtract_array_max */ "./modules/functions/xtract_array_max.js");
/* harmony import */ var _xtract_array_bound__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./xtract_array_bound */ "./modules/functions/xtract_array_bound.js");
/// <reference path="../../typings/functions.d.ts" />





function calc_err_tau_x(sub_arr, M, tau) {
    var err_tau = 0.0,
        n;
    for (n = 1; n < M; n++) {
        err_tau += Math.abs(sub_arr[n] - sub_arr[n + tau]);
    }
    return err_tau;
}

function xtract_f0(timeArray, sampleRate) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(timeArray))
        return 0;
    if (typeof sampleRate !== "number") {
        sampleRate = 44100.0;
    }
    var sub_arr = Object(_xtract_array_copy__WEBPACK_IMPORTED_MODULE_1__["xtract_array_copy"])(timeArray);
    var N = sub_arr.length;
    var M = N / 2;
    var n;

    var threshold_peak = 0.8,
        threshold_centre = 0.3,
        array_max = 0;

    array_max = Object(_xtract_array_max__WEBPACK_IMPORTED_MODULE_2__["xtract_array_max"])(sub_arr);
    threshold_peak *= array_max;
    threshold_centre *= array_max;

    sub_arr = Object(_xtract_array_bound__WEBPACK_IMPORTED_MODULE_3__["xtract_array_bound"])(sub_arr, -threshold_peak, threshold_peak);

    sub_arr.forEach(function (v, i, a) {
        a[i] = Math.max(0, v - threshold_centre);
    });

    var err_tau_1 = calc_err_tau_x(sub_arr, M, 1);
    for (var tau = 2; tau < M; tau++) {
        var err_tau_x = calc_err_tau_x(sub_arr, M, tau);
        if (err_tau_x < err_tau_1) {
            return sampleRate / (tau + (err_tau_x / err_tau_1));
        }
    }
    return -0;
}


/***/ }),

/***/ "./modules/functions/xtract_failsafe_f0.js":
/*!*************************************************!*\
  !*** ./modules/functions/xtract_failsafe_f0.js ***!
  \*************************************************/
/*! exports provided: xtract_failsafe_f0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_failsafe_f0", function() { return xtract_failsafe_f0; });
/* harmony import */ var _xtract_f0__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_f0 */ "./modules/functions/xtract_f0.js");
/// <reference path="../../typings/functions.d.ts" />


function xtract_failsafe_f0(timeArray, sampleRate) {
    return Object(_xtract_f0__WEBPACK_IMPORTED_MODULE_0__["xtract_f0"])(timeArray, sampleRate);
}


/***/ }),

/***/ "./modules/functions/xtract_flatness.js":
/*!**********************************************!*\
  !*** ./modules/functions/xtract_flatness.js ***!
  \**********************************************/
/*! exports provided: xtract_flatness */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_flatness", function() { return xtract_flatness; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/// <reference path="../../typings/functions.d.ts" />


function xtract_flatness(spectrum) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(spectrum))
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
        temp = Math.max(1e-32, amps[n]);
        num *= temp;
        den += temp;
        count++;
    }
    if (count === 0) {
        return 0;
    }
    num = Math.pow(num, 1.0 / count);
    den /= count;

    return num / den;
}


/***/ }),

/***/ "./modules/functions/xtract_flatness_db.js":
/*!*************************************************!*\
  !*** ./modules/functions/xtract_flatness_db.js ***!
  \*************************************************/
/*! exports provided: xtract_flatness_db */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_flatness_db", function() { return xtract_flatness_db; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/* harmony import */ var _xtract_flatness__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./xtract_flatness */ "./modules/functions/xtract_flatness.js");
/// <reference path="../../typings/functions.d.ts" />



function xtract_flatness_db(spectrum, flatness) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(spectrum))
        return 0;
    if (typeof flatness !== "number") {
        flatness = Object(_xtract_flatness__WEBPACK_IMPORTED_MODULE_1__["xtract_flatness"])(spectrum);
    }
    return 10.0 * Math.log10(flatness);
}


/***/ }),

/***/ "./modules/functions/xtract_frame_from_array.js":
/*!******************************************************!*\
  !*** ./modules/functions/xtract_frame_from_array.js ***!
  \******************************************************/
/*! exports provided: xtract_frame_from_array */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_frame_from_array", function() { return xtract_frame_from_array; });
/* harmony import */ var _xtract_assert_positive_integer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_positive_integer */ "./modules/functions/xtract_assert_positive_integer.js");
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/* harmony import */ var _xtract_get_number_of_frames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./xtract_get_number_of_frames */ "./modules/functions/xtract_get_number_of_frames.js");
/// <reference path="../../typings/functions.d.ts" />




function xtract_frame_from_array(src, dst, index, frame_size, hop_size) {
    if (hop_size === undefined) {
        hop_size = frame_size;
    }
    if (!Object(_xtract_assert_positive_integer__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_positive_integer"])(index)) {
        throw ("xtract_get_frame requires the index to be an integer value");
    }
    if (!Object(_xtract_assert_positive_integer__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_positive_integer"])(frame_size)) {
        throw ("xtract_get_frame requires the frame_size to be a positive integer");
    }
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_1__["xtract_assert_array"])(src)) {
        throw ("Invalid data parameter. Must be item with iterable list");
    }
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_1__["xtract_assert_array"])(dst)) {
        throw ("dst must be an Array-like object equal in length to frame_size");
    }
    if (!Object(_xtract_assert_positive_integer__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_positive_integer"])(hop_size)) {
        throw ("xtract_get_frame requires the hop_size to be a positive integer");
    }
    var K = Object(_xtract_get_number_of_frames__WEBPACK_IMPORTED_MODULE_2__["xtract_get_number_of_frames"])(src, hop_size);
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


/***/ }),

/***/ "./modules/functions/xtract_get_data_frames.js":
/*!*****************************************************!*\
  !*** ./modules/functions/xtract_get_data_frames.js ***!
  \*****************************************************/
/*! exports provided: xtract_get_data_frames */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_get_data_frames", function() { return xtract_get_data_frames; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/* harmony import */ var _xtract_assert_positive_integer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./xtract_assert_positive_integer */ "./modules/functions/xtract_assert_positive_integer.js");
/// <reference path="../../typings/functions.d.ts" />



function xtract_get_data_frames(data, frame_size, hop_size, copy) {
    if (hop_size === undefined) {
        hop_size = frame_size;
    }
    (function (data, frame_size, hop_size) {
        if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(data)) {
            throw ("Invalid data parameter. Must be item with iterable list");
        }
        if (!Object(_xtract_assert_positive_integer__WEBPACK_IMPORTED_MODULE_1__["xtract_assert_positive_integer"])(frame_size)) {
            throw ("xtract_get_data_frames requires the frame_size to be a positive integer");
        }
        if (!Object(_xtract_assert_positive_integer__WEBPACK_IMPORTED_MODULE_1__["xtract_assert_positive_integer"])(hop_size)) {
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


/***/ }),

/***/ "./modules/functions/xtract_get_number_of_frames.js":
/*!**********************************************************!*\
  !*** ./modules/functions/xtract_get_number_of_frames.js ***!
  \**********************************************************/
/*! exports provided: xtract_get_number_of_frames */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_get_number_of_frames", function() { return xtract_get_number_of_frames; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/// <reference path="../../typings/functions.d.ts" />

function xtract_get_number_of_frames(data, hop_size) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(data)) {
        throw ("Invalid data parameter. Must be item with iterable list");
    }
    if (typeof hop_size !== "number" && hop_size <= 0) {
        throw ("Invalid hop_size. Must be positive integer");
    }
    return Math.floor(data.length / hop_size);
}


/***/ }),

/***/ "./modules/functions/xtract_harmonic_spectrum.js":
/*!*******************************************************!*\
  !*** ./modules/functions/xtract_harmonic_spectrum.js ***!
  \*******************************************************/
/*! exports provided: xtract_harmonic_spectrum */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_harmonic_spectrum", function() { return xtract_harmonic_spectrum; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/// <reference path="../../typings/functions.d.ts" />


function xtract_harmonic_spectrum(peakSpectrum, f0, threshold) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(peakSpectrum))
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


/***/ }),

/***/ "./modules/functions/xtract_highest_value.js":
/*!***************************************************!*\
  !*** ./modules/functions/xtract_highest_value.js ***!
  \***************************************************/
/*! exports provided: xtract_highest_value */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_highest_value", function() { return xtract_highest_value; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/* harmony import */ var _xtract_lowhigh__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./xtract_lowhigh */ "./modules/functions/xtract_lowhigh.js");
/// <reference path="../../typings/functions.d.ts" />



function xtract_highest_value(data, threshold) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(data))
        return 0;
    if (typeof threshold !== "number") {
        threshold = +Infinity;
    }
    return Object(_xtract_lowhigh__WEBPACK_IMPORTED_MODULE_1__["xtract_lowhigh"])(data, threshold).max;
}


/***/ }),

/***/ "./modules/functions/xtract_hps.js":
/*!*****************************************!*\
  !*** ./modules/functions/xtract_hps.js ***!
  \*****************************************/
/*! exports provided: xtract_hps */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_hps", function() { return xtract_hps; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/// <reference path="../../typings/functions.d.ts" />


function get_peak_index(M, amps) {
    var peak_index = 0,
        peak = 0,
        i;
    var tempProduct = new Float64Array(M);
    tempProduct.forEach(function (e, i, a) {
        a[i] = amps[i] * amps[i * 2] * amps[i * 3];
    });
    tempProduct.forEach(function (v, i) {
        if (v > peak) {
            peak = v;
            peak_index = i;
        }
    });
    return peak_index;
}

function xtract_hps(spectrum) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(spectrum))
        return 0;
    var peak_index = 0,
        position1_lwr = 0,
        largest1_lwr = 0,
        ratio1 = 0;
    var N = spectrum.length;
    var K = N >> 1;
    var amps = spectrum.subarray(0, K);
    var freqs = spectrum.subarray(K);
    var M = Math.ceil(K / 3.0);
    var i;
    if (M <= 1) {
        throw ("Input Data is too short for HPS");
    }

    peak_index = get_peak_index(M, amps);

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


/***/ }),

/***/ "./modules/functions/xtract_init_bark.js":
/*!***********************************************!*\
  !*** ./modules/functions/xtract_init_bark.js ***!
  \***********************************************/
/*! exports provided: xtract_init_bark */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_init_bark", function() { return xtract_init_bark; });
/// <reference path="../../typings/functions.d.ts" />
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


/***/ }),

/***/ "./modules/functions/xtract_init_chroma.js":
/*!*************************************************!*\
  !*** ./modules/functions/xtract_init_chroma.js ***!
  \*************************************************/
/*! exports provided: xtract_init_chroma */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_init_chroma", function() { return xtract_init_chroma; });
/* harmony import */ var _xtract_array_sum__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_array_sum */ "./modules/functions/xtract_array_sum.js");
/// <reference path="../../typings/functions.d.ts" />

function xtract_init_chroma(N, sampleRate, nbins, A440, f_ctr, octwidth) {
    /*run arg checks here... (if(nbins=='undefined')*/

    if (typeof nbins !== "number" || nbins <= 1) {
        nbins = 12;
    }
    if (typeof A440 !== "number" || A440 <= 27.5) {
        A440 = 440;
    }
    if (typeof f_ctr !== "number") {
        f_ctr = 1000;
    }
    if (typeof octwidth !== "number") {
        octwidth = 1;
    }
    var A0 = 27.5; // A0 in Hz
    var N2 = N; // ignore freq values returned by xtract_spectrum - this relies on dc-offset being kept
    var ctroct = Math.log(f_ctr / A0) / Math.LN2; // f_ctr in octaves
    var chromaFilters = {
        wts: [],
        nfft: N2,
        nbins: nbins,
    };
    var fftfrqbins = new Float64Array(N2);
    var binwidthbins = new Float64Array(N2);
    // Convert a frequency in Hz into a real number counting the octaves above A0. So hz2octs(440) = 4.0
    var hz2octs = function (freq) {
        return Math.log(freq / (A440 / 16)) / Math.LN2;
    };
    var i, j;
    for (i = 1; i < N2; i++) {
        fftfrqbins[i] = nbins * hz2octs(i / N * sampleRate);
    }
    fftfrqbins[0] = fftfrqbins[1] - 1.5 * nbins; //DC offset bin
    for (i = 0; i < N2 - 1; i++) {
        var diffVal = fftfrqbins[i + 1] - fftfrqbins[i];
        if (diffVal >= 1) {
            binwidthbins[i] = diffVal;
        } else {
            binwidthbins[i] = 1;
        }
    }
    binwidthbins[N2 - 1] = 1;
    var nbins2 = Math.round(nbins / 2.0);
    var wts = [];
    for (i = 0; i < nbins; i++) {
        wts[i] = [];
        for (j = 0; j < N2; j++) {
            var tmpF = fftfrqbins[j] - i;
            var tmpB = binwidthbins[j];
            var remF = ((tmpF + nbins2 + 10 * nbins) % nbins) - nbins2;
            wts[i][j] = Math.exp(-0.5 * Math.pow((2 * remF / tmpB), 2));
        }
    }

    function head(a) {
        return a[0];
    }

    function tail(a) {
        return a.slice(1);
    }

    function transpose(a) {
        if (a === undefined) {
            return [];
        }
        var x = a.length,
            y = a[0].length,
            mtx = [],
            i, j;
        for (i = 0; i < y; i++) {
            mtx[i] = new Float64Array(x);
        }
        for (i = 0; i < x; i++) {
            for (j = 0; j < y; j++) {
                mtx[j][i] = a[i][j];
            }
        }
        return mtx;
    }
    var wtsColumnSums = transpose(wts).map(_xtract_array_sum__WEBPACK_IMPORTED_MODULE_0__["xtract_array_sum"]);
    for (i = 0; i < nbins; i++) {
        for (j = 0; j < N2; j++) {
            wts[i][j] *= 1 / wtsColumnSums[j];
        }
    }
    if (octwidth > 0) {
        for (i = 0; i < nbins; i++) {
            for (j = 0; j < N2; j++) {
                wts[i][j] *= Math.exp(-0.5 * (Math.pow(((fftfrqbins[j] / nbins - ctroct) / octwidth), 2)));
            }
        }
    }
    chromaFilters.wts = wts;
    return chromaFilters;
}


/***/ }),

/***/ "./modules/functions/xtract_init_dct.js":
/*!**********************************************!*\
  !*** ./modules/functions/xtract_init_dct.js ***!
  \**********************************************/
/*! exports provided: xtract_init_dct */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_init_dct", function() { return xtract_init_dct; });
/// <reference path="../../typings/functions.d.ts" />
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


/***/ }),

/***/ "./modules/functions/xtract_init_dft.js":
/*!**********************************************!*\
  !*** ./modules/functions/xtract_init_dft.js ***!
  \**********************************************/
/*! exports provided: xtract_init_dft */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_init_dft", function() { return xtract_init_dft; });
/// <reference path="../../typings/functions.d.ts" />
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


/***/ }),

/***/ "./modules/functions/xtract_init_mfcc.js":
/*!***********************************************!*\
  !*** ./modules/functions/xtract_init_mfcc.js ***!
  \***********************************************/
/*! exports provided: xtract_init_mfcc */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_init_mfcc", function() { return xtract_init_mfcc; });
/// <reference path="../../typings/functions.d.ts" />

function get_fft_peak(N, freq_max, freq_min, freq_bands, nyquist, style) {
    var norm = 1,
        M = N / 2,
        height, norm_fact, n;
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
    return {
        f: fft_peak,
        h: height_norm
    };
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

    var i = 0,
        fh = get_fft_peak(N, freq_max, freq_min, freq_bands, nyquist, style),
        inc;
    var fft_peak = fh.f,
        height_norm = fh.h;
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


/***/ }),

/***/ "./modules/functions/xtract_init_pcp.js":
/*!**********************************************!*\
  !*** ./modules/functions/xtract_init_pcp.js ***!
  \**********************************************/
/*! exports provided: xtract_init_pcp */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_init_pcp", function() { return xtract_init_pcp; });
/// <reference path="../../typings/functions.d.ts" />
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


/***/ }),

/***/ "./modules/functions/xtract_init_wavelet.js":
/*!**************************************************!*\
  !*** ./modules/functions/xtract_init_wavelet.js ***!
  \**************************************************/
/*! exports provided: xtract_init_wavelet */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_init_wavelet", function() { return xtract_init_wavelet; });
/// <reference path="../../typings/functions.d.ts" />
function xtract_init_wavelet() {
    return {
        _prevPitch: -1,
        _pitchConfidence: -1
    };
}


/***/ }),

/***/ "./modules/functions/xtract_irregularity_j.js":
/*!****************************************************!*\
  !*** ./modules/functions/xtract_irregularity_j.js ***!
  \****************************************************/
/*! exports provided: xtract_irregularity_j */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_irregularity_j", function() { return xtract_irregularity_j; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/// <reference path="../../typings/functions.d.ts" />

function xtract_irregularity_j(spectrum) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(spectrum))
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


/***/ }),

/***/ "./modules/functions/xtract_irregularity_k.js":
/*!****************************************************!*\
  !*** ./modules/functions/xtract_irregularity_k.js ***!
  \****************************************************/
/*! exports provided: xtract_irregularity_k */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_irregularity_k", function() { return xtract_irregularity_k; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/// <reference path="../../typings/functions.d.ts" />


function xtract_irregularity_k(spectrum) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(spectrum))
        return 0;
    var result = 0;
    var N = spectrum.length;
    var K = N >> 1;
    var amps = spectrum.subarray(0, K);
    for (var n = 1; n < K - 1; n++) {
        result += Math.abs(Math.log10(amps[n]) - Math.log10(amps[n - 1] + amps[n] + amps[n + 1]) / 3);
    }
    return result;
}


/***/ }),

/***/ "./modules/functions/xtract_is_denormal.js":
/*!*************************************************!*\
  !*** ./modules/functions/xtract_is_denormal.js ***!
  \*************************************************/
/*! exports provided: xtract_is_denormal */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_is_denormal", function() { return xtract_is_denormal; });
/// <reference path="../../typings/functions.d.ts" />
function xtract_is_denormal(num) {
    if (Math.abs(num) <= 2.2250738585072014e-308) {
        return true;
    }
    return false;
}


/***/ }),

/***/ "./modules/functions/xtract_kurtosis.js":
/*!**********************************************!*\
  !*** ./modules/functions/xtract_kurtosis.js ***!
  \**********************************************/
/*! exports provided: xtract_kurtosis */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_kurtosis", function() { return xtract_kurtosis; });
/* harmony import */ var _xtract_skewness_kurtosis__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_skewness_kurtosis */ "./modules/functions/xtract_skewness_kurtosis.js");
/// <reference path="../../typings/functions.d.ts" />


function xtract_kurtosis(array, mean, standard_deviation) {
    return Object(_xtract_skewness_kurtosis__WEBPACK_IMPORTED_MODULE_0__["xtract_skewness_kurtosis"])(array, mean, standard_deviation)[1];
}


/***/ }),

/***/ "./modules/functions/xtract_loudness.js":
/*!**********************************************!*\
  !*** ./modules/functions/xtract_loudness.js ***!
  \**********************************************/
/*! exports provided: xtract_loudness */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_loudness", function() { return xtract_loudness; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/// <reference path="../../typings/functions.d.ts" />

function xtract_loudness(barkBandsArray) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(barkBandsArray))
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


/***/ }),

/***/ "./modules/functions/xtract_lowest_value.js":
/*!**************************************************!*\
  !*** ./modules/functions/xtract_lowest_value.js ***!
  \**************************************************/
/*! exports provided: xtract_lowest_value */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_lowest_value", function() { return xtract_lowest_value; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/* harmony import */ var _xtract_lowhigh__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./xtract_lowhigh */ "./modules/functions/xtract_lowhigh.js");
/// <reference path="../../typings/functions.d.ts" />



function xtract_lowest_value(data, threshold) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(data))
        return 0;
    if (typeof threshold !== "number") {
        threshold = -Infinity;
    }
    return Object(_xtract_lowhigh__WEBPACK_IMPORTED_MODULE_1__["xtract_lowhigh"])(data, threshold).min;
}


/***/ }),

/***/ "./modules/functions/xtract_lowhigh.js":
/*!*********************************************!*\
  !*** ./modules/functions/xtract_lowhigh.js ***!
  \*********************************************/
/*! exports provided: xtract_lowhigh */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_lowhigh", function() { return xtract_lowhigh; });
/// <reference path="../../typings/functions.d.ts" />
function xtract_lowhigh(data, threshold) {
    var r = {
        min: null,
        max: null
    };
    for (var n = 0; n < data.length; n++) {
        if (data[n] > threshold) {
            r.min = Math.min(r.min, data[n]);
        }
        if (data[n] < threshold) {
            r.max = Math.max(r.max, data[n]);
        }
    }
    return r;
}


/***/ }),

/***/ "./modules/functions/xtract_lpc.js":
/*!*****************************************!*\
  !*** ./modules/functions/xtract_lpc.js ***!
  \*****************************************/
/*! exports provided: xtract_lpc */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_lpc", function() { return xtract_lpc; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/// <reference path="../../typings/functions.d.ts" />


function xtract_lpc(autocorr) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(autocorr))
        return 0;
    var i, j, r, error = autocorr[0];
    var N = autocorr.length;
    var L = N - 1;
    var lpc = new Float64Array(L);
    var ref = new Float64Array(L);
    if (error === 0.0) {
        return lpc;
    }

    (function () {
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
    })();
    return lpc;
}


/***/ }),

/***/ "./modules/functions/xtract_lpcc.js":
/*!******************************************!*\
  !*** ./modules/functions/xtract_lpcc.js ***!
  \******************************************/
/*! exports provided: xtract_lpcc */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_lpcc", function() { return xtract_lpcc; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/// <reference path="../../typings/functions.d.ts" />


function xtract_lpcc(lpc, Q) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(lpc))
        return 0;
    var N = lpc.length;
    var n, k, sum, order = N - 1,
        cep_length;
    if (typeof Q !== "number") {
        Q = N - 1;
    }
    cep_length = Q;

    var result = new Float64Array(cep_length);
    (function () {
        for (n = 1; n < Q && n < cep_length; n++) {
            sum = 0;
            for (k = 1; k < n; k++) {
                sum += k * result[k - 1] * lpc[n - k];
            }
            result[n - 1] = lpc[n] + sum / n;
        }
    })();
    (function () {
        for (n = order + 1; n <= cep_length; n++) {
            sum = 0.0;
            for (k = n - (order - 1); k < n; k++) {
                sum += k * result[k - 1] * lpc[n - k];
            }
            result[n - 1] = sum / n;
        }
    })();
    return result;
}


/***/ }),

/***/ "./modules/functions/xtract_mean.js":
/*!******************************************!*\
  !*** ./modules/functions/xtract_mean.js ***!
  \******************************************/
/*! exports provided: xtract_mean */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_mean", function() { return xtract_mean; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/* harmony import */ var _xtract_array_sum__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./xtract_array_sum */ "./modules/functions/xtract_array_sum.js");
/// <reference path="../../typings/functions.d.ts" />


function xtract_mean(array) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(array))
        return 0;
    return Object(_xtract_array_sum__WEBPACK_IMPORTED_MODULE_1__["xtract_array_sum"])(array) / array.length;
}


/***/ }),

/***/ "./modules/functions/xtract_mfcc.js":
/*!******************************************!*\
  !*** ./modules/functions/xtract_mfcc.js ***!
  \******************************************/
/*! exports provided: xtract_mfcc */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_mfcc", function() { return xtract_mfcc; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/* harmony import */ var _xtract_dct__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./xtract_dct */ "./modules/functions/xtract_dct.js");
/// <reference path="../../typings/functions.d.ts" />


function xtract_mfcc(spectrum, mfcc) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(spectrum))
        return 0;
    var K = spectrum.length >> 1;
    if (typeof mfcc !== "object") {
        throw ("Invalid MFCC, must be MFCC object built using xtract_init_mfcc");
    }
    if (mfcc.n_filters === 0) {
        throw ("Invalid MFCC, object must be built using xtract_init_mfcc");
    }
    if (mfcc.filters[0].length !== K) {
        throw ("Lengths do not match");
    }
    var result = new Float64Array(mfcc.n_filters);
    result.forEach(function (v, f, r) {
        r[f] = 0.0;
        var filter = mfcc.filters[f];
        for (var n = 0; n < filter.length; n++) {
            r[f] += spectrum[n] * filter[n];
        }
        r[f] = Math.log(Math.max(r[f], 2e-42));
    });
    return Object(_xtract_dct__WEBPACK_IMPORTED_MODULE_1__["xtract_dct"])(result);
}


/***/ }),

/***/ "./modules/functions/xtract_midicent.js":
/*!**********************************************!*\
  !*** ./modules/functions/xtract_midicent.js ***!
  \**********************************************/
/*! exports provided: xtract_midicent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_midicent", function() { return xtract_midicent; });
/// <reference path="../../typings/functions.d.ts" />
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


/***/ }),

/***/ "./modules/functions/xtract_noisiness.js":
/*!***********************************************!*\
  !*** ./modules/functions/xtract_noisiness.js ***!
  \***********************************************/
/*! exports provided: xtract_noisiness */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_noisiness", function() { return xtract_noisiness; });
/// <reference path="../../typings/functions.d.ts" />
function xtract_noisiness(h, p) {
    var i = 0.0;
    if (typeof h !== "number" && typeof p !== "number") {
        return 0;
    }
    i = p - h;
    return i / p;
}


/***/ }),

/***/ "./modules/functions/xtract_nonzero_count.js":
/*!***************************************************!*\
  !*** ./modules/functions/xtract_nonzero_count.js ***!
  \***************************************************/
/*! exports provided: xtract_nonzero_count */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_nonzero_count", function() { return xtract_nonzero_count; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/// <reference path="../../typings/functions.d.ts" />

function xtract_nonzero_count(data) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(data))
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


/***/ }),

/***/ "./modules/functions/xtract_odd_even_ratio.js":
/*!****************************************************!*\
  !*** ./modules/functions/xtract_odd_even_ratio.js ***!
  \****************************************************/
/*! exports provided: xtract_odd_even_ratio */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_odd_even_ratio", function() { return xtract_odd_even_ratio; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/// <reference path="../../typings/functions.d.ts" />


function xtract_odd_even_ratio(harmonicSpectrum, f0) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(harmonicSpectrum))
        return 0;
    (function (f0) {
        if (typeof f0 !== "number") {
            throw ("spectral_inharmonicity requires f0 to be defined.");
        }
    })(f0);
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
    }
    return odd / even;
}


/***/ }),

/***/ "./modules/functions/xtract_onset.js":
/*!*******************************************!*\
  !*** ./modules/functions/xtract_onset.js ***!
  \*******************************************/
/*! exports provided: xtract_onset */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_onset", function() { return xtract_onset; });
/* harmony import */ var _freeFFT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../freeFFT */ "./modules/freeFFT.js");
/* harmony import */ var _xtract_array_interlace__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./xtract_array_interlace */ "./modules/functions/xtract_array_interlace.js");
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/* harmony import */ var _xtract_get_data_frames__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./xtract_get_data_frames */ "./modules/functions/xtract_get_data_frames.js");
/// <reference path="../../typings/functions.d.ts" />





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

function get_X(frames, frameSize) {
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
        Object(_freeFFT__WEBPACK_IMPORTED_MODULE_0__["transform"])(real, imag);
        X[i] = Object(_xtract_array_interlace__WEBPACK_IMPORTED_MODULE_1__["xtract_array_interlace"])([real.subarray(0, K), imag.subarray(0, K)]);
    }
    return X;
}

function xtract_onset(timeData, frameSize) {

    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_2__["xtract_assert_array"])(timeData))
        return 0;
    if (frameSize === undefined) {
        throw ("All arguments for xtract_onset must be defined: xtract_onset(timeData, frameSize)");
    }
    var frames = Object(_xtract_get_data_frames__WEBPACK_IMPORTED_MODULE_3__["xtract_get_data_frames"])(timeData, frameSize, frameSize, false);
    var N = frames.length;
    var K = frameSize / 2 + 1;
    var X = get_X(frames, frameSize);

    var E = new timeData.constructor(N);
    var n;
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


/***/ }),

/***/ "./modules/functions/xtract_pcp.js":
/*!*****************************************!*\
  !*** ./modules/functions/xtract_pcp.js ***!
  \*****************************************/
/*! exports provided: xtract_pcp */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_pcp", function() { return xtract_pcp; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/* harmony import */ var _xtract_init_pcp__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./xtract_init_pcp */ "./modules/functions/xtract_init_pcp.js");
/// <reference path="../../typings/functions.d.ts" />


function xtract_pcp(spectrum, M, fs) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(spectrum))
        return 0;
    var N = spectrum.length >> 1;
    if (typeof M !== "object") {
        if (typeof fs !== "number" || fs <= 0.0) {
            throw ("Cannot dynamically compute M if fs is undefined / not a valid sample rate");
        }
        M = Object(_xtract_init_pcp__WEBPACK_IMPORTED_MODULE_1__["xtract_init_pcp"])(N, fs);
    }
    var amps = spectrum.subarray(1, N);
    var PCP = new Float64Array(12);
    for (var l = 0; l < amps.length; l++) {
        var p = M[l];
        PCP[l] += Math.pow(Math.abs(amps[l]), 2);
    }
    return PCP;
}


/***/ }),

/***/ "./modules/functions/xtract_peak_spectrum.js":
/*!***************************************************!*\
  !*** ./modules/functions/xtract_peak_spectrum.js ***!
  \***************************************************/
/*! exports provided: xtract_peak_spectrum */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_peak_spectrum", function() { return xtract_peak_spectrum; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/* harmony import */ var _xtract_array_max__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./xtract_array_max */ "./modules/functions/xtract_array_max.js");
/// <reference path="../../typings/functions.d.ts" />



function xtract_peak_spectrum(spectrum, q, threshold) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(spectrum))
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
    max = Object(_xtract_array_max__WEBPACK_IMPORTED_MODULE_1__["xtract_array_max"])(ampsIn);
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


/***/ }),

/***/ "./modules/functions/xtract_power.js":
/*!*******************************************!*\
  !*** ./modules/functions/xtract_power.js ***!
  \*******************************************/
/*! exports provided: xtract_power */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_power", function() { return xtract_power; });
/// <reference path="../../typings/functions.d.ts" />
function xtract_power(magnitudeArray) {
    return null;
}


/***/ }),

/***/ "./modules/functions/xtract_process_frame_data.js":
/*!********************************************************!*\
  !*** ./modules/functions/xtract_process_frame_data.js ***!
  \********************************************************/
/*! exports provided: xtract_process_frame_data */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_process_frame_data", function() { return xtract_process_frame_data; });
/* harmony import */ var _xtract_get_data_frames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_get_data_frames */ "./modules/functions/xtract_get_data_frames.js");
/* harmony import */ var _xtract_spectrum__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./xtract_spectrum */ "./modules/functions/xtract_spectrum.js");
/// <reference path="../../typings/functions.d.ts" />


function xtract_process_frame_data(array, func, sample_rate, frame_size, hop_size, arg_this) {
    var frames = Object(_xtract_get_data_frames__WEBPACK_IMPORTED_MODULE_0__["xtract_get_data_frames"])(array, frame_size, hop_size);
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
        data.SpectrumData = Object(_xtract_spectrum__WEBPACK_IMPORTED_MODULE_1__["xtract_spectrum"])(frame, sample_rate, true, false);
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


/***/ }),

/***/ "./modules/functions/xtract_resample.js":
/*!**********************************************!*\
  !*** ./modules/functions/xtract_resample.js ***!
  \**********************************************/
/*! exports provided: xtract_resample */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_resample", function() { return xtract_resample; });
/* harmony import */ var _freeFFT__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../freeFFT */ "./modules/freeFFT.js");
/* harmony import */ var _xtract_get_data_frames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./xtract_get_data_frames */ "./modules/functions/xtract_get_data_frames.js");
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/// <reference path="../../typings/functions.d.ts" />




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
    Object(_freeFFT__WEBPACK_IMPORTED_MODULE_0__["inverseTransform"])(Re, Im);
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
    Object(_freeFFT__WEBPACK_IMPORTED_MODULE_0__["transform"])(real, imag);
    return {
        real: real,
        imag: imag
    };
}

function W(N) {
    var w = new Float64Array(N),
        i;
    for (i = 0; i < N; i++) {
        var rad = (Math.PI * i) / (N);
        w[i] = 0.35875 - 0.48829 * Math.cos(2 * rad) + 0.14128 * Math.cos(4 * rad) - 0.01168 * Math.cos(6 * rad);
    }
    return w;
}

function overlap(X, b) { // eslint-disable-line max-statements
    var i, f;
    var Y = new Float64Array(X.length);
    var N = b.length;
    var N2 = 2 * N;
    var B = r2c(b);
    var Xi = Object(_xtract_get_data_frames__WEBPACK_IMPORTED_MODULE_1__["xtract_get_data_frames"])(X, N, N, false);
    var Yi = Object(_xtract_get_data_frames__WEBPACK_IMPORTED_MODULE_1__["xtract_get_data_frames"])(Y, N, N, false);
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
        Object(_freeFFT__WEBPACK_IMPORTED_MODULE_0__["transform"])(xF.real, xF.imag);
        for (i = 0; i < N2; i++) {
            yF.real[i] = xF.real[i] * B.real[i] - xF.imag[i] * B.imag[i];
            yF.imag[i] = xF.imag[i] * B.real[i] + xF.real[i] * B.imag[i];
        }
        Object(_freeFFT__WEBPACK_IMPORTED_MODULE_0__["transform"])(yF.imag, yF.real);
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

function xtract_resample(data, p, q, n) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_2__["xtract_assert_array"])(data))
        return 0;
    // Same function call as matlab:
    // data is the array
    // p is the target sample rate
    // q is the source sample rate
    // n is the desired filter order, n==1024 if undefined

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


/***/ }),

/***/ "./modules/functions/xtract_rms_amplitude.js":
/*!***************************************************!*\
  !*** ./modules/functions/xtract_rms_amplitude.js ***!
  \***************************************************/
/*! exports provided: xtract_rms_amplitude */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_rms_amplitude", function() { return xtract_rms_amplitude; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/// <reference path="../../typings/functions.d.ts" />


function xtract_rms_amplitude(timeArray) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(timeArray))
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


/***/ }),

/***/ "./modules/functions/xtract_rolloff.js":
/*!*********************************************!*\
  !*** ./modules/functions/xtract_rolloff.js ***!
  \*********************************************/
/*! exports provided: xtract_rolloff */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_rolloff", function() { return xtract_rolloff; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/* harmony import */ var _xtract_array_sum__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./xtract_array_sum */ "./modules/functions/xtract_array_sum.js");
/// <reference path="../../typings/functions.d.ts" />



function xtract_rolloff(spectrum, sampleRate, threshold) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(spectrum))
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

    pivot = Object(_xtract_array_sum__WEBPACK_IMPORTED_MODULE_1__["xtract_array_sum"])(amps);

    pivot *= threshold / 100.0;
    var n = 0;
    while (temp < pivot) {
        temp += amps[n];
        n++;
    }
    return n * (sampleRate / (spectrum.length));
}


/***/ }),

/***/ "./modules/functions/xtract_sharpness.js":
/*!***********************************************!*\
  !*** ./modules/functions/xtract_sharpness.js ***!
  \***********************************************/
/*! exports provided: xtract_sharpness */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_sharpness", function() { return xtract_sharpness; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/// <reference path="../../typings/functions.d.ts" />


function xtract_sharpness(barkBandsArray) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(barkBandsArray))
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


/***/ }),

/***/ "./modules/functions/xtract_skewness.js":
/*!**********************************************!*\
  !*** ./modules/functions/xtract_skewness.js ***!
  \**********************************************/
/*! exports provided: xtract_skewness */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_skewness", function() { return xtract_skewness; });
/* harmony import */ var _xtract_skewness_kurtosis__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_skewness_kurtosis */ "./modules/functions/xtract_skewness_kurtosis.js");
/// <reference path="../../typings/functions.d.ts" />

function xtract_skewness(array, mean, standard_deviation) {
    return Object(_xtract_skewness_kurtosis__WEBPACK_IMPORTED_MODULE_0__["xtract_skewness_kurtosis"])(array, mean, standard_deviation)[0];
}


/***/ }),

/***/ "./modules/functions/xtract_skewness_kurtosis.js":
/*!*******************************************************!*\
  !*** ./modules/functions/xtract_skewness_kurtosis.js ***!
  \*******************************************************/
/*! exports provided: xtract_skewness_kurtosis */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_skewness_kurtosis", function() { return xtract_skewness_kurtosis; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/* harmony import */ var _xtract_mean__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./xtract_mean */ "./modules/functions/xtract_mean.js");
/* harmony import */ var _xtract_standard_deviation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./xtract_standard_deviation */ "./modules/functions/xtract_standard_deviation.js");
/* harmony import */ var _xtract_variance__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./xtract_variance */ "./modules/functions/xtract_variance.js");
/// <reference path="../../typings/functions.d.ts" />





function xtract_skewness_kurtosis(array, mean, standard_deviation) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(array))
        return [0.0, 0.0];
    if (typeof mean !== "number") {
        mean = Object(_xtract_mean__WEBPACK_IMPORTED_MODULE_1__["xtract_mean"])(array);
    }
    if (typeof standard_deviation !== "number") {
        standard_deviation = Object(_xtract_standard_deviation__WEBPACK_IMPORTED_MODULE_2__["xtract_standard_deviation"])(array, Object(_xtract_variance__WEBPACK_IMPORTED_MODULE_3__["xtract_variance"])(array, mean));
    }
    if (standard_deviation === 0) {
        return [0.0, 0.0];
    }
    var result = [0.0, 0.0];
    for (var n = 0; n < array.length; n++) {
        result[0] += Math.pow((array[n] - mean) / standard_deviation, 3);
        result[1] += Math.pow((array[n] - mean) / standard_deviation, 4);
    }
    result[0] /= array.length;
    result[1] /= array.length;
    return result;
}


/***/ }),

/***/ "./modules/functions/xtract_smoothness.js":
/*!************************************************!*\
  !*** ./modules/functions/xtract_smoothness.js ***!
  \************************************************/
/*! exports provided: xtract_smoothness */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_smoothness", function() { return xtract_smoothness; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/// <reference path="../../typings/functions.d.ts" />


function xtract_smoothness(spectrum) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(spectrum))
        return 0;
    var prev = 0,
        current = 0,
        next = 0,
        temp = 0;
    var N = spectrum.length;
    var K = N >> 1;
    prev = Math.max(1e-5, spectrum[0]);
    current = Math.max(1e-5, spectrum[1]);
    for (var n = 1; n < K - 1; n++) {
        next = Math.max(1e-5, spectrum[n + 1]);
        temp += Math.abs(20.0 * Math.log(current) - (20.0 * Math.log(prev) + 20.0 * Math.log(current) + 20.0 * Math.log(next)) / 3.0);
        prev = current;
        current = next;
    }
    return temp;
}


/***/ }),

/***/ "./modules/functions/xtract_spectral_centroid.js":
/*!*******************************************************!*\
  !*** ./modules/functions/xtract_spectral_centroid.js ***!
  \*******************************************************/
/*! exports provided: xtract_spectral_centroid */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_spectral_centroid", function() { return xtract_spectral_centroid; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/* harmony import */ var _xtract_array_sum__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./xtract_array_sum */ "./modules/functions/xtract_array_sum.js");
/// <reference path="../../typings/functions.d.ts" />


function xtract_spectral_centroid(spectrum) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(spectrum))
        return 0;
    var N = spectrum.length;
    var n = N >> 1;
    var amps = spectrum.subarray(0, n);
    var freqs = spectrum.subarray(n);
    var A_d = Object(_xtract_array_sum__WEBPACK_IMPORTED_MODULE_1__["xtract_array_sum"])(amps);
    if (A_d === 0.0) {
        return 0.0;
    }
    var sum = 0.0;
    while (n--) {
        sum += freqs[n] * (amps[n] / A_d);
    }
    return sum;
}


/***/ }),

/***/ "./modules/functions/xtract_spectral_fundamental.js":
/*!**********************************************************!*\
  !*** ./modules/functions/xtract_spectral_fundamental.js ***!
  \**********************************************************/
/*! exports provided: xtract_spectral_fundamental */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_spectral_fundamental", function() { return xtract_spectral_fundamental; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/* harmony import */ var _freeFFT_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../freeFFT.js */ "./modules/freeFFT.js");
/// <reference path="../../typings/functions.d.ts" />


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

function xtract_spectral_fundamental(spectrum, sample_rate) {
    // Based on work by Motegi and Shimamura
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(spectrum))
        return 0;

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
    Object(_freeFFT_js__WEBPACK_IMPORTED_MODULE_1__["inverseTransform"])(power, R);
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


/***/ }),

/***/ "./modules/functions/xtract_spectral_inharmonicity.js":
/*!************************************************************!*\
  !*** ./modules/functions/xtract_spectral_inharmonicity.js ***!
  \************************************************************/
/*! exports provided: xtract_spectral_inharmonicity */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_spectral_inharmonicity", function() { return xtract_spectral_inharmonicity; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/// <reference path="../../typings/functions.d.ts" />


function xtract_spectral_inharmonicity(peakSpectrum, f0) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(peakSpectrum))
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


/***/ }),

/***/ "./modules/functions/xtract_spectral_kurtosis.js":
/*!*******************************************************!*\
  !*** ./modules/functions/xtract_spectral_kurtosis.js ***!
  \*******************************************************/
/*! exports provided: xtract_spectral_kurtosis */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_spectral_kurtosis", function() { return xtract_spectral_kurtosis; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/* harmony import */ var _xtract_spectral_centroid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./xtract_spectral_centroid */ "./modules/functions/xtract_spectral_centroid.js");
/* harmony import */ var _xtract_spectral_standard_deviation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./xtract_spectral_standard_deviation */ "./modules/functions/xtract_spectral_standard_deviation.js");
/* harmony import */ var _xtract_spectral_variance__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./xtract_spectral_variance */ "./modules/functions/xtract_spectral_variance.js");
/* harmony import */ var _xtract_array_sum__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./xtract_array_sum */ "./modules/functions/xtract_array_sum.js");
/// <reference path="../../typings/functions.d.ts" />






function xtract_spectral_kurtosis(spectrum, spectral_centroid, spectral_standard_deviation) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(spectrum))
        return 0;
    if (typeof spectral_centroid !== "number") {
        spectral_centroid = Object(_xtract_spectral_centroid__WEBPACK_IMPORTED_MODULE_1__["xtract_spectral_centroid"])(spectrum);
    }
    if (typeof spectral_standard_deviation !== "number") {
        spectral_standard_deviation = Object(_xtract_spectral_standard_deviation__WEBPACK_IMPORTED_MODULE_2__["xtract_spectral_standard_deviation"])(spectrum, Object(_xtract_spectral_variance__WEBPACK_IMPORTED_MODULE_3__["xtract_spectral_variance"])(spectrum, spectral_centroid));
    }
    if (spectral_standard_deviation === 0) {
        return Infinity;
    }
    var result = 0;
    var N = spectrum.length;
    var K = N >> 1;
    var amps = spectrum.subarray(0, K);
    var freqs = spectrum.subarray(K);
    var A_d = Object(_xtract_array_sum__WEBPACK_IMPORTED_MODULE_4__["xtract_array_sum"])(amps);
    for (var n = 0; n < K; n++) {
        result += Math.pow(freqs[n] - spectral_centroid, 4) * (amps[n] / A_d);
    }
    return result / Math.pow(spectral_standard_deviation, 4);
}


/***/ }),

/***/ "./modules/functions/xtract_spectral_mean.js":
/*!***************************************************!*\
  !*** ./modules/functions/xtract_spectral_mean.js ***!
  \***************************************************/
/*! exports provided: xtract_spectral_mean */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_spectral_mean", function() { return xtract_spectral_mean; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/* harmony import */ var _xtract_array_sum__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./xtract_array_sum */ "./modules/functions/xtract_array_sum.js");
/// <reference path="../../typings/functions.d.ts" />



function xtract_spectral_mean(spectrum) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(spectrum))
        return 0;
    var N = spectrum.length;
    var n = N >> 1;
    var amps = spectrum.subarray(0, n);
    var sum = Object(_xtract_array_sum__WEBPACK_IMPORTED_MODULE_1__["xtract_array_sum"])(amps);
    var result = sum / n;
    return result;
}


/***/ }),

/***/ "./modules/functions/xtract_spectral_skewness.js":
/*!*******************************************************!*\
  !*** ./modules/functions/xtract_spectral_skewness.js ***!
  \*******************************************************/
/*! exports provided: xtract_spectral_skewness */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_spectral_skewness", function() { return xtract_spectral_skewness; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/* harmony import */ var _xtract_spectral_centroid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./xtract_spectral_centroid */ "./modules/functions/xtract_spectral_centroid.js");
/* harmony import */ var _xtract_spectral_standard_deviation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./xtract_spectral_standard_deviation */ "./modules/functions/xtract_spectral_standard_deviation.js");
/* harmony import */ var _xtract_spectral_variance__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./xtract_spectral_variance */ "./modules/functions/xtract_spectral_variance.js");
/* harmony import */ var _xtract_array_sum__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./xtract_array_sum */ "./modules/functions/xtract_array_sum.js");
/// <reference path="../../typings/functions.d.ts" />






function xtract_spectral_skewness(spectrum, spectral_centroid, spectral_standard_deviation) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(spectrum))
        return 0;
    if (typeof spectral_mean !== "number") {
        spectral_centroid = Object(_xtract_spectral_centroid__WEBPACK_IMPORTED_MODULE_1__["xtract_spectral_centroid"])(spectrum);
    }
    if (typeof spectral_standard_deviation !== "number") {
        spectral_standard_deviation = Object(_xtract_spectral_standard_deviation__WEBPACK_IMPORTED_MODULE_2__["xtract_spectral_standard_deviation"])(spectrum, Object(_xtract_spectral_variance__WEBPACK_IMPORTED_MODULE_3__["xtract_spectral_variance"])(spectrum, spectral_centroid));
    }
    if (spectral_standard_deviation === 0) {
        return 0;
    }
    var result = 0;
    var N = spectrum.length;
    var K = N >> 1;
    var amps = spectrum.subarray(0, K);
    var freqs = spectrum.subarray(K);
    var A_d = Object(_xtract_array_sum__WEBPACK_IMPORTED_MODULE_4__["xtract_array_sum"])(amps);
    for (var n = 0; n < K; n++) {
        result += Math.pow(freqs[n] - spectral_centroid, 3) * (amps[n] / A_d);
    }
    result /= Math.pow(spectral_standard_deviation, 3);
    return result;
}


/***/ }),

/***/ "./modules/functions/xtract_spectral_slope.js":
/*!****************************************************!*\
  !*** ./modules/functions/xtract_spectral_slope.js ***!
  \****************************************************/
/*! exports provided: xtract_spectral_slope */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_spectral_slope", function() { return xtract_spectral_slope; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/* harmony import */ var _xtract_array_sum__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./xtract_array_sum */ "./modules/functions/xtract_array_sum.js");
/// <reference path="../../typings/functions.d.ts" />



function xtract_spectral_slope(spectrum) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(spectrum))
        return 0;
    var F = 0.0,
        FA = 0.0,
        A = 0.0,
        FXTRACT_SQ = 0.0;
    var N = spectrum.length;
    var M = N >> 1;
    var amps = spectrum.subarray(0, M);
    var freqs = spectrum.subarray(M);
    F = Object(_xtract_array_sum__WEBPACK_IMPORTED_MODULE_1__["xtract_array_sum"])(freqs);
    A = Object(_xtract_array_sum__WEBPACK_IMPORTED_MODULE_1__["xtract_array_sum"])(amps);
    for (var n = 0; n < M; n++) {
        FA += freqs[n] * amps[n];
        FXTRACT_SQ += freqs[n] * freqs[n];
    }
    return (1.0 / A) * (M * FA - F * A) / (M * FXTRACT_SQ - F * F);
}


/***/ }),

/***/ "./modules/functions/xtract_spectral_spread.js":
/*!*****************************************************!*\
  !*** ./modules/functions/xtract_spectral_spread.js ***!
  \*****************************************************/
/*! exports provided: xtract_spectral_spread */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_spectral_spread", function() { return xtract_spectral_spread; });
/* harmony import */ var _xtract_spectral_variance__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_spectral_variance */ "./modules/functions/xtract_spectral_variance.js");
/// <reference path="../../typings/functions.d.ts" />

function xtract_spectral_spread(spectrum, spectral_centroid) {
    return Object(_xtract_spectral_variance__WEBPACK_IMPORTED_MODULE_0__["xtract_spectral_variance"])(spectrum, spectral_centroid);
}


/***/ }),

/***/ "./modules/functions/xtract_spectral_standard_deviation.js":
/*!*****************************************************************!*\
  !*** ./modules/functions/xtract_spectral_standard_deviation.js ***!
  \*****************************************************************/
/*! exports provided: xtract_spectral_standard_deviation */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_spectral_standard_deviation", function() { return xtract_spectral_standard_deviation; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/* harmony import */ var _xtract_spectral_variance__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./xtract_spectral_variance */ "./modules/functions/xtract_spectral_variance.js");
/// <reference path="../../typings/functions.d.ts" />


function xtract_spectral_standard_deviation(spectrum, spectral_variance) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(spectrum))
        return 0;
    if (typeof spectral_variance !== "number") {
        spectral_variance = Object(_xtract_spectral_variance__WEBPACK_IMPORTED_MODULE_1__["xtract_spectral_variance"])(spectrum);
    }
    return Math.sqrt(spectral_variance);
}


/***/ }),

/***/ "./modules/functions/xtract_spectral_variance.js":
/*!*******************************************************!*\
  !*** ./modules/functions/xtract_spectral_variance.js ***!
  \*******************************************************/
/*! exports provided: xtract_spectral_variance */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_spectral_variance", function() { return xtract_spectral_variance; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/* harmony import */ var _xtract_spectral_centroid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./xtract_spectral_centroid */ "./modules/functions/xtract_spectral_centroid.js");
/* harmony import */ var _xtract_array_sum__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./xtract_array_sum */ "./modules/functions/xtract_array_sum.js");
/// <reference path="../../typings/functions.d.ts" />



function xtract_spectral_variance(spectrum, spectral_centroid) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(spectrum))
        return 0;
    if (typeof spectral_centroid !== "number") {
        spectral_centroid = Object(_xtract_spectral_centroid__WEBPACK_IMPORTED_MODULE_1__["xtract_spectral_centroid"])(spectrum);
    }
    var A = 0,
        result = 0;
    var N = spectrum.length;
    var n = N >> 1;
    var amps = spectrum.subarray(0, n);
    var freqs = spectrum.subarray(n, N);
    var A_d = Object(_xtract_array_sum__WEBPACK_IMPORTED_MODULE_2__["xtract_array_sum"])(amps);
    while (n--) {
        result += Math.pow(freqs[n] - spectral_centroid, 2) * (amps[n] / A_d);
    }
    return result;
}


/***/ }),

/***/ "./modules/functions/xtract_spectrum.js":
/*!**********************************************!*\
  !*** ./modules/functions/xtract_spectrum.js ***!
  \**********************************************/
/*! exports provided: xtract_spectrum */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_spectrum", function() { return xtract_spectrum; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/* harmony import */ var _xtract_array_normalise__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./xtract_array_normalise */ "./modules/functions/xtract_array_normalise.js");
/* harmony import */ var _freeFFT__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../freeFFT */ "./modules/freeFFT.js");
/// <reference path="../../typings/functions.d.ts" />




function xtract_spectrum(array, sample_rate, withDC, normalise) {
    (function (array, sample_rate) {
        if (typeof sample_rate !== "number") {
            throw ("Sample Rate must be defined");
        }
    })(array, sample_rate);
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(array)) {
        return 0;
    }
    withDC = (withDC === true);
    normalise = (normalise === true);

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
    array.forEach(function (v, i) {
        reals[i] = v;
    });
    Object(_freeFFT__WEBPACK_IMPORTED_MODULE_2__["transform"])(reals, imags);
    for (var k = align; k <= result.length / 2; k++) {
        amps[k - align] = Math.sqrt((reals[k] * reals[k]) + (imags[k] * imags[k])) / array.length;
        freqs[k - align] = (2 * k / N) * (sample_rate / 2);
    }
    if (normalise) {
        amps = Object(_xtract_array_normalise__WEBPACK_IMPORTED_MODULE_1__["xtract_array_normalise"])(amps);
    }
    return result;
}


/***/ }),

/***/ "./modules/functions/xtract_standard_deviation.js":
/*!********************************************************!*\
  !*** ./modules/functions/xtract_standard_deviation.js ***!
  \********************************************************/
/*! exports provided: xtract_standard_deviation */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_standard_deviation", function() { return xtract_standard_deviation; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/* harmony import */ var _xtract_variance__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./xtract_variance */ "./modules/functions/xtract_variance.js");
/// <reference path="../../typings/functions.d.ts" />


function xtract_standard_deviation(array, variance) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(array))
        return 0;
    if (typeof variance !== "number") {
        variance = Object(_xtract_variance__WEBPACK_IMPORTED_MODULE_1__["xtract_variance"])(array);
    }
    return Math.sqrt(variance);
}


/***/ }),

/***/ "./modules/functions/xtract_sum.js":
/*!*****************************************!*\
  !*** ./modules/functions/xtract_sum.js ***!
  \*****************************************/
/*! exports provided: xtract_sum */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_sum", function() { return xtract_sum; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/* harmony import */ var _xtract_array_sum__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./xtract_array_sum */ "./modules/functions/xtract_array_sum.js");
/// <reference path="../../typings/functions.d.ts" />



function xtract_sum(data) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(data))
        return 0;
    return Object(_xtract_array_sum__WEBPACK_IMPORTED_MODULE_1__["xtract_array_sum"])(data);
}


/***/ }),

/***/ "./modules/functions/xtract_temporal_centroid.js":
/*!*******************************************************!*\
  !*** ./modules/functions/xtract_temporal_centroid.js ***!
  \*******************************************************/
/*! exports provided: xtract_temporal_centroid */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_temporal_centroid", function() { return xtract_temporal_centroid; });
/* harmony import */ var _xtract_array_sum__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_array_sum */ "./modules/functions/xtract_array_sum.js");
/// <reference path="../../typings/functions.d.ts" />

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
    var den = Object(_xtract_array_sum__WEBPACK_IMPORTED_MODULE_0__["xtract_array_sum"])(energyArray);
    var num = 0.0;
    for (var n = 0; n < energyArray.length; n++) {
        num += energyArray[n] * (n * L * ts);
    }
    var result = num / den;
    return result;
}


/***/ }),

/***/ "./modules/functions/xtract_tonality.js":
/*!**********************************************!*\
  !*** ./modules/functions/xtract_tonality.js ***!
  \**********************************************/
/*! exports provided: xtract_tonality */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_tonality", function() { return xtract_tonality; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/* harmony import */ var _xtract_flatness_db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./xtract_flatness_db */ "./modules/functions/xtract_flatness_db.js");
/// <reference path="../../typings/functions.d.ts" />



function xtract_tonality(spectrum, flatness_db) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(spectrum))
        return 0;
    if (typeof flatness_db !== "number") {
        flatness_db = Object(_xtract_flatness_db__WEBPACK_IMPORTED_MODULE_1__["xtract_flatness_db"])(spectrum);
    }
    return Math.min(flatness_db / -60.0, 1);
}


/***/ }),

/***/ "./modules/functions/xtract_tristimulus.js":
/*!*************************************************!*\
  !*** ./modules/functions/xtract_tristimulus.js ***!
  \*************************************************/
/*! exports provided: xtract_tristimulus, xtract_tristimulus_1, xtract_tristimulus_2, xtract_tristimulus_3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_tristimulus", function() { return xtract_tristimulus; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_tristimulus_1", function() { return xtract_tristimulus_1; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_tristimulus_2", function() { return xtract_tristimulus_2; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_tristimulus_3", function() { return xtract_tristimulus_3; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/// <reference path="../../typings/functions.d.ts" />

function xtract_tristimulus(spectrum, f0) {
    var trist = [0.0, 0.0, 0.0];
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(spectrum))
        return trist;
    if (typeof f0 !== "number") {
        throw ("xtract_tristimulus requires f0 to be defined and a number");
    }
    var h = 0,
        den = 0.0,
        p = [0, 0, 0, 0, 0],
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
            p[h - 1] += temp;
        }
    }

    if (den !== 0.0) {
        trist[0] = p[0] / den;
        trist[1] = (p[1] + p[2] + p[3]) / den;
        trist[2] = p[4] / den;
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


/***/ }),

/***/ "./modules/functions/xtract_variance.js":
/*!**********************************************!*\
  !*** ./modules/functions/xtract_variance.js ***!
  \**********************************************/
/*! exports provided: xtract_variance */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_variance", function() { return xtract_variance; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/* harmony import */ var _xtract_mean__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./xtract_mean */ "./modules/functions/xtract_mean.js");
/// <reference path="../../typings/functions.d.ts" />



function xtract_variance(array, mean) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(array))
        return 0;
    if (typeof mean !== "number") {
        mean = Object(_xtract_mean__WEBPACK_IMPORTED_MODULE_1__["xtract_mean"])(array);
    }
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(array))
        return 0;
    if (typeof mean !== "number") {
        mean = Object(_xtract_mean__WEBPACK_IMPORTED_MODULE_1__["xtract_mean"])(array);
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


/***/ }),

/***/ "./modules/functions/xtract_wavelet_f0.js":
/*!************************************************!*\
  !*** ./modules/functions/xtract_wavelet_f0.js ***!
  \************************************************/
/*! exports provided: xtract_wavelet_f0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_wavelet_f0", function() { return xtract_wavelet_f0; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/* harmony import */ var _xtract_array_sum__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./xtract_array_sum */ "./modules/functions/xtract_array_sum.js");
/* harmony import */ var _xtract_mean__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./xtract_mean */ "./modules/functions/xtract_mean.js");
/// <reference path="../../typings/functions.d.ts" />




function xtract_wavelet_f0(timeArray, sampleRate, pitchtracker) { // eslint-disable-line max-statements
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(timeArray))
        return 0;
    if (pitchtracker === undefined) {
        throw ("xtract_wavelet_f0 requires pitchtracker to be defined");
    }
    if (Object(_xtract_array_sum__WEBPACK_IMPORTED_MODULE_1__["xtract_array_sum"])(timeArray) === 0) {
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

    function bodyLoop() { // eslint-disable-line max-statements
        delta = Math.floor(44100 / (_2power(curLevel) * 3000));
        if (curSamNb < 2) {
            cont = false;
            return;
        }
        var dv, previousDV = -1000;
        var nbMins = 0,
            nbMaxs = 0;
        var lastMinIndex = -1000000;
        var lastmaxIndex = -1000000;
        var findMax = 0;
        var findMin = 0;
        (function () { // eslint-disable-line complexity
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
        })();

        if (nbMins === 0 && nbMaxs === 0) {
            cont = false;
            return;
        }

        var d;
        //memset(distances, 0, samplecount*sizeof(int));
        var distances = new Int32Array(samplecount);
        (function () {
            for (i = 0; i < nbMins; i++) {
                for (j = 1; j < 3; j++) {
                    if (i + j < nbMins) {
                        d = _iabs(mins[i] - mins[i + j]);
                        distances[d] = distances[d] + 1;
                    }
                }
            }
            for (i = 0; i < nbMaxs; i++) {
                for (j = 1; j < 3; j++) {
                    if (i + j < nbMaxs) {
                        d = _iabs(maxs[i] - maxs[i + j]);
                        //asLog("dywapitch i=%ld j=%ld d=%ld\n", i, j, d);
                        distances[d] = distances[d] + 1;
                    }
                }
            }
        })();

        var bestDistance = -1;
        var bestValue = -1;
        (function () {
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
        })();
        var distAvg = 0.0;
        var nbDists = 0;
        (function () {
            for (j = -delta; j <= delta; j++) {
                if (bestDistance + j >= 0 && bestDistance + j < samplecount) {
                    var nbDist = distances[bestDistance + j];
                    if (nbDist > 0) {
                        nbDists += nbDist;
                        distAvg += (bestDistance + j) * nbDist;
                    }
                }
            }
        })();
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
                return;
            }
            //if DEBUGG then put "similarity="&similarity&&"delta="&delta&&"not"
        }

        // not similar, continue next level
        curModeDistance = distAvg;

        curLevel = curLevel + 1;
        if (curLevel >= 6) {
            // put "max levels reached, exiting"
            //asLog("dywapitch max levels reached, exiting\n");
            cont = false;
            return;
        }

        // downsample
        if (curSamNb < 2) {
            //asLog("dywapitch not enough samples, exiting\n");
            cont = false;
            return;
        }
        (function () {
            for (i = 0; i < curSamNb / 2; i++) {
                sam[i] = (sam[2 * i] + sam[2 * i + 1]) / 2.0;
            }
        })();
        curSamNb /= 2;
    }

    function _dywapitch_dynamicprocess(pitchtracker, pitch) { // eslint-disable-line complexity
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

    var mins = new Int32Array(samplecount);
    var maxs = new Int32Array(samplecount);

    //var maxFLWTlevels = 6;
    //var maxF = 3000;
    //var differenceLevelsN = 3;
    //var maximaThresholdRatio = 0.75;
    var theDC = getTheDC(sam, samplecount);

    function getTheDC(sam, samplecount) {
        return Object(_xtract_mean__WEBPACK_IMPORTED_MODULE_2__["xtract_mean"])(sam.subarray(samplecount));
    }

    function getamplitudeMax(sam, samplecount) {
        var si, i;
        var minValue = 0.0,
            maxValue = 0.0;
        for (i = 0; i < samplecount; i++) {
            si = sam[i];
            if (si > maxValue) {
                maxValue = si;
            }
            if (si < minValue) {
                minValue = si;
            }
        }
        maxValue = maxValue - theDC;
        minValue = minValue - theDC;
        return (maxValue > -minValue ? maxValue : -minValue);
    }
    var ampltitudeThreshold = getamplitudeMax(sam, samplecount) * 0.75;

    var curLevel = 0;
    var curModeDistance = -1;
    var delta;

    var cont = true;

    while (cont) {
        bodyLoop();
    }

    //_dywapitch_dynamicprocess(pitchtracker, pitch)
    return _dywapitch_dynamicprocess(pitchtracker, pitchF);
}


/***/ }),

/***/ "./modules/functions/xtract_yin.js":
/*!*****************************************!*\
  !*** ./modules/functions/xtract_yin.js ***!
  \*****************************************/
/*! exports provided: xtract_yin */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_yin", function() { return xtract_yin; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/// <reference path="../../typings/functions.d.ts" />


function xtract_yin(array) {
    // Uses the YIN process
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(array))
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


/***/ }),

/***/ "./modules/functions/xtract_zcr.js":
/*!*****************************************!*\
  !*** ./modules/functions/xtract_zcr.js ***!
  \*****************************************/
/*! exports provided: xtract_zcr */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xtract_zcr", function() { return xtract_zcr; });
/* harmony import */ var _xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/// <reference path="../../typings/functions.d.ts" />

function xtract_zcr(timeArray) {
    if (!Object(_xtract_assert_array__WEBPACK_IMPORTED_MODULE_0__["xtract_assert_array"])(timeArray))
        return 0;
    var result = 0;
    for (var n = 1; n < timeArray.length; n++) {
        if (timeArray[n] * timeArray[n - 1] < 0) {
            result++;
        }
    }
    return result / timeArray.length;
}


/***/ }),

/***/ "./modules/index.js":
/*!**************************!*\
  !*** ./modules/index.js ***!
  \**************************/
/*! exports provided: xtract_is_denormal, xtract_assert_array, xtract_assert_positive_integer, xtract_array_sum, xtract_array_copy, xtract_array_min, xtract_array_max, xtract_array_scale, xtract_array_normalise, xtract_array_bound, xtract_array_interlace, xtract_array_deinterlace, xtract_get_number_of_frames, xtract_get_data_frames, xtract_process_frame_data, xtract_array_to_JSON, xtract_frame_from_array, xtract_mean, xtract_temporal_centroid, xtract_variance, xtract_standard_deviation, xtract_average_deviation, xtract_skewness_kurtosis, xtract_skewness, xtract_kurtosis, xtract_spectral_centroid, xtract_spectral_mean, xtract_spectral_variance, xtract_spectral_spread, xtract_spectral_standard_deviation, xtract_spectral_skewness, xtract_spectral_kurtosis, xtract_irregularity_k, xtract_irregularity_j, xtract_tristimulus, xtract_tristimulus_1, xtract_tristimulus_2, xtract_tristimulus_3, xtract_smoothness, xtract_zcr, xtract_rolloff, xtract_loudness, xtract_flatness, xtract_flatness_db, xtract_tonality, xtract_crest, xtract_noisiness, xtract_rms_amplitude, xtract_spectral_inharmonicity, xtract_power, xtract_odd_even_ratio, xtract_sharpness, xtract_spectral_slope, xtract_lowhigh, xtract_lowest_value, xtract_highest_value, xtract_sum, xtract_nonzero_count, xtract_hps, xtract_f0, xtract_failsafe_f0, xtract_wavelet_f0, xtract_midicent, xtract_spectral_fundamental, xtract_energy, xtract_spectrum, xtract_complex_spectrum, xtract_mfcc, xtract_dct, xtract_dct_2, xtract_autocorrelation, xtract_amdf, xtract_asdf, xtract_bark_coefficients, xtract_peak_spectrum, xtract_harmonic_spectrum, xtract_lpc, xtract_lpcc, xtract_pcp, xtract_yin, xtract_onset, xtract_resample, xtract_init_dft, xtract_init_dct, xtract_init_mfcc, xtract_init_wavelet, xtract_init_pcp, xtract_init_bark, xtract_init_chroma, xtract_apply_window, xtract_create_window, xtract_chroma, HarmonicSpectrumData, PeakSpectrumData, SpectrumData, TimeData */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _functions_xtract_is_denormal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./functions/xtract_is_denormal */ "./modules/functions/xtract_is_denormal.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_is_denormal", function() { return _functions_xtract_is_denormal__WEBPACK_IMPORTED_MODULE_0__["xtract_is_denormal"]; });

/* harmony import */ var _functions_xtract_assert_array__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./functions/xtract_assert_array */ "./modules/functions/xtract_assert_array.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_assert_array", function() { return _functions_xtract_assert_array__WEBPACK_IMPORTED_MODULE_1__["xtract_assert_array"]; });

/* harmony import */ var _functions_xtract_assert_positive_integer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./functions/xtract_assert_positive_integer */ "./modules/functions/xtract_assert_positive_integer.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_assert_positive_integer", function() { return _functions_xtract_assert_positive_integer__WEBPACK_IMPORTED_MODULE_2__["xtract_assert_positive_integer"]; });

/* harmony import */ var _functions_xtract_array_sum__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./functions/xtract_array_sum */ "./modules/functions/xtract_array_sum.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_array_sum", function() { return _functions_xtract_array_sum__WEBPACK_IMPORTED_MODULE_3__["xtract_array_sum"]; });

/* harmony import */ var _functions_xtract_array_copy__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./functions/xtract_array_copy */ "./modules/functions/xtract_array_copy.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_array_copy", function() { return _functions_xtract_array_copy__WEBPACK_IMPORTED_MODULE_4__["xtract_array_copy"]; });

/* harmony import */ var _functions_xtract_array_min__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./functions/xtract_array_min */ "./modules/functions/xtract_array_min.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_array_min", function() { return _functions_xtract_array_min__WEBPACK_IMPORTED_MODULE_5__["xtract_array_min"]; });

/* harmony import */ var _functions_xtract_array_max__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./functions/xtract_array_max */ "./modules/functions/xtract_array_max.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_array_max", function() { return _functions_xtract_array_max__WEBPACK_IMPORTED_MODULE_6__["xtract_array_max"]; });

/* harmony import */ var _functions_xtract_array_scale__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./functions/xtract_array_scale */ "./modules/functions/xtract_array_scale.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_array_scale", function() { return _functions_xtract_array_scale__WEBPACK_IMPORTED_MODULE_7__["xtract_array_scale"]; });

/* harmony import */ var _functions_xtract_array_normalise__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./functions/xtract_array_normalise */ "./modules/functions/xtract_array_normalise.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_array_normalise", function() { return _functions_xtract_array_normalise__WEBPACK_IMPORTED_MODULE_8__["xtract_array_normalise"]; });

/* harmony import */ var _functions_xtract_array_bound__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./functions/xtract_array_bound */ "./modules/functions/xtract_array_bound.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_array_bound", function() { return _functions_xtract_array_bound__WEBPACK_IMPORTED_MODULE_9__["xtract_array_bound"]; });

/* harmony import */ var _functions_xtract_array_interlace__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./functions/xtract_array_interlace */ "./modules/functions/xtract_array_interlace.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_array_interlace", function() { return _functions_xtract_array_interlace__WEBPACK_IMPORTED_MODULE_10__["xtract_array_interlace"]; });

/* harmony import */ var _functions_xtract_array_deinterlace__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./functions/xtract_array_deinterlace */ "./modules/functions/xtract_array_deinterlace.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_array_deinterlace", function() { return _functions_xtract_array_deinterlace__WEBPACK_IMPORTED_MODULE_11__["xtract_array_deinterlace"]; });

/* harmony import */ var _functions_xtract_get_number_of_frames__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./functions/xtract_get_number_of_frames */ "./modules/functions/xtract_get_number_of_frames.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_get_number_of_frames", function() { return _functions_xtract_get_number_of_frames__WEBPACK_IMPORTED_MODULE_12__["xtract_get_number_of_frames"]; });

/* harmony import */ var _functions_xtract_get_data_frames__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./functions/xtract_get_data_frames */ "./modules/functions/xtract_get_data_frames.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_get_data_frames", function() { return _functions_xtract_get_data_frames__WEBPACK_IMPORTED_MODULE_13__["xtract_get_data_frames"]; });

/* harmony import */ var _functions_xtract_process_frame_data__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./functions/xtract_process_frame_data */ "./modules/functions/xtract_process_frame_data.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_process_frame_data", function() { return _functions_xtract_process_frame_data__WEBPACK_IMPORTED_MODULE_14__["xtract_process_frame_data"]; });

/* harmony import */ var _functions_xtract_array_to_JSON__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./functions/xtract_array_to_JSON */ "./modules/functions/xtract_array_to_JSON.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_array_to_JSON", function() { return _functions_xtract_array_to_JSON__WEBPACK_IMPORTED_MODULE_15__["xtract_array_to_JSON"]; });

/* harmony import */ var _functions_xtract_frame_from_array__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./functions/xtract_frame_from_array */ "./modules/functions/xtract_frame_from_array.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_frame_from_array", function() { return _functions_xtract_frame_from_array__WEBPACK_IMPORTED_MODULE_16__["xtract_frame_from_array"]; });

/* harmony import */ var _functions_xtract_mean__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./functions/xtract_mean */ "./modules/functions/xtract_mean.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_mean", function() { return _functions_xtract_mean__WEBPACK_IMPORTED_MODULE_17__["xtract_mean"]; });

/* harmony import */ var _functions_xtract_temporal_centroid__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./functions/xtract_temporal_centroid */ "./modules/functions/xtract_temporal_centroid.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_temporal_centroid", function() { return _functions_xtract_temporal_centroid__WEBPACK_IMPORTED_MODULE_18__["xtract_temporal_centroid"]; });

/* harmony import */ var _functions_xtract_variance__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./functions/xtract_variance */ "./modules/functions/xtract_variance.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_variance", function() { return _functions_xtract_variance__WEBPACK_IMPORTED_MODULE_19__["xtract_variance"]; });

/* harmony import */ var _functions_xtract_standard_deviation__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./functions/xtract_standard_deviation */ "./modules/functions/xtract_standard_deviation.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_standard_deviation", function() { return _functions_xtract_standard_deviation__WEBPACK_IMPORTED_MODULE_20__["xtract_standard_deviation"]; });

/* harmony import */ var _functions_xtract_average_deviation__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./functions/xtract_average_deviation */ "./modules/functions/xtract_average_deviation.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_average_deviation", function() { return _functions_xtract_average_deviation__WEBPACK_IMPORTED_MODULE_21__["xtract_average_deviation"]; });

/* harmony import */ var _functions_xtract_skewness_kurtosis__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./functions/xtract_skewness_kurtosis */ "./modules/functions/xtract_skewness_kurtosis.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_skewness_kurtosis", function() { return _functions_xtract_skewness_kurtosis__WEBPACK_IMPORTED_MODULE_22__["xtract_skewness_kurtosis"]; });

/* harmony import */ var _functions_xtract_skewness__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./functions/xtract_skewness */ "./modules/functions/xtract_skewness.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_skewness", function() { return _functions_xtract_skewness__WEBPACK_IMPORTED_MODULE_23__["xtract_skewness"]; });

/* harmony import */ var _functions_xtract_kurtosis__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./functions/xtract_kurtosis */ "./modules/functions/xtract_kurtosis.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_kurtosis", function() { return _functions_xtract_kurtosis__WEBPACK_IMPORTED_MODULE_24__["xtract_kurtosis"]; });

/* harmony import */ var _functions_xtract_spectral_centroid__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./functions/xtract_spectral_centroid */ "./modules/functions/xtract_spectral_centroid.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_spectral_centroid", function() { return _functions_xtract_spectral_centroid__WEBPACK_IMPORTED_MODULE_25__["xtract_spectral_centroid"]; });

/* harmony import */ var _functions_xtract_spectral_mean__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./functions/xtract_spectral_mean */ "./modules/functions/xtract_spectral_mean.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_spectral_mean", function() { return _functions_xtract_spectral_mean__WEBPACK_IMPORTED_MODULE_26__["xtract_spectral_mean"]; });

/* harmony import */ var _functions_xtract_spectral_variance__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./functions/xtract_spectral_variance */ "./modules/functions/xtract_spectral_variance.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_spectral_variance", function() { return _functions_xtract_spectral_variance__WEBPACK_IMPORTED_MODULE_27__["xtract_spectral_variance"]; });

/* harmony import */ var _functions_xtract_spectral_spread__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ./functions/xtract_spectral_spread */ "./modules/functions/xtract_spectral_spread.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_spectral_spread", function() { return _functions_xtract_spectral_spread__WEBPACK_IMPORTED_MODULE_28__["xtract_spectral_spread"]; });

/* harmony import */ var _functions_xtract_spectral_standard_deviation__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ./functions/xtract_spectral_standard_deviation */ "./modules/functions/xtract_spectral_standard_deviation.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_spectral_standard_deviation", function() { return _functions_xtract_spectral_standard_deviation__WEBPACK_IMPORTED_MODULE_29__["xtract_spectral_standard_deviation"]; });

/* harmony import */ var _functions_xtract_spectral_skewness__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ./functions/xtract_spectral_skewness */ "./modules/functions/xtract_spectral_skewness.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_spectral_skewness", function() { return _functions_xtract_spectral_skewness__WEBPACK_IMPORTED_MODULE_30__["xtract_spectral_skewness"]; });

/* harmony import */ var _functions_xtract_spectral_kurtosis__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ./functions/xtract_spectral_kurtosis */ "./modules/functions/xtract_spectral_kurtosis.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_spectral_kurtosis", function() { return _functions_xtract_spectral_kurtosis__WEBPACK_IMPORTED_MODULE_31__["xtract_spectral_kurtosis"]; });

/* harmony import */ var _functions_xtract_irregularity_k__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! ./functions/xtract_irregularity_k */ "./modules/functions/xtract_irregularity_k.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_irregularity_k", function() { return _functions_xtract_irregularity_k__WEBPACK_IMPORTED_MODULE_32__["xtract_irregularity_k"]; });

/* harmony import */ var _functions_xtract_irregularity_j__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! ./functions/xtract_irregularity_j */ "./modules/functions/xtract_irregularity_j.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_irregularity_j", function() { return _functions_xtract_irregularity_j__WEBPACK_IMPORTED_MODULE_33__["xtract_irregularity_j"]; });

/* harmony import */ var _functions_xtract_tristimulus__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! ./functions/xtract_tristimulus */ "./modules/functions/xtract_tristimulus.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_tristimulus", function() { return _functions_xtract_tristimulus__WEBPACK_IMPORTED_MODULE_34__["xtract_tristimulus"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_tristimulus_1", function() { return _functions_xtract_tristimulus__WEBPACK_IMPORTED_MODULE_34__["xtract_tristimulus_1"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_tristimulus_2", function() { return _functions_xtract_tristimulus__WEBPACK_IMPORTED_MODULE_34__["xtract_tristimulus_2"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_tristimulus_3", function() { return _functions_xtract_tristimulus__WEBPACK_IMPORTED_MODULE_34__["xtract_tristimulus_3"]; });

/* harmony import */ var _functions_xtract_smoothness__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(/*! ./functions/xtract_smoothness */ "./modules/functions/xtract_smoothness.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_smoothness", function() { return _functions_xtract_smoothness__WEBPACK_IMPORTED_MODULE_35__["xtract_smoothness"]; });

/* harmony import */ var _functions_xtract_zcr__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(/*! ./functions/xtract_zcr */ "./modules/functions/xtract_zcr.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_zcr", function() { return _functions_xtract_zcr__WEBPACK_IMPORTED_MODULE_36__["xtract_zcr"]; });

/* harmony import */ var _functions_xtract_rolloff__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(/*! ./functions/xtract_rolloff */ "./modules/functions/xtract_rolloff.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_rolloff", function() { return _functions_xtract_rolloff__WEBPACK_IMPORTED_MODULE_37__["xtract_rolloff"]; });

/* harmony import */ var _functions_xtract_loudness__WEBPACK_IMPORTED_MODULE_38__ = __webpack_require__(/*! ./functions/xtract_loudness */ "./modules/functions/xtract_loudness.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_loudness", function() { return _functions_xtract_loudness__WEBPACK_IMPORTED_MODULE_38__["xtract_loudness"]; });

/* harmony import */ var _functions_xtract_flatness__WEBPACK_IMPORTED_MODULE_39__ = __webpack_require__(/*! ./functions/xtract_flatness */ "./modules/functions/xtract_flatness.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_flatness", function() { return _functions_xtract_flatness__WEBPACK_IMPORTED_MODULE_39__["xtract_flatness"]; });

/* harmony import */ var _functions_xtract_flatness_db__WEBPACK_IMPORTED_MODULE_40__ = __webpack_require__(/*! ./functions/xtract_flatness_db */ "./modules/functions/xtract_flatness_db.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_flatness_db", function() { return _functions_xtract_flatness_db__WEBPACK_IMPORTED_MODULE_40__["xtract_flatness_db"]; });

/* harmony import */ var _functions_xtract_tonality__WEBPACK_IMPORTED_MODULE_41__ = __webpack_require__(/*! ./functions/xtract_tonality */ "./modules/functions/xtract_tonality.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_tonality", function() { return _functions_xtract_tonality__WEBPACK_IMPORTED_MODULE_41__["xtract_tonality"]; });

/* harmony import */ var _functions_xtract_crest__WEBPACK_IMPORTED_MODULE_42__ = __webpack_require__(/*! ./functions/xtract_crest */ "./modules/functions/xtract_crest.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_crest", function() { return _functions_xtract_crest__WEBPACK_IMPORTED_MODULE_42__["xtract_crest"]; });

/* harmony import */ var _functions_xtract_noisiness__WEBPACK_IMPORTED_MODULE_43__ = __webpack_require__(/*! ./functions/xtract_noisiness */ "./modules/functions/xtract_noisiness.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_noisiness", function() { return _functions_xtract_noisiness__WEBPACK_IMPORTED_MODULE_43__["xtract_noisiness"]; });

/* harmony import */ var _functions_xtract_rms_amplitude__WEBPACK_IMPORTED_MODULE_44__ = __webpack_require__(/*! ./functions/xtract_rms_amplitude */ "./modules/functions/xtract_rms_amplitude.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_rms_amplitude", function() { return _functions_xtract_rms_amplitude__WEBPACK_IMPORTED_MODULE_44__["xtract_rms_amplitude"]; });

/* harmony import */ var _functions_xtract_spectral_inharmonicity__WEBPACK_IMPORTED_MODULE_45__ = __webpack_require__(/*! ./functions/xtract_spectral_inharmonicity */ "./modules/functions/xtract_spectral_inharmonicity.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_spectral_inharmonicity", function() { return _functions_xtract_spectral_inharmonicity__WEBPACK_IMPORTED_MODULE_45__["xtract_spectral_inharmonicity"]; });

/* harmony import */ var _functions_xtract_power__WEBPACK_IMPORTED_MODULE_46__ = __webpack_require__(/*! ./functions/xtract_power */ "./modules/functions/xtract_power.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_power", function() { return _functions_xtract_power__WEBPACK_IMPORTED_MODULE_46__["xtract_power"]; });

/* harmony import */ var _functions_xtract_odd_even_ratio__WEBPACK_IMPORTED_MODULE_47__ = __webpack_require__(/*! ./functions/xtract_odd_even_ratio */ "./modules/functions/xtract_odd_even_ratio.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_odd_even_ratio", function() { return _functions_xtract_odd_even_ratio__WEBPACK_IMPORTED_MODULE_47__["xtract_odd_even_ratio"]; });

/* harmony import */ var _functions_xtract_sharpness__WEBPACK_IMPORTED_MODULE_48__ = __webpack_require__(/*! ./functions/xtract_sharpness */ "./modules/functions/xtract_sharpness.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_sharpness", function() { return _functions_xtract_sharpness__WEBPACK_IMPORTED_MODULE_48__["xtract_sharpness"]; });

/* harmony import */ var _functions_xtract_spectral_slope__WEBPACK_IMPORTED_MODULE_49__ = __webpack_require__(/*! ./functions/xtract_spectral_slope */ "./modules/functions/xtract_spectral_slope.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_spectral_slope", function() { return _functions_xtract_spectral_slope__WEBPACK_IMPORTED_MODULE_49__["xtract_spectral_slope"]; });

/* harmony import */ var _functions_xtract_lowhigh__WEBPACK_IMPORTED_MODULE_50__ = __webpack_require__(/*! ./functions/xtract_lowhigh */ "./modules/functions/xtract_lowhigh.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_lowhigh", function() { return _functions_xtract_lowhigh__WEBPACK_IMPORTED_MODULE_50__["xtract_lowhigh"]; });

/* harmony import */ var _functions_xtract_lowest_value__WEBPACK_IMPORTED_MODULE_51__ = __webpack_require__(/*! ./functions/xtract_lowest_value */ "./modules/functions/xtract_lowest_value.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_lowest_value", function() { return _functions_xtract_lowest_value__WEBPACK_IMPORTED_MODULE_51__["xtract_lowest_value"]; });

/* harmony import */ var _functions_xtract_highest_value__WEBPACK_IMPORTED_MODULE_52__ = __webpack_require__(/*! ./functions/xtract_highest_value */ "./modules/functions/xtract_highest_value.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_highest_value", function() { return _functions_xtract_highest_value__WEBPACK_IMPORTED_MODULE_52__["xtract_highest_value"]; });

/* harmony import */ var _functions_xtract_sum__WEBPACK_IMPORTED_MODULE_53__ = __webpack_require__(/*! ./functions/xtract_sum */ "./modules/functions/xtract_sum.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_sum", function() { return _functions_xtract_sum__WEBPACK_IMPORTED_MODULE_53__["xtract_sum"]; });

/* harmony import */ var _functions_xtract_nonzero_count__WEBPACK_IMPORTED_MODULE_54__ = __webpack_require__(/*! ./functions/xtract_nonzero_count */ "./modules/functions/xtract_nonzero_count.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_nonzero_count", function() { return _functions_xtract_nonzero_count__WEBPACK_IMPORTED_MODULE_54__["xtract_nonzero_count"]; });

/* harmony import */ var _functions_xtract_hps__WEBPACK_IMPORTED_MODULE_55__ = __webpack_require__(/*! ./functions/xtract_hps */ "./modules/functions/xtract_hps.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_hps", function() { return _functions_xtract_hps__WEBPACK_IMPORTED_MODULE_55__["xtract_hps"]; });

/* harmony import */ var _functions_xtract_f0__WEBPACK_IMPORTED_MODULE_56__ = __webpack_require__(/*! ./functions/xtract_f0 */ "./modules/functions/xtract_f0.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_f0", function() { return _functions_xtract_f0__WEBPACK_IMPORTED_MODULE_56__["xtract_f0"]; });

/* harmony import */ var _functions_xtract_failsafe_f0__WEBPACK_IMPORTED_MODULE_57__ = __webpack_require__(/*! ./functions/xtract_failsafe_f0 */ "./modules/functions/xtract_failsafe_f0.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_failsafe_f0", function() { return _functions_xtract_failsafe_f0__WEBPACK_IMPORTED_MODULE_57__["xtract_failsafe_f0"]; });

/* harmony import */ var _functions_xtract_wavelet_f0__WEBPACK_IMPORTED_MODULE_58__ = __webpack_require__(/*! ./functions/xtract_wavelet_f0 */ "./modules/functions/xtract_wavelet_f0.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_wavelet_f0", function() { return _functions_xtract_wavelet_f0__WEBPACK_IMPORTED_MODULE_58__["xtract_wavelet_f0"]; });

/* harmony import */ var _functions_xtract_midicent__WEBPACK_IMPORTED_MODULE_59__ = __webpack_require__(/*! ./functions/xtract_midicent */ "./modules/functions/xtract_midicent.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_midicent", function() { return _functions_xtract_midicent__WEBPACK_IMPORTED_MODULE_59__["xtract_midicent"]; });

/* harmony import */ var _functions_xtract_spectral_fundamental__WEBPACK_IMPORTED_MODULE_60__ = __webpack_require__(/*! ./functions/xtract_spectral_fundamental */ "./modules/functions/xtract_spectral_fundamental.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_spectral_fundamental", function() { return _functions_xtract_spectral_fundamental__WEBPACK_IMPORTED_MODULE_60__["xtract_spectral_fundamental"]; });

/* harmony import */ var _functions_xtract_energy__WEBPACK_IMPORTED_MODULE_61__ = __webpack_require__(/*! ./functions/xtract_energy */ "./modules/functions/xtract_energy.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_energy", function() { return _functions_xtract_energy__WEBPACK_IMPORTED_MODULE_61__["xtract_energy"]; });

/* harmony import */ var _functions_xtract_spectrum__WEBPACK_IMPORTED_MODULE_62__ = __webpack_require__(/*! ./functions/xtract_spectrum */ "./modules/functions/xtract_spectrum.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_spectrum", function() { return _functions_xtract_spectrum__WEBPACK_IMPORTED_MODULE_62__["xtract_spectrum"]; });

/* harmony import */ var _functions_xtract_complex_spectrum__WEBPACK_IMPORTED_MODULE_63__ = __webpack_require__(/*! ./functions/xtract_complex_spectrum */ "./modules/functions/xtract_complex_spectrum.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_complex_spectrum", function() { return _functions_xtract_complex_spectrum__WEBPACK_IMPORTED_MODULE_63__["xtract_complex_spectrum"]; });

/* harmony import */ var _functions_xtract_mfcc__WEBPACK_IMPORTED_MODULE_64__ = __webpack_require__(/*! ./functions/xtract_mfcc */ "./modules/functions/xtract_mfcc.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_mfcc", function() { return _functions_xtract_mfcc__WEBPACK_IMPORTED_MODULE_64__["xtract_mfcc"]; });

/* harmony import */ var _functions_xtract_dct__WEBPACK_IMPORTED_MODULE_65__ = __webpack_require__(/*! ./functions/xtract_dct */ "./modules/functions/xtract_dct.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_dct", function() { return _functions_xtract_dct__WEBPACK_IMPORTED_MODULE_65__["xtract_dct"]; });

/* harmony import */ var _functions_xtract_dct_2__WEBPACK_IMPORTED_MODULE_66__ = __webpack_require__(/*! ./functions/xtract_dct_2 */ "./modules/functions/xtract_dct_2.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_dct_2", function() { return _functions_xtract_dct_2__WEBPACK_IMPORTED_MODULE_66__["xtract_dct_2"]; });

/* harmony import */ var _functions_xtract_autocorrelation__WEBPACK_IMPORTED_MODULE_67__ = __webpack_require__(/*! ./functions/xtract_autocorrelation */ "./modules/functions/xtract_autocorrelation.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_autocorrelation", function() { return _functions_xtract_autocorrelation__WEBPACK_IMPORTED_MODULE_67__["xtract_autocorrelation"]; });

/* harmony import */ var _functions_xtract_amdf__WEBPACK_IMPORTED_MODULE_68__ = __webpack_require__(/*! ./functions/xtract_amdf */ "./modules/functions/xtract_amdf.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_amdf", function() { return _functions_xtract_amdf__WEBPACK_IMPORTED_MODULE_68__["xtract_amdf"]; });

/* harmony import */ var _functions_xtract_asdf__WEBPACK_IMPORTED_MODULE_69__ = __webpack_require__(/*! ./functions/xtract_asdf */ "./modules/functions/xtract_asdf.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_asdf", function() { return _functions_xtract_asdf__WEBPACK_IMPORTED_MODULE_69__["xtract_asdf"]; });

/* harmony import */ var _functions_xtract_bark_coefficients__WEBPACK_IMPORTED_MODULE_70__ = __webpack_require__(/*! ./functions/xtract_bark_coefficients */ "./modules/functions/xtract_bark_coefficients.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_bark_coefficients", function() { return _functions_xtract_bark_coefficients__WEBPACK_IMPORTED_MODULE_70__["xtract_bark_coefficients"]; });

/* harmony import */ var _functions_xtract_peak_spectrum__WEBPACK_IMPORTED_MODULE_71__ = __webpack_require__(/*! ./functions/xtract_peak_spectrum */ "./modules/functions/xtract_peak_spectrum.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_peak_spectrum", function() { return _functions_xtract_peak_spectrum__WEBPACK_IMPORTED_MODULE_71__["xtract_peak_spectrum"]; });

/* harmony import */ var _functions_xtract_harmonic_spectrum__WEBPACK_IMPORTED_MODULE_72__ = __webpack_require__(/*! ./functions/xtract_harmonic_spectrum */ "./modules/functions/xtract_harmonic_spectrum.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_harmonic_spectrum", function() { return _functions_xtract_harmonic_spectrum__WEBPACK_IMPORTED_MODULE_72__["xtract_harmonic_spectrum"]; });

/* harmony import */ var _functions_xtract_lpc__WEBPACK_IMPORTED_MODULE_73__ = __webpack_require__(/*! ./functions/xtract_lpc */ "./modules/functions/xtract_lpc.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_lpc", function() { return _functions_xtract_lpc__WEBPACK_IMPORTED_MODULE_73__["xtract_lpc"]; });

/* harmony import */ var _functions_xtract_lpcc__WEBPACK_IMPORTED_MODULE_74__ = __webpack_require__(/*! ./functions/xtract_lpcc */ "./modules/functions/xtract_lpcc.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_lpcc", function() { return _functions_xtract_lpcc__WEBPACK_IMPORTED_MODULE_74__["xtract_lpcc"]; });

/* harmony import */ var _functions_xtract_pcp__WEBPACK_IMPORTED_MODULE_75__ = __webpack_require__(/*! ./functions/xtract_pcp */ "./modules/functions/xtract_pcp.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_pcp", function() { return _functions_xtract_pcp__WEBPACK_IMPORTED_MODULE_75__["xtract_pcp"]; });

/* harmony import */ var _functions_xtract_yin__WEBPACK_IMPORTED_MODULE_76__ = __webpack_require__(/*! ./functions/xtract_yin */ "./modules/functions/xtract_yin.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_yin", function() { return _functions_xtract_yin__WEBPACK_IMPORTED_MODULE_76__["xtract_yin"]; });

/* harmony import */ var _functions_xtract_onset__WEBPACK_IMPORTED_MODULE_77__ = __webpack_require__(/*! ./functions/xtract_onset */ "./modules/functions/xtract_onset.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_onset", function() { return _functions_xtract_onset__WEBPACK_IMPORTED_MODULE_77__["xtract_onset"]; });

/* harmony import */ var _functions_xtract_resample__WEBPACK_IMPORTED_MODULE_78__ = __webpack_require__(/*! ./functions/xtract_resample */ "./modules/functions/xtract_resample.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_resample", function() { return _functions_xtract_resample__WEBPACK_IMPORTED_MODULE_78__["xtract_resample"]; });

/* harmony import */ var _functions_xtract_init_dft__WEBPACK_IMPORTED_MODULE_79__ = __webpack_require__(/*! ./functions/xtract_init_dft */ "./modules/functions/xtract_init_dft.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_init_dft", function() { return _functions_xtract_init_dft__WEBPACK_IMPORTED_MODULE_79__["xtract_init_dft"]; });

/* harmony import */ var _functions_xtract_init_dct__WEBPACK_IMPORTED_MODULE_80__ = __webpack_require__(/*! ./functions/xtract_init_dct */ "./modules/functions/xtract_init_dct.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_init_dct", function() { return _functions_xtract_init_dct__WEBPACK_IMPORTED_MODULE_80__["xtract_init_dct"]; });

/* harmony import */ var _functions_xtract_init_mfcc__WEBPACK_IMPORTED_MODULE_81__ = __webpack_require__(/*! ./functions/xtract_init_mfcc */ "./modules/functions/xtract_init_mfcc.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_init_mfcc", function() { return _functions_xtract_init_mfcc__WEBPACK_IMPORTED_MODULE_81__["xtract_init_mfcc"]; });

/* harmony import */ var _functions_xtract_init_wavelet__WEBPACK_IMPORTED_MODULE_82__ = __webpack_require__(/*! ./functions/xtract_init_wavelet */ "./modules/functions/xtract_init_wavelet.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_init_wavelet", function() { return _functions_xtract_init_wavelet__WEBPACK_IMPORTED_MODULE_82__["xtract_init_wavelet"]; });

/* harmony import */ var _functions_xtract_init_pcp__WEBPACK_IMPORTED_MODULE_83__ = __webpack_require__(/*! ./functions/xtract_init_pcp */ "./modules/functions/xtract_init_pcp.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_init_pcp", function() { return _functions_xtract_init_pcp__WEBPACK_IMPORTED_MODULE_83__["xtract_init_pcp"]; });

/* harmony import */ var _functions_xtract_init_bark__WEBPACK_IMPORTED_MODULE_84__ = __webpack_require__(/*! ./functions/xtract_init_bark */ "./modules/functions/xtract_init_bark.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_init_bark", function() { return _functions_xtract_init_bark__WEBPACK_IMPORTED_MODULE_84__["xtract_init_bark"]; });

/* harmony import */ var _functions_xtract_init_chroma__WEBPACK_IMPORTED_MODULE_85__ = __webpack_require__(/*! ./functions/xtract_init_chroma */ "./modules/functions/xtract_init_chroma.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_init_chroma", function() { return _functions_xtract_init_chroma__WEBPACK_IMPORTED_MODULE_85__["xtract_init_chroma"]; });

/* harmony import */ var _functions_xtract_apply_window__WEBPACK_IMPORTED_MODULE_86__ = __webpack_require__(/*! ./functions/xtract_apply_window */ "./modules/functions/xtract_apply_window.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_apply_window", function() { return _functions_xtract_apply_window__WEBPACK_IMPORTED_MODULE_86__["xtract_apply_window"]; });

/* harmony import */ var _functions_xtract_create_window__WEBPACK_IMPORTED_MODULE_87__ = __webpack_require__(/*! ./functions/xtract_create_window */ "./modules/functions/xtract_create_window.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_create_window", function() { return _functions_xtract_create_window__WEBPACK_IMPORTED_MODULE_87__["xtract_create_window"]; });

/* harmony import */ var _functions_xtract_chroma__WEBPACK_IMPORTED_MODULE_88__ = __webpack_require__(/*! ./functions/xtract_chroma */ "./modules/functions/xtract_chroma.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "xtract_chroma", function() { return _functions_xtract_chroma__WEBPACK_IMPORTED_MODULE_88__["xtract_chroma"]; });

/* harmony import */ var _objects_HarmonicSpectrumData__WEBPACK_IMPORTED_MODULE_89__ = __webpack_require__(/*! ./objects/HarmonicSpectrumData */ "./modules/objects/HarmonicSpectrumData.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "HarmonicSpectrumData", function() { return _objects_HarmonicSpectrumData__WEBPACK_IMPORTED_MODULE_89__["HarmonicSpectrumData"]; });

/* harmony import */ var _objects_PeakSpectrumData__WEBPACK_IMPORTED_MODULE_90__ = __webpack_require__(/*! ./objects/PeakSpectrumData */ "./modules/objects/PeakSpectrumData.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "PeakSpectrumData", function() { return _objects_PeakSpectrumData__WEBPACK_IMPORTED_MODULE_90__["PeakSpectrumData"]; });

/* harmony import */ var _objects_SpectrumData__WEBPACK_IMPORTED_MODULE_91__ = __webpack_require__(/*! ./objects/SpectrumData */ "./modules/objects/SpectrumData.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SpectrumData", function() { return _objects_SpectrumData__WEBPACK_IMPORTED_MODULE_91__["SpectrumData"]; });

/* harmony import */ var _objects_TimeData__WEBPACK_IMPORTED_MODULE_92__ = __webpack_require__(/*! ./objects/TimeData */ "./modules/objects/TimeData.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "TimeData", function() { return _objects_TimeData__WEBPACK_IMPORTED_MODULE_92__["TimeData"]; });

































































































if (typeof AnalyserNode !== "undefined") {

    AnalyserNode.prototype.timeData = undefined;
    AnalyserNode.prototype.spectrumData = undefined;
    AnalyserNode.prototype.callbackObject = undefined;
    AnalyserNode.prototype.fooGain = undefined;
    AnalyserNode.prototype.getXtractData = function () {
        if (this.timeData === undefined || this.scpectrumData === undefined) {
            this.timeData = new _objects_TimeData__WEBPACK_IMPORTED_MODULE_92__["TimeData"](this.fftSize, this.context.sampleRate);
            this.spectrumData = new _objects_SpectrumData__WEBPACK_IMPORTED_MODULE_91__["SpectrumData"](this.frequencyBinCount, this.context.sampleRate);
        }
        var dst = new Float32Array(this.fftSize);
        var i;
        if (this.getFloatTimeDomainData) {
            this.getFloatTimeDomainData(dst);
        } else {
            var view = new Uint8Array(this.fftSize);
            this.getByteTimeDomainData(view);
            for (i = 0; i < this.fftSize; i++) {
                dst[i] = view[i];
                dst[i] = (dst[i] / 127.5) - 1;
            }
        }
        this.timeData.copyDataFrom(dst);
        this.timeData.result.spectrum = this.spectrumData;
        var LogStore = new Float32Array(this.frequencyBinCount);
        this.getFloatFrequencyData(LogStore);
        for (i = 0; i < this.frequencyBinCount; i++) {
            LogStore[i] = Math.pow(10.0, LogStore[i] / 20);
        }
        this.spectrumData.copyDataFrom(LogStore);
        return this.timeData;
    };
    AnalyserNode.prototype.previousFrame = undefined;
    AnalyserNode.prototype.previousResult = undefined;
    AnalyserNode.prototype.frameCallback = function (func, arg_this) {
        // Perform a callback on each frame
        // The function callback has the arguments (current_frame, previous_frame, previous_result)
        if (this.callbackObject === undefined) {
            this.callbackObject = this.context.createScriptProcessor(this.fftSize, 1, 1);
            this.connect(this.callbackObject);
        }
        var _func = func;
        var _arg_this = arg_this;
        var self = this;
        this.callbackObject.onaudioprocess = function (e) {
            var current_frame = self.getXtractData();
            this.previousResult = _func.call(_arg_this, current_frame, this.previousFrame, this.previousResult);
            this.previousFrame = current_frame;
            var N = e.outputBuffer.length;
            var output = new Float32Array(N);
            var result = this.previousResult;
            if (typeof this.previousResult !== "number") {
                result = 0.0;
            }
            for (var i = 0; i < N; i++) {
                output[i] = result;
            }
            e.outputBuffer.copyToChannel(output, 0, 0);
        };

        // For chrome and other efficiency browsers
        if (!this.fooGain) {
            this.fooGain = this.context.createGain();
            this.fooGain.gain.value = 0;
            this.callbackObject.connect(this.fooGain);
            this.fooGain.connect(this.context.destination);
        }
    };

    AnalyserNode.prototype.clearCallback = function () {
        this.disconnect(this.callbackObject);
        this.callbackObject.onaudioprocess = undefined;
    };

    AnalyserNode.prototype.xtractFrame = function (func, arg_this) {
        // Collect the current frame of data and perform the callback function
        func.call(arg_this, this.getXtractData());
    };
}

if (typeof AudioBuffer !== "undefined") {

    AudioBuffer.prototype.xtract_get_data_frames = function (frame_size, hop_size) {
        if (hop_size === undefined) {
            hop_size = frame_size;
        }
        (function () {
            if (!Object(_functions_xtract_assert_positive_integer__WEBPACK_IMPORTED_MODULE_2__["xtract_assert_positive_integer"])(frame_size)) {
                throw ("xtract_get_data_frames requires the frame_size to be defined, positive integer");
            }
            if (!Object(_functions_xtract_assert_positive_integer__WEBPACK_IMPORTED_MODULE_2__["xtract_assert_positive_integer"])(hop_size)) {
                throw ("xtract_get_data_frames requires the hop_size to be a positive integer");
            }
        })();
        this.frames = [];
        var N = this.length;
        var K = this.xtract_get_number_of_frames(hop_size);
        for (var c = 0; c < this.numberOfChannels; c++) {
            var data = this.getChannelData(c);
            this.frames[c] = [];
            for (var k = 0; k < K; k++) {
                var frame = new _objects_TimeData__WEBPACK_IMPORTED_MODULE_92__["TimeData"](frame_size, this.sampleRate);
                frame.copyDataFrom(data.subarray(hop_size * k, hop_size * k + frame_size));
                this.frames[c].push(frame);
                frame = undefined;
            }
            data = undefined;
        }
        return this.frames;
    };

    AudioBuffer.prototype.xtract_get_number_of_frames = function (hop_size) {
        return Object(_functions_xtract_get_number_of_frames__WEBPACK_IMPORTED_MODULE_12__["xtract_get_number_of_frames"])(this, hop_size);
    };

    AudioBuffer.prototype.xtract_get_frame = function (dst, channel, index, frame_size) {
        (function () {
            if (typeof dst !== "object" || dst.constructor !== Float32Array) {
                throw ("dst must be a Float32Array object equal in length to hop_size");
            }
            if (!Object(_functions_xtract_assert_positive_integer__WEBPACK_IMPORTED_MODULE_2__["xtract_assert_positive_integer"])(channel)) {
                throw ("xtract_get_frame requires the channel to be an integer value");
            }
            if (!Object(_functions_xtract_assert_positive_integer__WEBPACK_IMPORTED_MODULE_2__["xtract_assert_positive_integer"])(index)) {
                throw ("xtract_get_frame requires the index to be an integer value");
            }
            if (!Object(_functions_xtract_assert_positive_integer__WEBPACK_IMPORTED_MODULE_2__["xtract_assert_positive_integer"])(frame_size)) {
                throw ("xtract_get_frame requires the frame_size to be defined, positive integer");
            }
        })();
        if (channel < 0 || channel > this.numberOfChannels) {
            throw ("channel number " + channel + " out of bounds");
        }
        var K = this.xtract_get_number_of_frames(frame_size);
        if (index < 0 || index >= K) {
            throw ("index number " + index + " out of bounds");
        }
        return this.copyFromChannel(dst, channel, frame_size * index);
    };

    AudioBuffer.prototype.xtract_process_frame_data = function () {
        throw ("AudioBuffer::xtract_process_frame_data has been deprecated");
    };
}





/***/ }),

/***/ "./modules/objects/CommonMemory.js":
/*!*****************************************!*\
  !*** ./modules/objects/CommonMemory.js ***!
  \*****************************************/
/*! exports provided: createDctCoefficients, createMfccCoefficients, createBarkCoefficients, createChromaCoefficients */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createDctCoefficients", function() { return createDctCoefficients; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createMfccCoefficients", function() { return createMfccCoefficients; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createBarkCoefficients", function() { return createBarkCoefficients; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createChromaCoefficients", function() { return createChromaCoefficients; });
/* harmony import */ var _functions_xtract_init_dct__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../functions/xtract_init_dct */ "./modules/functions/xtract_init_dct.js");
/* harmony import */ var _functions_xtract_init_mfcc__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../functions/xtract_init_mfcc */ "./modules/functions/xtract_init_mfcc.js");
/* harmony import */ var _functions_xtract_init_bark__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../functions/xtract_init_bark */ "./modules/functions/xtract_init_bark.js");
/* harmony import */ var _functions_xtract_init_chroma__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../functions/xtract_init_chroma */ "./modules/functions/xtract_init_chroma.js");
/// <reference path="../../typings/objects/CommonMemory.d.ts" />






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
    parent: undefined,
    store: [],
    createCoefficients: function (N) {
        var match = searchMapProperties(this.store, {
            N: N
        });
        if (!match) {
            match = {
                N: N,
                data: Object(_functions_xtract_init_dct__WEBPACK_IMPORTED_MODULE_0__["xtract_init_dct"])(N)
            };
            this.store.push(match);
        }
        return match.data;
    }
};

var mfcc_map = {
    parent: undefined,
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
            match.data = Object(_functions_xtract_init_mfcc__WEBPACK_IMPORTED_MODULE_1__["xtract_init_mfcc"])(N, nyquist, style, freq_min, freq_max, freq_bands);
            this.store.push(match);
        }
        return match.data;
    }
};

var bark_map = {
    parent: undefined,
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
            match.data = Object(_functions_xtract_init_bark__WEBPACK_IMPORTED_MODULE_2__["xtract_init_bark"])(N, sampleRate, numBands);
            this.store.push(match);
        }
        return match.data;
    }
};


var chroma_map = {
    parent: undefined,
    store: [],
    createCoefficients: function (N, sampleRate, nbins, A440, f_ctr, octwidth) {
        var search = {
            N: N,
            sampleRate: sampleRate,
            nbins: nbins,
            A440: A440,
            f_ctr: f_ctr,
            octwidth: octwidth
        };
        var match = searchMapProperties(this.store, search);
        if (!match) {
            match = search;
            match.data = Object(_functions_xtract_init_chroma__WEBPACK_IMPORTED_MODULE_3__["xtract_init_chroma"])(N, sampleRate, nbins, A440, f_ctr, octwidth);
            this.store.push(match);
        }
        return match.data;
    }
};

function createDctCoefficients(N) {
    return dct_map.createCoefficients(N);
}

function createMfccCoefficients(N, nyquist, style, freq_min, freq_max, freq_bands) {
    return mfcc_map.createCoefficients(N, nyquist, style, freq_min, freq_max, freq_bands);
}

function createBarkCoefficients(N, sampleRate, numBands) {
    if (typeof numBands !== "number" || numBands < 0 || numBands > 26) {
        numBands = 26;
    }
    return bark_map.createCoefficients(N, sampleRate, numBands);
}

function createChromaCoefficients(N, sampleRate, nbins, A440, f_ctr, octwidth) {
    return chroma_map.createCoefficients(N, sampleRate, nbins, A440, f_ctr, octwidth);
}


/***/ }),

/***/ "./modules/objects/DataPrototype.js":
/*!******************************************!*\
  !*** ./modules/objects/DataPrototype.js ***!
  \******************************************/
/*! exports provided: DataPrototype */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataPrototype", function() { return DataPrototype; });
/* harmony import */ var _functions_xtract_array_to_JSON__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../functions/xtract_array_to_JSON */ "./modules/functions/xtract_array_to_JSON.js");
/* harmony import */ var _CommonMemory__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CommonMemory */ "./modules/objects/CommonMemory.js");
/// <reference path="../../typings/objects/DataPrototype.d.ts" />



function recursiveDelta(a, b) {
    //a and b are objects of Time/Spectrum/PeakS/HarmonicS Data
    //a and b are the .result object
    var param, delta = {};
    for (param in a) {
        if (b[param]) {
            if (typeof a[param] === "number") {
                delta[param] = a[param] - b[param];
            } else {
                delta[param] = deltaObject(a, b, param);
            }
        }
    }
    return delta;
}

function deltaObject(a, b, param) {
    if (a.result && b.result) {
        return recursiveDelta(a[param].result, b[param].result);
    } else if (a.length && b.length) {
        return deltaArray(a[param], b[param]);
    }
    return undefined;
}

function deltaArray(a, b) {
    var d;
    if (a.length === b.length) {
        d = new Float64Array(a.length);
    } else {
        d = [];
    }
    var n = 0;
    while (n < a.length && n < b.length) {
        d[n] = a[n] - b[n];
        n++;
    }
    return d;
}

class DataPrototype {
    constructor(N, sampleRate) {
        this.result = {};
        this._sampleRate = sampleRate;
        this.data = new Float64Array(N);
    }
    get sampleRate() {
        return this._sampleRate;
    }
    set sampleRate(fs) {
        this._sampleRate = fs;
    }
    clearResult() {
        this.result = {};
    }
    getData() {
        return this.data;
    }
    zeroDataRange(start, end) {
        if (this.data.fill) {
            this.data.fill(0, start, end);
        } else {
            for (var n = start; n < end; n++) {
                this.data[n] = 0;
            }
        }
        this.clearResult();
    }
    zeroData () {
        this.zeroDataRange(0, this.data.length);
    }
    copyDataFrom(src, N, offset) {
        if (typeof src !== "object" || src.length === undefined) {
            throw ("copyDataFrom requires src to be an Array or TypedArray");
        }
        if (offset === undefined) {
            offset = 0;
        }
        if (N === undefined) {
            N = Math.min(src.length, this.data.length);
        }
        N = Math.min(N + offset, this.data.length);
        for (var n = 0; n < N; n++) {
            this.data[n + offset] = src[n];
        }
        this.clearResult();
    }

    duplicate() {
        var copy = this.prototype.constructor(this.data.length, this.sampleRate);
        copy.copyDataFrom(this.data);
    }

    toJSON() {
        function lchar(str) {
            var lastchar = str[str.length - 1];
            if (lastchar !== '{' && lastchar !== ',') {
                str = str + ', ';
            }
            return str;
        }

        function getJSONString(self, p, n) {
            var str = "";
            if (typeof p === "number" && isFinite(p)) {
                str = '"' + n + '": ' + p;
            } else if (typeof p === "object") {
                if (p.toJSON) {
                    str = '"' + n + '": ' + p.toJSON(p);
                } else if (p.length) {
                    str = '"' + n + '": ' + Object(_functions_xtract_array_to_JSON__WEBPACK_IMPORTED_MODULE_0__["xtract_array_to_JSON"])(p);
                } else {
                    str = '"' + n + '": ' + self.toJSON(p);
                }
            } else {
                str = '"' + n + '": "' + p.toString() + '"';
            }
            return str;
        }
        var json = '{';
        for (var property in this.result) {
            if (this.result.hasOwnProperty(property)) {
                json = lchar(json);
                json = json + getJSONString(this, this.result[property], property);
            }
        }
        return json + '}';
    }

    computeDelta(compare) {
        this.result.delta = recursiveDelta(this.result, compare.result);
        return this.result.delta;
    }

    computeDeltaDelta(compare) {
        if (!compare.result.delta || !this.result.delta) {
            throw ("Cannot compute delta-delta without both objects having deltas");
        }
        this.result.delta.delta = recursiveDelta(this.result.delta, compare.result.delta);
        return this.result.delta.delta;
    }

    createDctCoefficients(N) {
        return Object(_CommonMemory__WEBPACK_IMPORTED_MODULE_1__["createDctCoefficients"])(Number(N));
    }

    createMfccCoefficients(N, nyquist, style, freq_min, freq_max, freq_bands) {
        N = Number(N);
        nyquist = Number(nyquist);
        freq_min = Number(freq_min);
        freq_max = Number(freq_max);
        freq_bands = Number(freq_bands);
        return Object(_CommonMemory__WEBPACK_IMPORTED_MODULE_1__["createMfccCoefficients"])(N, nyquist, style, freq_min, freq_max, freq_bands);
    }

    createBarkCoefficients(N, sampleRate, numBands) {
        N = Number(N);
        sampleRate = Number(sampleRate);
        numBands = Number(numBands);
        return Object(_CommonMemory__WEBPACK_IMPORTED_MODULE_1__["createBarkCoefficients"])(N, sampleRate, numBands);
    }

    createChromaCoefficients(N, sampleRate, nbins, A440, f_ctr, octwidth) {
        N = Number(N);
        sampleRate = Number(sampleRate);
        nbins = Number(nbins);
        A440 = Number(A440);
        f_ctr = Number(f_ctr);
        octwidth = Number(octwidth);
        return Object(_CommonMemory__WEBPACK_IMPORTED_MODULE_1__["createChromaCoefficients"])(N, sampleRate, nbins, A440, f_ctr, octwidth);
    }
}


/***/ }),

/***/ "./modules/objects/HarmonicSpectrumData.js":
/*!*************************************************!*\
  !*** ./modules/objects/HarmonicSpectrumData.js ***!
  \*************************************************/
/*! exports provided: HarmonicSpectrumData */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HarmonicSpectrumData", function() { return HarmonicSpectrumData; });
/* harmony import */ var _PeakSpectrumData__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PeakSpectrumData */ "./modules/objects/PeakSpectrumData.js");
/* harmony import */ var _functions_xtract_odd_even_ratio__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../functions/xtract_odd_even_ratio */ "./modules/functions/xtract_odd_even_ratio.js");
/* harmony import */ var _functions_xtract_noisiness__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../functions/xtract_noisiness */ "./modules/functions/xtract_noisiness.js");
/// <reference path="../../typings/objects/PeakSpectrumData.d.ts" />




class HarmonicSpectrumData extends _PeakSpectrumData__WEBPACK_IMPORTED_MODULE_0__["PeakSpectrumData"] {
    odd_even_ratio () {
        if (this.result.odd_even_ratio === undefined) {
            if (this.f0 === undefined) {
                this.spectral_fundamental(this.data, this.sampleRate);
            }
            this.result.odd_even_ratio = Object(_functions_xtract_odd_even_ratio__WEBPACK_IMPORTED_MODULE_1__["xtract_odd_even_ratio"])(this.data, this.f0);
        }
        return this.result.odd_even_ratio;
    }

    noisiness() {
        if (parent.constructor !== _PeakSpectrumData__WEBPACK_IMPORTED_MODULE_0__["PeakSpectrumData"]) {
            this.result.noisiness = null;
        } else {
            this.result.noisiness = Object(_functions_xtract_noisiness__WEBPACK_IMPORTED_MODULE_2__["xtract_noisiness"])(this.nonzero_count(), parent.nonzero_count());
        }
        return this.result.noisiness;
    }
}

HarmonicSpectrumData.prototype.features = _PeakSpectrumData__WEBPACK_IMPORTED_MODULE_0__["PeakSpectrumData"].prototype.features.concat([
    {
        name: "Odd Even Ration",
        function: "odd_even_ratio",
        sub_features: [],
        parameters: [],
        returns: "number"
    },
    {
        name: "Noisiness",
        function: "noisiness",
        sub_features: [],
        parameters: [],
        returns: "number"
    }
]);


/***/ }),

/***/ "./modules/objects/PeakSpectrumData.js":
/*!*********************************************!*\
  !*** ./modules/objects/PeakSpectrumData.js ***!
  \*********************************************/
/*! exports provided: PeakSpectrumData */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PeakSpectrumData", function() { return PeakSpectrumData; });
/* harmony import */ var _SpectrumData__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SpectrumData */ "./modules/objects/SpectrumData.js");
/* harmony import */ var _HarmonicSpectrumData__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./HarmonicSpectrumData */ "./modules/objects/HarmonicSpectrumData.js");
/* harmony import */ var _functions_xtract_spectral_inharmonicity__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../functions/xtract_spectral_inharmonicity */ "./modules/functions/xtract_spectral_inharmonicity.js");
/* harmony import */ var _functions_xtract_harmonic_spectrum__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../functions/xtract_harmonic_spectrum */ "./modules/functions/xtract_harmonic_spectrum.js");
/// <reference path="../../typings/objects/PeakSpectrumData.d.ts" />






class PeakSpectrumData extends _SpectrumData__WEBPACK_IMPORTED_MODULE_0__["SpectrumData"] {
    spectral_inharmonicity() {
        if (this.result.spectral_inharmonicity === undefined) {
            this.result.spectral_inharmonicity = Object(_functions_xtract_spectral_inharmonicity__WEBPACK_IMPORTED_MODULE_2__["xtract_spectral_inharmonicity"])(this.data, this.sampleRate);
        }
        return this.result.spectral_inharmonicity;
    }

    harmonic_spectrum(threshold) {
        if (this.result.harmonic_spectrum === undefined) {
            if (this.f0 === undefined) {
                this.spectral_fundamental(this.data, this.sampleRate);
            }
            this.result.harmonic_spectrum = new _HarmonicSpectrumData__WEBPACK_IMPORTED_MODULE_1__["HarmonicSpectrumData"](this.length, this.sampleRate, this);
            var hs = Object(_functions_xtract_harmonic_spectrum__WEBPACK_IMPORTED_MODULE_3__["xtract_harmonic_spectrum"])(this.data, this.f0, threshold);
            this.result.harmonic_spectrum.copyDataFrom(hs.subarray(0, this.length));
        }
        return this.result.harmonic_spectrum;
    }
}

PeakSpectrumData.prototype.features = _SpectrumData__WEBPACK_IMPORTED_MODULE_0__["SpectrumData"].prototype.features.concat([
    {
        name: "Spectral Inharmonicity",
        function: "spectral_inharmonicity",
        sub_features: ["f0"],
        parameters: [],
        returns: "number"
}, {
        name: "Harmonic Spectrum",
        function: "harmonic_spectrum",
        sub_features: [],
        parameters: [{
            name: "Threshold",
            unit: "",
            type: "number",
            minimum: 0,
            maximum: 100,
            default: 30
    }],
        returns: "HarmonicSpectrumData"
}]);


/***/ }),

/***/ "./modules/objects/SpectrumData.js":
/*!*****************************************!*\
  !*** ./modules/objects/SpectrumData.js ***!
  \*****************************************/
/*! exports provided: SpectrumData */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpectrumData", function() { return SpectrumData; });
/* harmony import */ var _DataPrototype__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DataPrototype */ "./modules/objects/DataPrototype.js");
/* harmony import */ var _PeakSpectrumData__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PeakSpectrumData */ "./modules/objects/PeakSpectrumData.js");
/* harmony import */ var _functions_xtract_init_bark__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../functions/xtract_init_bark */ "./modules/functions/xtract_init_bark.js");
/* harmony import */ var _functions_xtract_array_min__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../functions/xtract_array_min */ "./modules/functions/xtract_array_min.js");
/* harmony import */ var _functions_xtract_array_max__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../functions/xtract_array_max */ "./modules/functions/xtract_array_max.js");
/* harmony import */ var _functions_xtract_array_sum__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../functions/xtract_array_sum */ "./modules/functions/xtract_array_sum.js");
/* harmony import */ var _functions_xtract_spectral_centroid__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../functions/xtract_spectral_centroid */ "./modules/functions/xtract_spectral_centroid.js");
/* harmony import */ var _functions_xtract_spectral_mean__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../functions/xtract_spectral_mean */ "./modules/functions/xtract_spectral_mean.js");
/* harmony import */ var _functions_xtract_spectral_variance__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../functions/xtract_spectral_variance */ "./modules/functions/xtract_spectral_variance.js");
/* harmony import */ var _functions_xtract_spectral_spread__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../functions/xtract_spectral_spread */ "./modules/functions/xtract_spectral_spread.js");
/* harmony import */ var _functions_xtract_spectral_standard_deviation__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../functions/xtract_spectral_standard_deviation */ "./modules/functions/xtract_spectral_standard_deviation.js");
/* harmony import */ var _functions_xtract_spectral_skewness__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../functions/xtract_spectral_skewness */ "./modules/functions/xtract_spectral_skewness.js");
/* harmony import */ var _functions_xtract_spectral_kurtosis__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../functions/xtract_spectral_kurtosis */ "./modules/functions/xtract_spectral_kurtosis.js");
/* harmony import */ var _functions_xtract_irregularity_k__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../functions/xtract_irregularity_k */ "./modules/functions/xtract_irregularity_k.js");
/* harmony import */ var _functions_xtract_irregularity_j__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../functions/xtract_irregularity_j */ "./modules/functions/xtract_irregularity_j.js");
/* harmony import */ var _functions_xtract_tristimulus__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../functions/xtract_tristimulus */ "./modules/functions/xtract_tristimulus.js");
/* harmony import */ var _functions_xtract_smoothness__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../functions/xtract_smoothness */ "./modules/functions/xtract_smoothness.js");
/* harmony import */ var _functions_xtract_rolloff__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../functions/xtract_rolloff */ "./modules/functions/xtract_rolloff.js");
/* harmony import */ var _functions_xtract_loudness__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../functions/xtract_loudness */ "./modules/functions/xtract_loudness.js");
/* harmony import */ var _functions_xtract_sharpness__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../functions/xtract_sharpness */ "./modules/functions/xtract_sharpness.js");
/* harmony import */ var _functions_xtract_flatness__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../functions/xtract_flatness */ "./modules/functions/xtract_flatness.js");
/* harmony import */ var _functions_xtract_flatness_db__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../functions/xtract_flatness_db */ "./modules/functions/xtract_flatness_db.js");
/* harmony import */ var _functions_xtract_tonality__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ../functions/xtract_tonality */ "./modules/functions/xtract_tonality.js");
/* harmony import */ var _functions_xtract_crest__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ../functions/xtract_crest */ "./modules/functions/xtract_crest.js");
/* harmony import */ var _functions_xtract_spectral_slope__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ../functions/xtract_spectral_slope */ "./modules/functions/xtract_spectral_slope.js");
/* harmony import */ var _functions_xtract_spectral_fundamental__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ../functions/xtract_spectral_fundamental */ "./modules/functions/xtract_spectral_fundamental.js");
/* harmony import */ var _functions_xtract_nonzero_count__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ../functions/xtract_nonzero_count */ "./modules/functions/xtract_nonzero_count.js");
/* harmony import */ var _functions_xtract_hps__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ../functions/xtract_hps */ "./modules/functions/xtract_hps.js");
/* harmony import */ var _functions_xtract_mfcc__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ../functions/xtract_mfcc */ "./modules/functions/xtract_mfcc.js");
/* harmony import */ var _functions_xtract_dct_2__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ../functions/xtract_dct_2 */ "./modules/functions/xtract_dct_2.js");
/* harmony import */ var _functions_xtract_bark_coefficients__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ../functions/xtract_bark_coefficients */ "./modules/functions/xtract_bark_coefficients.js");
/* harmony import */ var _functions_xtract_chroma__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ../functions/xtract_chroma */ "./modules/functions/xtract_chroma.js");
/* harmony import */ var _functions_xtract_peak_spectrum__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! ../functions/xtract_peak_spectrum */ "./modules/functions/xtract_peak_spectrum.js");
/// <reference path="../../typings/objects/SpectrumData.d.ts" />


































class SpectrumData extends _DataPrototype__WEBPACK_IMPORTED_MODULE_0__["DataPrototype"] {
    constructor(N, sampleRate, parent) {
        if (N === undefined || N <= 0) {
            throw ("SpectrumData constructor requires N to be a defined, whole number");
        }
        if (sampleRate === undefined) {
            sampleRate = Math.PI;
        }
        super(2*N, sampleRate);
        this._amps = this.data.subarray(0, N);
        this._freqs = this.data.subarray(N, 2 * N);
        this._length = N;
        this._f0 = undefined;
        this._mfcc = undefined;
        this._bark = undefined;
        this._dct = undefined;
        this._chroma = undefined;

        this.computeFrequencies();
    }
    computeFrequencies () {
        for (let i = 0; i < this._length; i++) {
            this._freqs[i] = (i / this._length) * (this.sampleRate / 2);
        }
    }
    get sampleRate() {
        return this._sampleRate;
    }
    set sampleRate(fs) {
        if (this._sampleRate === Math.PI) {
            this._sampleRate = fs;
            this.computeFrequencies();
            if (this._bark !== undefined) {
                this._bark = Object(_functions_xtract_init_bark__WEBPACK_IMPORTED_MODULE_2__["xtract_init_bark"])(this._length, this._sampleRate );
            }

        } else {
            throw ("Cannot set one-time variable");
        }
    }

    get f0() {
        return this._f0;
    }

    set f0(f0) {
        if (typeof f0 === "number") {
            this._f0 = f0;
        }
    }

    get length() {
        return this._length;
    }

    init_mfcc(num_bands, freq_min, freq_max, style) {
        this._mfcc = this.createMfccCoefficients(this._length, this.sampleRate * 0.5, style, freq_min, freq_max, num_bands);
        this.result.mfcc = undefined;
        return this._mfcc;
    }

    init_bark(numBands) {
        if (typeof numBands !== "number" || numBands < 0 || numBands > 26) {
            numBands = 26;
        }
        this._bark = this.createBarkCoefficients(this._length, this._Fs, numBands);
        return this._bark;
    }

    init_chroma(nbins, A440, f_ctr, octwidth) {
        if (typeof nbins !== "number" || nbins <= 1) {
            nbins = 12;
        }
        if (typeof A440 !== "number" || A440 <= 27.5) {
               A440 = 440;
        }
        if (typeof f_ctr !== "number") {
               f_ctr = 1000;
        }
        if (typeof octwidth !== "number") {
               octwidth = 1;
        }
        this._chroma = this.createChromaCoefficients(this._length, this._Fs, nbins, A440, f_ctr, octwidth);
        this.result.chroma = undefined;
        return this._chroma;
    }

    minimum() {
        if (this.result.minimum === undefined) {
            this.result.minimum = Object(_functions_xtract_array_min__WEBPACK_IMPORTED_MODULE_3__["xtract_array_min"])(this._amps);
        }
        return this.result.minimum;
    }

    maximum() {
        if (this.result.maximum === undefined) {
            this.result.maximum = Object(_functions_xtract_array_max__WEBPACK_IMPORTED_MODULE_4__["xtract_array_max"])(this._amps);
        }
        return this.result.maximum;
    }

    sum() {
        if (this.result.sum === undefined) {
            this.result.sum = Object(_functions_xtract_array_sum__WEBPACK_IMPORTED_MODULE_5__["xtract_array_sum"])(this._amps);
        }
        return this.result.sum;
    }

    spectral_centroid() {
        if (this.result.spectral_centroid === undefined) {
            this.result.spectral_centroid = Object(_functions_xtract_spectral_centroid__WEBPACK_IMPORTED_MODULE_6__["xtract_spectral_centroid"])(this.data);
        }
        return this.result.spectral_centroid;
    }

    spectral_mean () {
        if (this.result.spectral_mean === undefined) {
            this.result.spectral_mean = Object(_functions_xtract_spectral_mean__WEBPACK_IMPORTED_MODULE_7__["xtract_spectral_mean"])(this.data);
        }
        return this.result.spectral_mean;
    }

    spectral_variance () {
        if (this.result.spectral_variance === undefined) {
            this.result.spectral_variance = Object(_functions_xtract_spectral_variance__WEBPACK_IMPORTED_MODULE_8__["xtract_spectral_variance"])(this.data, this.spectral_centroid());
        }
        return this.result.spectral_variance;
    }

    spectral_spread() {
        if (this.result.spectral_spread === undefined) {
            this.result.spectral_spread = Object(_functions_xtract_spectral_spread__WEBPACK_IMPORTED_MODULE_9__["xtract_spectral_spread"])(this.data, this.spectral_centroid());
        }
        return this.result.spectral_spread;
    }

    spectral_standard_deviation() {
        if (this.result.spectral_standard_deviation === undefined) {
            this.result.spectral_standard_deviation = Object(_functions_xtract_spectral_standard_deviation__WEBPACK_IMPORTED_MODULE_10__["xtract_spectral_standard_deviation"])(this.data, this.spectral_variance());
        }
        return this.result.spectral_standard_deviation;
    }

    spectral_skewness() {
        if (this.result.spectral_skewness === undefined) {
            this.result.spectral_skewness = Object(_functions_xtract_spectral_skewness__WEBPACK_IMPORTED_MODULE_11__["xtract_spectral_skewness"])(this.data, this.spectral_centroid(), this.spectral_standard_deviation());
        }
        return this.result.spectral_skewness;
    }

    spectral_kurtosis() {
        if (this.result.spectral_kurtosis === undefined) {
            this.result.spectral_kurtosis = Object(_functions_xtract_spectral_kurtosis__WEBPACK_IMPORTED_MODULE_12__["xtract_spectral_kurtosis"])(this.data, this.spectral_centroid(), this.spectral_standard_deviation());
        }
        return this.result.spectral_kurtosis;
    }

    irregularity_k () {
        if (this.result.irregularity_k === undefined) {
            this.result.irregularity_k = Object(_functions_xtract_irregularity_k__WEBPACK_IMPORTED_MODULE_13__["xtract_irregularity_k"])(this.data);
        }
        return this.result.irregularity_k;
    }

    irregularity_j () {
        if (this.result.irregularity_j === undefined) {
            this.result.irregularity_j = Object(_functions_xtract_irregularity_j__WEBPACK_IMPORTED_MODULE_14__["xtract_irregularity_j"])(this.data);
        }
        return this.result.irregularity_j;
    }

    tristimulus_1 () {
        if (this._f0 === undefined) {
            this.spectral_fundamental();
        }
        if (this.result.tristimulus_1 === undefined) {
            this.result.tristimulus_1 = Object(_functions_xtract_tristimulus__WEBPACK_IMPORTED_MODULE_15__["xtract_tristimulus_1"])(this.data, this._f0);
        }
        return this.result.tristimulus_1;
    }
    tristimulus_2 () {
        if (this._f0 === undefined) {
            this.spectral_fundamental();
        }
        if (this.result.tristimulus_2 === undefined) {
            this.result.tristimulus_2 = Object(_functions_xtract_tristimulus__WEBPACK_IMPORTED_MODULE_15__["xtract_tristimulus_2"])(this.data, this._f0);
        }
        return this.result.tristimulus_2;
    }
    tristimulus_3 () {
        if (this._f0 === undefined) {
            this.spectral_fundamental();
        }
        if (this.result.tristimulus_3 === undefined) {
            this.result.tristimulus_3 = Object(_functions_xtract_tristimulus__WEBPACK_IMPORTED_MODULE_15__["xtract_tristimulus_3"])(this.data, this._f0);
        }
        return this.result.tristimulus_3;
    }

    smoothness() {
        if (this.result.smoothness === undefined) {
            this.result.smoothness = Object(_functions_xtract_smoothness__WEBPACK_IMPORTED_MODULE_16__["xtract_smoothness"])(this.data);
        }
        return this.result.smoothness;
    }

    rolloff(threshold) {
        if (this.result.rolloff === undefined) {
            this.result.rolloff = Object(_functions_xtract_rolloff__WEBPACK_IMPORTED_MODULE_17__["xtract_rolloff"])(this.data, this.sampleRate, threshold);
        }
        return this.result.rolloff;
    }

    loudness() {
        if (this.result.loudness === undefined) {
            this.result.loudness = Object(_functions_xtract_loudness__WEBPACK_IMPORTED_MODULE_18__["xtract_loudness"])(this.bark_coefficients());
        }
        return this.result.loudness;
    }

    sharpness () {
        if (this.result.sharpness === undefined) {
            this.result.sharpness = Object(_functions_xtract_sharpness__WEBPACK_IMPORTED_MODULE_19__["xtract_sharpness"])(this.bark_coefficients());
        }
        return this.result.sharpness;
    }

    flatness () {
        if (this.result.flatness === undefined) {
            this.result.flatness = Object(_functions_xtract_flatness__WEBPACK_IMPORTED_MODULE_20__["xtract_flatness"])(this.data);
        }
        return this.result.flatness;
    }

    flatness_db () {
        if (this.result.flatness_db === undefined) {
            this.result.flatness_db = Object(_functions_xtract_flatness_db__WEBPACK_IMPORTED_MODULE_21__["xtract_flatness_db"])(this.data, this.flatness());
        }
        return this.result.flatness_db;
    }

    tonality() {
        if (this.result.tonality === undefined) {
            this.result.tonality = Object(_functions_xtract_tonality__WEBPACK_IMPORTED_MODULE_22__["xtract_tonality"])(this.data, this.flatness_db());
        }
        return this.result.tonality;
    }

    spectral_crest_factor () {
        if (this.result.spectral_crest_factor === undefined) {
            this.result.spectral_crest_factor = Object(_functions_xtract_crest__WEBPACK_IMPORTED_MODULE_23__["xtract_crest"])(this._amps, this.maximum(), this.spectral_mean());
        }
        return this.result.spectral_crest_factor;
    }

    spectral_slope() {
        if (this.result.spectral_slope === undefined) {
            this.result.spectral_slope = Object(_functions_xtract_spectral_slope__WEBPACK_IMPORTED_MODULE_24__["xtract_spectral_slope"])(this.data);
        }
        return this.result.spectral_slope;
    }

    spectral_fundamental() {
        if (this.result.spectral_fundamental === undefined) {
            this.result.spectral_fundamental = Object(_functions_xtract_spectral_fundamental__WEBPACK_IMPORTED_MODULE_25__["xtract_spectral_fundamental"])(this.data, _Fs);
            this.f0 = this.result.spectral_fundamental;
        }
        return this.result.spectral_fundamental;
    }

    nonzero_count () {
        if (this.result.nonzero_count === undefined) {
            this.result.nonzero_count = Object(_functions_xtract_nonzero_count__WEBPACK_IMPORTED_MODULE_26__["xtract_nonzero_count"])(_amps);
        }
        return this.result.nonzero_count;
    }

    hps () {
        if (this.result.hps === undefined) {
            this.result.hps = Object(_functions_xtract_hps__WEBPACK_IMPORTED_MODULE_27__["xtract_hps"])(this.data);
        }
        return this.result.hps;
    }

    mfcc(num_bands, freq_min, freq_max) {
        if (this._mfcc === undefined) {
            if (freq_min === undefined) {
                throw ("Run init_mfcc(num_bands, freq_min, freq_max, style) first");
            } else {
                this._mfcc = this.init_mfcc(num_bands, freq_min, freq_max);
            }
        }
        if (this.result.mfcc === undefined) {
            this.result.mfcc = Object(_functions_xtract_mfcc__WEBPACK_IMPORTED_MODULE_28__["xtract_mfcc"])(this.data, this._mfcc);
        }
        return this.result.mfcc;
    }

    dct () {
        if (this._dct === undefined) {
            this._dct = this.createDctCoefficients(this._length);
        }
        if (this.result.dct === undefined) {
            this.result.dct = Object(_functions_xtract_dct_2__WEBPACK_IMPORTED_MODULE_29__["xtract_dct_2"])(this._amps,this._dct);
        }
        return this.result.dct;
    }

    bark_coefficients(num_bands) {
        if (this.result.bark_coefficients === undefined) {
            if (this._bark === undefined) {
                this._bark = this.init_bark(num_bands);
            }
            this.result.bark_coefficients = Object(_functions_xtract_bark_coefficients__WEBPACK_IMPORTED_MODULE_30__["xtract_bark_coefficients"])(this.data, this._bark);
        }
        return this.result.bark_coefficients;
    }

    chroma(nbins, A440, f_ctr, octwidth) {
        if(this.result.chroma === undefined) {
            if (this._chroma === undefined) {
                this._chroma = this.init_chroma(nbins, A440, f_ctr, octwidth);
            }
            this.result.chroma = Object(_functions_xtract_chroma__WEBPACK_IMPORTED_MODULE_31__["xtract_chroma"])(this.data, this._chroma);
        }
        return this.result.chroma;
    }

    peak_spectrum(threshold) {
        if (this.result.peak_spectrum === undefined) {
            this.result.peak_spectrum = new _PeakSpectrumData__WEBPACK_IMPORTED_MODULE_1__["PeakSpectrumData"](this._length, this.sampleRate, this);
            var ps = Object(_functions_xtract_peak_spectrum__WEBPACK_IMPORTED_MODULE_32__["xtract_peak_spectrum"])(this.data, this.sampleRate / this._length, threshold);
            this.result.peak_spectrum.copyDataFrom(ps.subarray(0, this._length));
        }
        return this.result.peak_spectrum;
    }
}

SpectrumData.prototype.features = [
    {
        name: "Minimum",
        function: "minimum",
        sub_features: [],
        parameters: [],
        returns: "number"
}, {
        name: "Maximum",
        function: "maximum",
        sub_features: [],
        parameters: [],
        returns: "number"
}, {
        name: "Sum",
        function: "sum",
        sub_features: [],
        parameters: [],
        returns: "number"
}, {
        name: "Spectral Centroid",
        function: "spectral_centroid",
        sub_features: [],
        parameters: [],
        returns: "number"
}, {
        name: "Spectral Mean",
        function: "spectral_mean",
        sub_features: [],
        parameters: [],
        returns: "number"
}, {
        name: "Spectral Variance",
        function: "spectral_variance",
        sub_features: ["spectral_mean"],
        parameters: [],
        returns: "number"
}, {
        name: "Spectral Spread",
        function: "spectral_spread",
        sub_features: ["spectral_centroid"],
        parameters: [],
        returns: "number"
}, {
        name: "Spectral Standard Deviation",
        function: "spectral_standard_deviation",
        sub_features: ["spectral_variance"],
        parameters: [],
        returns: "number"
}, {
        name: "Spectral Skewness",
        function: "spectral_skewness",
        sub_features: ["spectral_mean", "spectral_standard_deviation"],
        parameters: [],
        returns: "number"
}, {
        name: "Spectral Kurtosis",
        function: "spectral_kurtosis",
        sub_features: ["spectral_mean", "spectral_standard_deviation"],
        parameters: [],
        returns: "number"
}, {
        name: "Irregularity K",
        function: "irregularity_k",
        sub_features: [],
        parameters: [],
        returns: "number"
}, {
        name: "Irregularity J",
        function: "irregularity_j",
        sub_features: [],
        parameters: [],
        returns: "number"
}, {
        name: "Tristimulus 1",
        function: "tristimulus_1",
        sub_features: ["spectral_fundamental"],
        parameters: [],
        returns: "number"
}, {
        name: "Tristimulus 2",
        function: "tristimulus_2",
        sub_features: ["spectral_fundamental"],
        parameters: [],
        returns: "number"
}, {
        name: "Tristimulus 3",
        function: "tristimulus_3",
        sub_features: ["spectral_fundamental"],
        parameters: [],
        returns: "number"
}, {
        name: "Smoothness",
        function: "smoothness",
        sub_features: [],
        parameters: [],
        returns: "number"
}, {
        name: "Rolloff",
        function: "rolloff",
        sub_features: [],
        parameters: [{
            name: "Threshold",
            unit: "%",
            type: "number",
            minimum: 0,
            maximum: 100,
            default: 90
    }],
        returns: "number"
}, {
        name: "Loudness",
        function: "loudness",
        sub_features: ["bark_coefficients"],
        parameters: [],
        returns: "number"
}, {
        name: "Sharpness",
        function: "sharpness",
        sub_features: ["bark_coefficients"],
        parameters: [],
        returns: "number"
}, {
        name: "Flatness",
        function: "flatness",
        sub_features: [],
        parameters: [],
        returns: "number"
}, {
        name: "Flatness DB",
        function: "flatness_db",
        sub_features: ["flatness"],
        parameters: [],
        returns: "number"
}, {
        name: "Tonality",
        function: "tonality",
        sub_features: ["flatness_db"],
        parameters: [],
        returns: "number"
}, {
        name: "Spectral Crest Factor",
        function: "spectral_crest_factor",
        sub_features: ["maximum", "spectral_mean"],
        parameters: [],
        returns: "number"
}, {
        name: "Spectral Slope",
        function: "spectral_slope",
        sub_features: [],
        parameters: [],
        returns: "number"
}, {
        name: "Fundamental Frequency",
        function: "spectral_fundamental",
        sub_features: [],
        parameters: [],
        returns: "number"
}, {
        name: "Non-Zero count",
        function: "nonzero_count",
        sub_features: [],
        parameters: [],
        returns: "number"
}, {
        name: "HPS",
        function: "hps",
        sub_features: [],
        parameters: [],
        returns: "number"
}, {
        name: "MFCC",
        function: "mfcc",
        sub_features: [],
        parameters: [{
            name: "Band Count",
            unit: "",
            type: "number",
            minimum: 0,
            maximum: undefined,
            default: 26
    }, {
            name: "Minimum Frequency",
            unit: "Hz",
            type: "number",
            minimum: 0,
            maximum: undefined,
            default: 400
    }, {
            name: "Maximum Frequency",
            unit: "Hz",
            minimum: 0,
            maximum: undefined,
            default: 20000
    }],
        returns: "array"
}, {
        name: "Chroma",
        function: "chroma",
        sub_features: [],
        parameters: [{
            name: "nbins",
            unit: "",
            type: "number",
            minimum: 2,
            maximum: undefined,
            default: 12
    }, {
            name: "A440",
            unit: "",
            type: "number",
            minimum: 220,
            maximum: 880,
            default: 440
    }, {
            name: "f_ctr",
            unit: "",
            type: "number",
            minimum: undefined,
            maximum: undefined,
            default: 1000
    }, {
            name: "octwidth",
            unit: "",
            type: "number",
            minimum: undefined,
            maximum: undefined,
            default: 1
    }],
        returns: "array"
}, {
        name: "DCT",
        function: "dct",
        sub_features: [],
        parameters: [],
        returns: "array"
}, {
        name: "Bark Coefficients",
        function: "bark_coefficients",
        sub_features: [],
        parameters: [{
            name: "Band Count",
            unit: "",
            type: "number",
            minimum: 0,
            maximum: 26,
            default: 26
    }],
        returns: "array"
}, {
        name: "Peak Spectrum",
        function: "peak_spectrum",
        sub_features: [],
        parameters: [{
            name: "Threshold",
            unit: "",
            type: "number",
            minimum: 0,
            maximum: 100,
            default: 30
    }],
        returns: "PeakSpectrumData"
}];


/***/ }),

/***/ "./modules/objects/TimeData.js":
/*!*************************************!*\
  !*** ./modules/objects/TimeData.js ***!
  \*************************************/
/*! exports provided: TimeData */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TimeData", function() { return TimeData; });
/* harmony import */ var _DataPrototype__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DataPrototype */ "./modules/objects/DataPrototype.js");
/* harmony import */ var _SpectrumData__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SpectrumData */ "./modules/objects/SpectrumData.js");
/* harmony import */ var _functions_xtract_init_wavelet__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../functions/xtract_init_wavelet */ "./modules/functions/xtract_init_wavelet.js");
/* harmony import */ var _functions_xtract_array_min__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../functions/xtract_array_min */ "./modules/functions/xtract_array_min.js");
/* harmony import */ var _functions_xtract_array_max__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../functions/xtract_array_max */ "./modules/functions/xtract_array_max.js");
/* harmony import */ var _functions_xtract_array_sum__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../functions/xtract_array_sum */ "./modules/functions/xtract_array_sum.js");
/* harmony import */ var _functions_xtract_mean__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../functions/xtract_mean */ "./modules/functions/xtract_mean.js");
/* harmony import */ var _functions_xtract_temporal_centroid__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../functions/xtract_temporal_centroid */ "./modules/functions/xtract_temporal_centroid.js");
/* harmony import */ var _functions_xtract_variance__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../functions/xtract_variance */ "./modules/functions/xtract_variance.js");
/* harmony import */ var _functions_xtract_standard_deviation__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../functions/xtract_standard_deviation */ "./modules/functions/xtract_standard_deviation.js");
/* harmony import */ var _functions_xtract_average_deviation__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../functions/xtract_average_deviation */ "./modules/functions/xtract_average_deviation.js");
/* harmony import */ var _functions_xtract_skewness__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../functions/xtract_skewness */ "./modules/functions/xtract_skewness.js");
/* harmony import */ var _functions_xtract_kurtosis__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../functions/xtract_kurtosis */ "./modules/functions/xtract_kurtosis.js");
/* harmony import */ var _functions_xtract_zcr__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../functions/xtract_zcr */ "./modules/functions/xtract_zcr.js");
/* harmony import */ var _functions_xtract_crest__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../functions/xtract_crest */ "./modules/functions/xtract_crest.js");
/* harmony import */ var _functions_xtract_rms_amplitude__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../functions/xtract_rms_amplitude */ "./modules/functions/xtract_rms_amplitude.js");
/* harmony import */ var _functions_xtract_lowest_value__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../functions/xtract_lowest_value */ "./modules/functions/xtract_lowest_value.js");
/* harmony import */ var _functions_xtract_nonzero_count__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../functions/xtract_nonzero_count */ "./modules/functions/xtract_nonzero_count.js");
/* harmony import */ var _functions_xtract_wavelet_f0__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../functions/xtract_wavelet_f0 */ "./modules/functions/xtract_wavelet_f0.js");
/* harmony import */ var _functions_xtract_energy__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../functions/xtract_energy */ "./modules/functions/xtract_energy.js");
/* harmony import */ var _functions_xtract_spectrum__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../functions/xtract_spectrum */ "./modules/functions/xtract_spectrum.js");
/* harmony import */ var _functions_xtract_dct_2__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../functions/xtract_dct_2 */ "./modules/functions/xtract_dct_2.js");
/* harmony import */ var _functions_xtract_autocorrelation__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ../functions/xtract_autocorrelation */ "./modules/functions/xtract_autocorrelation.js");
/* harmony import */ var _functions_xtract_amdf__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ../functions/xtract_amdf */ "./modules/functions/xtract_amdf.js");
/* harmony import */ var _functions_xtract_asdf__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ../functions/xtract_asdf */ "./modules/functions/xtract_asdf.js");
/* harmony import */ var _functions_xtract_yin__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ../functions/xtract_yin */ "./modules/functions/xtract_yin.js");
/* harmony import */ var _functions_xtract_onset__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ../functions/xtract_onset */ "./modules/functions/xtract_onset.js");
/* harmony import */ var _functions_xtract_resample__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ../functions/xtract_resample */ "./modules/functions/xtract_resample.js");
/// <reference path="../../typings/objects/TimeData.d.ts" />





























class TimeData extends _DataPrototype__WEBPACK_IMPORTED_MODULE_0__["DataPrototype"] {
    constructor(input, sampleRate) {
        if (sampleRate <= 0) {
            sampleRate = undefined;
            console.log("Invalid parameter for 'sampleRate' for TimeData");
        }

        if (typeof input === "object") {
            var src, src_data;
            if (input instanceof TimeData) {
                src = src.getData();
                super(src.length, sampleRate);
                this.copyDataFrom(src, src.length, 0);
            } else if (input instanceof Float32Array || input instanceof Float64Array) {
                src = input;
                super(src.length, sampleRate);
                this.copyDataFrom(src, src.length, 0);
            } else {
                throw ("TimeData: Invalid object passed as first argument.");
            }

        } else if (typeof input === "number") {
            if (input <= 0 || input !== Math.floor(input)) {
                throw ("TimeData: Invalid number passed as first argument.");
            }
            super(input, sampleRate);
        } else {
            throw ("TimeData: Constructor has invalid operators!");
        }

        this._dct = undefined;
        this._wavelet = Object(_functions_xtract_init_wavelet__WEBPACK_IMPORTED_MODULE_2__["xtract_init_wavelet"])();
    }
    getFrames(frameSize, hopSize) {
        if (typeof frameSize !== "number" || frameSize <= 0 || frameSize !== Math.floor(frameSize)) {
            throw ("frameSize must be a defined, positive integer");
        }
        if (typeof hopSize !== "number") {
            hopSize = frameSize;
        }
        var num_frames = Math.ceil(this.data.length / frameSize);
        var result_frames = [];
        for (var i = 0; i < num_frames; i++) {
            var frame = new TimeData(hopSize, this.sampleRate);
            frame.copyDataFrom(this.data.subarray(frameSize * i, frameSize * i + hopSize));
            result_frames.push(frame);
        }
        return result_frames;
    }

    // Features
    minimum() {
        if (this.result.minimum === undefined) {
            this.result.minimum = Object(_functions_xtract_array_min__WEBPACK_IMPORTED_MODULE_3__["xtract_array_min"])(this.data);
        }
        return this.result.minimum;
    }

    maximum() {
        if (this.result.maximum === undefined) {
            this.result.maximum = Object(_functions_xtract_array_max__WEBPACK_IMPORTED_MODULE_4__["xtract_array_max"])(this.data);
        }
        return this.result.maximum;
    }

    sum() {
        if (this.result.sum === undefined) {
            this.result.sum = Object(_functions_xtract_array_sum__WEBPACK_IMPORTED_MODULE_5__["xtract_array_sum"])(this.data);
        }
        return this.result.sum;
    }

    mean() {
        if (this.result.mean === undefined) {
            this.result.mean = Object(_functions_xtract_mean__WEBPACK_IMPORTED_MODULE_6__["xtract_mean"])(this.data);
        }
        return this.result.mean;
    }

    temporal_centroid(window_ms) {
        if (this.result.temporal_centroid === undefined) {
            this.energy(window_ms);
            this.result.temporal_centroid = Object(_functions_xtract_temporal_centroid__WEBPACK_IMPORTED_MODULE_7__["xtract_temporal_centroid"])(this.result.energy.data, this.sampleRate, window_ms);
        }
        return this.result.temporal_centroid;
    }

    variance() {
        if (this.result.variance === undefined) {
            this.result.variance = Object(_functions_xtract_variance__WEBPACK_IMPORTED_MODULE_8__["xtract_variance"])(this.data, this.mean());
        }
        return this.result.variance;
    }

    standard_deviation() {
        if (this.result.standard_deviation === undefined) {
            this.result.standard_deviation = Object(_functions_xtract_standard_deviation__WEBPACK_IMPORTED_MODULE_9__["xtract_standard_deviation"])(this.data, this.variance());
        }
        return this.result.standard_deviation;
    }

    average_deviation () {
        if (this.result.average_deviation === undefined) {
            this.result.average_deviation = Object(_functions_xtract_average_deviation__WEBPACK_IMPORTED_MODULE_10__["xtract_average_deviation"])(this.data, this.mean());
        }
        return this.result.average_deviation;
    }

    skewness () {
        if (this.result.skewness === undefined) {
            this.result.skewness = Object(_functions_xtract_skewness__WEBPACK_IMPORTED_MODULE_11__["xtract_skewness"])(this.data, this.mean(), this.standard_deviation());
        }
        return this.result.skewness;
    }

    kurtosis () {
        if (this.result.kurtosis === undefined) {
            this.result.kurtosis = Object(_functions_xtract_kurtosis__WEBPACK_IMPORTED_MODULE_12__["xtract_kurtosis"])(this.data, this.mean(), this.standard_deviation());
        }
        return this.result.kurtosis;
    }

    zcr  () {
        if (this.result.zcr === undefined) {
            this.result.zcr = Object(_functions_xtract_zcr__WEBPACK_IMPORTED_MODULE_13__["xtract_zcr"])(this.data);
        }
        return this.result.zcr;
    }

    crest_factor () {
        if (this.result.crest_factor === undefined) {
            this.result.crest_factor = Object(_functions_xtract_crest__WEBPACK_IMPORTED_MODULE_14__["xtract_crest"])(this.data, this.maximum(), this.mean());
        }
        return this.result.crest_factor;
    }

    rms_amplitude () {
        if (this.result.rms_amplitude === undefined) {
            this.result.rms_amplitude = Object(_functions_xtract_rms_amplitude__WEBPACK_IMPORTED_MODULE_15__["xtract_rms_amplitude"])(this.data);
        }
        return this.result.rms_amplitude;
    }

    lowest_value (threshold) {
        if (this.result.lowest_value === undefined) {
            this.result.lowest_value = Object(_functions_xtract_lowest_value__WEBPACK_IMPORTED_MODULE_16__["xtract_lowest_value"])(this.data, threshold);
        }
        return this.result.lowest_value;
    }

    highest_value () {
        if (this.result.nonzero_count === undefined) {
            this.result.nonzero_count = Object(_functions_xtract_nonzero_count__WEBPACK_IMPORTED_MODULE_17__["xtract_nonzero_count"])(this.data);
        }
        return this.result.nonzero_count;
    }

    f0 () {
        if (this._wavelet === undefined) {
            this._wavelet = this.init_wavelet();
        }
        if (this.result.f0 === undefined) {
            this.result.f0 = Object(_functions_xtract_wavelet_f0__WEBPACK_IMPORTED_MODULE_18__["xtract_wavelet_f0"])(this.data, this.sampleRate, this._wavelet);
        }
        return this.result.f0;
    }

    energy (window_ms) {
        if (this.result.energy === undefined || this.result.energy.window_ms !== window_ms) {
            this.result.energy = {
                'data': Object(_functions_xtract_energy__WEBPACK_IMPORTED_MODULE_19__["xtract_energy"])(this.data, this.sampleRate, window_ms),
                'window_ms': window_ms
            };
        }
        return this.result.energy;
    }

    spectrum() {
        if (this.result.spectrum === undefined) {
            var _spec = Object(_functions_xtract_spectrum__WEBPACK_IMPORTED_MODULE_20__["xtract_spectrum"])(this.data, this.sampleRate, true, false);
            this.result.spectrum = new _SpectrumData__WEBPACK_IMPORTED_MODULE_1__["SpectrumData"](_spec.length / 2, this.sampleRate);
            this.result.spectrum.copyDataFrom(_spec);
            return this.result.spectrum;
        }
    }

    dct() {
        if (this._dct === undefined) {
            this._dct = this.createDctCoefficients(this.data.length);
        }
        if (this.result.dct === undefined) {
            this.result.dct = Object(_functions_xtract_dct_2__WEBPACK_IMPORTED_MODULE_21__["xtract_dct_2"])(this.data, this._dct);
        }
        return this.result.dct;
    }

    autocorrelation () {
        if (this.result.autocorrelation === undefined) {
            this.result.autocorrelation = Object(_functions_xtract_autocorrelation__WEBPACK_IMPORTED_MODULE_22__["xtract_autocorrelation"])(this.data);
        }
        return this.result.autocorrelation;
    }

    amdf () {
        if (this.result.amdf === undefined) {
            this.result.amdf = Object(_functions_xtract_amdf__WEBPACK_IMPORTED_MODULE_23__["xtract_amdf"])(this.data);
        }
        return this.result.amdf;
    }

    asdf () {
        if (this.result.asdf === undefined) {
            this.result.asdf = Object(_functions_xtract_asdf__WEBPACK_IMPORTED_MODULE_24__["xtract_asdf"])(this.data);
        }
        return this.result.asdf;
    }

    yin() {
        if (this.result.yin === undefined) {
            this.result.yin = Object(_functions_xtract_yin__WEBPACK_IMPORTED_MODULE_25__["xtract_yin"])(this.data);
        }
        return this.result.yin;
    }

    onset(frameSize) {
        if (this.result.onset === undefined || this.result.onset.frameSize !== frameSize) {
            this.result.onset = {
                'data': Object(_functions_xtract_onset__WEBPACK_IMPORTED_MODULE_26__["xtract_onset"])(this.data, frameSize),
                'frameSize': frameSize
            };
        }
        return this.result.onset;
    }

    resample(targetSampleRate) {
        if (this.sampleRate === undefined) {
            throw ("Source sampleRate must be defined");
        }
        if (typeof targetSampleRate !== "number" || targetSampleRate <= 0) {
            throw ("Target sampleRate must be a positive number");
        }
        var resampled = Object(_functions_xtract_resample__WEBPACK_IMPORTED_MODULE_27__["xtract_resample"])(this.data, targetSampleRate, this.sampleRate);
        var reply = new TimeData(resampled.length, targetSampleRate);
        reply.copyDataFrom(resampled);
        this.result.resample = reply;
        return reply;
    }
}

TimeData.prototype.features = [
    {
        name: "Minimum",
        function: "minimum",
        sub_features: [],
        parameters: [],
        returns: "number"
    }, {
        name: "Maximum",
        function: "maximum",
        sub_features: [],
        parameters: [],
        returns: "number"
    }, {
        name: "Sum",
        function: "sum",
        sub_features: [],
        parameters: [],
        returns: "number"
    }, {
        name: "Mean",
        function: "mean",
        sub_features: [],
        parameters: [],
        returns: "number"
    }, {
        name: "Temporal Centroid",
        function: "temporal_centroid",
        sub_features: ["energy"],
        parameters: [{
            name: "Window Time",
            unit: "ms",
            type: "number",
            minimum: 1,
            maximum: undefined,
            default: 100
        }],
        returns: "number"
    }, {
        name: "Variance",
        function: "variance",
        sub_features: ["mean"],
        parameters: [],
        returns: "number"
    }, {
        name: "Standard Deviation",
        function: "standard_deviation",
        sub_features: ["variance"],
        parameters: [],
        returns: "number"
    }, {
        name: "Average Deviation",
        function: "average_deviation",
        sub_features: ["mean"],
        parameters: [],
        returns: "number"
    }, {
        name: "Skewness",
        function: "skewness",
        sub_features: ["mean", "standard_deviation"],
        parameters: [],
        returns: "number"
    }, {
        name: "Kurtosis",
        function: "kurtosis",
        sub_features: ["mean", "standard_deviation"],
        parameters: [],
        returns: "number"
    }, {
        name: "Zero Crossing Rate",
        function: "zcr",
        sub_features: [],
        parameters: [],
        returns: "number"
    }, {
        name: "Crest Factor",
        function: "crest_factor",
        sub_features: ["maximum", "mean"],
        parameters: [],
        returns: "number"
    }, {
        name: "RMS Amplitude",
        function: "rms_amplitude",
        sub_features: [],
        parameters: [],
        returns: "number"
    }, {
        name: "Lowest Value",
        function: "lowest_value",
        sub_features: [],
        parameters: [{
            name: "Threshold",
            unit: "",
            type: "number",
            minimum: undefined,
            maximum: undefined,
            default: undefined
        }],
        returns: "number"
    }, {
        name: "Highest Value",
        function: "highest_value",
        sub_features: [],
        parameters: [{
            name: "Threshold",
            unit: "",
            type: "number",
            minimum: undefined,
            maximum: undefined,
            default: undefined
        }],
        returns: "number"
    }, {
        name: "Non-Zero Count",
        function: "nonzero_count",
        sub_features: [],
        parameters: [],
        returns: "number"
    }, {
        name: "Fundamental Frequency",
        function: "f0",
        sub_features: [],
        parameters: [],
        returns: "number"
    }, {
        name: "Energy",
        function: "energy",
        sub_features: [],
        parameters: [{
            name: "Window",
            unit: "ms",
            type: "number",
            minimum: 1,
            maximum: undefined,
            default: 100
        }],
        returns: "object"
    }, {
        name: "Spectrum",
        function: "spectrum",
        sub_features: [],
        parameters: [],
        returns: "SpectrumData"
    }, {
        name: "DCT",
        function: "dct",
        sub_features: [],
        parameters: [],
        returns: "array"
    }, {
        name: "Autocorrelation",
        function: "autocorrelation",
        sub_features: [],
        parameters: [],
        returns: "array"
    }, {
        name: "AMDF",
        function: "amdf",
        sub_features: [],
        parameters: [],
        returns: "array"
    }, {
        name: "ASDF",
        function: "asdf",
        sub_features: [],
        parameters: [],
        returns: "array"
    }, {
        name: "YIN Pitch",
        function: "yin",
        sub_features: [],
        parameters: [],
        returns: "array"
    }, {
        name: "Onset Detection",
        function: "onset",
        sub_features: [],
        parameters: [{
            name: "Frame Size",
            unit: "samples",
            type: "number",
            minimum: 1,
            maximum: undefined,
            default: 1024
        }],
        returns: "array"
    }, {
        name: "Resample",
        function: "resample",
        sub_features: [],
        parameters: [{
            name: "Target Sample Rate",
            unit: "Hz",
            type: "number",
            minimum: 0,
            maximum: undefined,
            default: 8000
        }],
        returns: "TimeData"
    }];


/***/ })

/******/ });
});
//# sourceMappingURL=jsXtract.js.map