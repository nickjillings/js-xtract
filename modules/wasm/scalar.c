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
    maxvar = data[0];
    for (int i=1; i<N; i++)
    {
        if (data[i] > maxvar) {
            maxvar = data[i];
        }
    }
    return maxvar;
}

EMSCRIPTEN_KEEPALIVE
double xtract_array_max_fp32(float* data, int N) {
    double maxvar;
    if (data == 0x0) {
        return 0.0;
    }
    maxvar = data[0];
    for (int i=1; i<N; i++)
    {
        if (data[i] > maxvar) {
            maxvar = data[i];
        }
    }
    return maxvar;
}

EMSCRIPTEN_KEEPALIVE
double xtract_array_min_fp64(double* data, int N) {
    double minvar;
    if (data == 0x0) {
        return 0.0;
    }
    minvar = data[0];
    for (int i=1; i<N; i++)
    {
        if (data[i] < minvar) {
            minvar = data[i];
        }
    }
    return minvar;
}

EMSCRIPTEN_KEEPALIVE
double xtract_array_min_fp32(float* data, int N) {
    double minvar;
    if (data == 0x0) {
        return 0.0;
    }
    minvar = data[0];
    for (int i=1; i<N; i++)
    {
        if (data[i] < minvar) {
            minvar = data[i];
        }
    }
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

EMSCRIPTEN_KEEPALIVE
double xtract_spectral_centroid_fp64(double* data, int N)
{
    double result = 0.0;
    if (data == 0x0) {
        return 0.0;
    }
    int N2 = N/2;
    double A_d = xtract_array_sum_fp64(data, N2);
    if (A_d == 0.0) {
        return 0.0;
    }
    int n = N2;
    while(n--) {
        result += data[n+N/2] * (data[n] / A_d);
    }
    return result;
}

EMSCRIPTEN_KEEPALIVE
double xtract_spectral_centroid_fp32(float* data, int N)
{
    double result = 0.0;
    if (data == 0x0) {
        return 0.0;
    }
    int N2 = N/2;
    double A_d = xtract_array_sum_fp32(data, N2);
    if (A_d == 0.0) {
        return 0.0;
    }
    int n = N2;
    while(n--) {
        result += (double)data[n+N/2] * ((double)data[n] / A_d);
    }
    return result;
}

EMSCRIPTEN_KEEPALIVE
double xtract_spectral_variance_fp64(double* data, double spectral_centroid, int N)
{
    double result = 0.0;
	double A = 0;
	int N2 = N >> 1;
	int n = N2;
	double A_d = xtract_array_sum_fp64(data, N2);
	if (A_d == 0.0) {
		return 0.0;
	}
	double freq;
	while (n--) {
		// Math.pow(freqs[n] - spectral_centroid, 2)
		freq = data[n + N / 2] - spectral_centroid;
		freq = freq * freq;
		result += freq * (data[n] / A_d);
	}
	return result;
}

EMSCRIPTEN_KEEPALIVE
double xtract_spectral_variance_fp32(float* data, double spectral_centroid, int N)
{
	double result = 0.0;
	double A = 0;
	int N2 = N >> 1;
	int n = N2;
	double A_d = xtract_array_sum_fp32(data, N2);
	if (A_d == 0.0) {
		return 0.0;
	}
	double freq;
	while (n--) {
		// Math.pow(freqs[n] - spectral_centroid, 2)
		freq = (double)data[n + N / 2] - spectral_centroid;
		freq = freq * freq;
		result += freq * ((double)data[n] / A_d);
	}
	return result;
}

EMSCRIPTEN_KEEPALIVE
double xtract_rms_amplitude_fp64(double* data, int N) {
	double result = 0.0;
	for (int n = 0; n < N; n++) {
		result += data[n] * data[n];
	}
	result /= (double)N;
	return sqrt(result);
}

EMSCRIPTEN_KEEPALIVE
double xtract_rms_amplitude_fp32(float* data, int N) {
	double result = 0.0;
	for (int n = 0; n < N; n++) {
		result += (double)data[n] * (double)data[n];
	}
	result /= (double)N;
	return sqrt(result);
}

// ****************
//
// VECTOR FUNCTIONS
//
// ****************

EMSCRIPTEN_KEEPALIVE
int xtract_autocorrelation_fp64(double* array, double* result, int N)
{
    double corr, recip;
    int n, i;

    if (array == 0x0 || result == 0x0)
        return 1;
    if (N <= 0)
        return 2;

    recip = 1.0/(double)N;
    n = N;
    while(n--)
    {
        corr = 0.0;
        for (i=0; i<N-n; i++) {
            corr = corr + (array[i] * array[i + n]);
        }
        result[n] = corr*recip;
    }
    return 0;
}

EMSCRIPTEN_KEEPALIVE
int xtract_autocorrelation_fp32(float* array, float* result, int N)
{
    double corr, recip;
    int n, i;

    if (array == 0x0 || result == 0x0)
        return 1;
    if (N <= 0)
        return 2;

    recip = 1.0/(double)N;
    n = N;
    while(n--)
    {
        corr = 0.0;
        for (i=0; i<N-n; i++) {
            corr = corr + (array[i] * array[i + n]);
        }
        result[n] = (float)(corr*recip);
    }
    return 0;
}
