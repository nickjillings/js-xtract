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
