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

// ****************
//
// SCALAR FUNCTIONS
//
// ****************

EMSCRIPTEN_KEEPALIVE
double xtract_variance_fp64(double* data, double mean, int N)
{
    double variance = 0.0;
    double x;
    if (data == 0x0)
        return 0.0;
    for (int i=0; i<N; i++) {
        x = data[i] - mean;
        variance = variance + x*x;
    }
    return variance;
}

EMSCRIPTEN_KEEPALIVE
double xtract_variance_fp32(float* data, double mean, int N)
{
    double variance = 0.0;
    double x;
    if (data == 0x0)
        return 0.0;
    for (int i=0; i<N; i++) {
        x = (double)data[i] - mean;
        variance = variance + x*x;
    }
    return variance;
}

EMSCRIPTEN_KEEPALIVE
double xtract_average_deviation_fp64(double* data, double mean, int N)
{
    double result = 0.0;
    if (data == 0x0) {
        return 0.0;
    }
    for (int i=0; i<N; i++)
        result += fabs(data[i] - mean);
    return result;
}

EMSCRIPTEN_KEEPALIVE
double xtract_average_deviation_fp32(float* data, double mean, int N)
{
    double result = 0.0;
    if (data == 0x0) {
        return 0.0;
    }
    for (int i=0; i<N; i++)
        result += fabs((double)data[i] - mean);
    return result;
}

// ****************
//
// VECTOR FUNCTIONS
//
// ****************

EMSCRIPTEN_KEEPALIVE
void xtract_autocorrelation_fp64(double* array, double* result, int N)
{
    double corr;
    double recip = 1.0/(double)N;
    int i, n;
    for(n=N-1; n>=0; n--)
    {
        corr = 0.0;
        for (i=0; i<N-n; i++) {
            corr = corr + (array[i] * array[i + n]);
        }
        result[n] = corr*recip;
    }
}

EMSCRIPTEN_KEEPALIVE
void xtract_autocorrelation_fp32(float* array, float* result, int N)
{
    double corr;
    double recip = 1.0/(double)N;
    int i, n;
    for(n=N-1; n>=0; n--)
    {
        corr = 0.0;
        for (i=0; i<N-n; i++) {
            corr = corr + (array[i] * array[i + n]);
        }
        result[n] = (float)(corr*recip);
    }
}