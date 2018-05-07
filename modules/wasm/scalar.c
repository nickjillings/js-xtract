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

#include <stdint.h>
#include <math.h>
#include <emscripten.h>

EMSCRIPTEN_KEEPALIVE
double xtract_array_sum_fp64(double* data, int N) {
    double sum = 0.0;
    if (data == 0x0) {
        return 0.0;
    }
    for(int i=0; i<N; i++)
        sum += data[i];
    return sum;
}

EMSCRIPTEN_KEEPALIVE
double xtract_array_sum_fp32(float* data, int N) {
    double sum = 0.0;
    if (data == 0x0) {
        return 0.0;
    }
    for(int i=0; i<N; i++)
        sum += data[i];
    return sum;
}

EMSCRIPTEN_KEEPALIVE
double xtract_array_max_fp64(double* data, int N) {
    double maxvar;
    if (data == 0x0) {
        return 0.0;
    }
    for (int i=0; i<N; i++)
        maxvar = fmax(data[i], maxvar);
    return maxvar;
}

EMSCRIPTEN_KEEPALIVE
double xtract_array_max_fp32(float* data, int N) {
    double maxvar;
    if (data == 0x0) {
        return 0.0;
    }
    for (int i=0; i<N; i++)
        maxvar = fmax((double)data[i], maxvar);
    return maxvar;
}

EMSCRIPTEN_KEEPALIVE
double xtract_array_min_fp64(double* data, int N) {
    double minvar;
    if (data == 0x0) {
        return 0.0;
    }
    for (int i=0; i<N; i++)
        minvar = fmin(data[i], minvar);
    return minvar;
}

EMSCRIPTEN_KEEPALIVE
double xtract_array_min_fp32(float* data, int N) {
    double minvar;
    if (data == 0x0) {
        return 0.0;
    }
    for (int i=0; i<N; i++)
        minvar = fmin((double)data[i], minvar);
    return minvar;
}

EMSCRIPTEN_KEEPALIVE
int xtract_array_scale_fp64(double* data, double factor, int N)
{
    if (data == 0x0)
        return 1;
    for (int i=0; i<N; i++)
        data[i] *= factor;
    return 0;
}

EMSCRIPTEN_KEEPALIVE
int xtract_array_scale_fp32(float* data, double factor, int N)
{
    if (data == 0x0)
        return 1;
    for (int i=0; i<N; i++)
        data[i] *= factor;
    return 0;
}