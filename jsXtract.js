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

// This work is based upon LibXtract for the Web Audio API

Float32Array.prototype.xtract_subarray = function(offset,N) {
    if (offset == undefined && N == undefined) {return this;}
    if (offset == undefined) {offset = 0;}
    if (N == undefined) {N = this.length;}
    return this.subarray(offset,N);
}
Float64Array.prototype.xtract_subarray = function(offset,N) {
    if (offset == undefined && N == undefined) {return this;}
    if (offset == undefined) {offset = 0;}
    if (N == undefined) {N = this.length;}
    return this.subarray(offset,N);
}
Array.prototype.xtract_subarray = function(offset,N) {
    if (offset == undefined && N == undefined) {return this;}
    if (offset == undefined) {offset = 0;}
    if (N == undefined) {N = this.length;}
    return this.subarray(offset,N);
}

var jsXtract = function() {
    this.helper = {
        "parent": this,
        "is_denormal": function(num) {
            if (Math.abs(num) <= 2.2250738585072014e-308) {
                return true;
            }
            return false;
        },
        "array_sum": function(data) {
            var sum = 0.0;
            for (var n=0; n<data.length; n++) {
                sum += data[n];
            }
            return sum;
        },
        "array_min": function(data) {
            var min = data[0];
            for (var n=1; n<data.length; n++) {
                if (data[n] < min) {
                    min = data[n];
                }
            }
            return min;
        },
        "array_max": function(data) {
            var max = data[0];
            for (var n=1; n<data.length; n++) {
                if (data[n] > max) {
                    max = data[n];
                }
            }
            return max;
        }
    }
    this.features = {
        "parent": this,
        "mean": function(inputArray,N,offset) {
            var sub_arr = inputArray.xtract_subarray(offset,N);
            var result = this.parent.helper.array_sum(sub_arr);
            return result /= sub_arr.length;
        },
        "variance": function(inputArray,mean,N,offset) {
            var sub_arr = inputArray.xtract_subarray(offset,N);
            var result = 0.0;
            var r_mean = mean || this.mean(sub_arr);
            for (var n=0; n<sub_arr.length; n++) {
                result += Math.pow(sub_arr[n]-r_mean,2);
            }
            return result /= (sub_arr.length - 1);
        },
        "standard_deviation": function(inputArray,variance,N,offset) {
            var sub_arr = inputArray.xtract_subarray(offset,N);
            return Math.sqrt(variance || this.variance(sub_arr));
        },
        "average_deviation": function(inputArray,mean,N,offset) {
            var sub_arr = inputArray.xtract_subarray(offset,N);
            var result = 0;
            var r_mean = mean || this.mean(sub_arr);
            for (var n=0; n<sub_arr.length; n++) {
                result += Math.abs(sub_arr[n] - r_mean);
            }
            return result /= sub_arr.length;
        },
        "skewness": function(inputArray,mean,standard_deviation,N,offset) {
            var sub_arr = inputArray.xtract_subarray(offset,N);
            var result = 0.0;
            var r_mean = mean || this.mean(inputArray);
            var r_sd = standard_deviation || this.standard_deviation(sub_arr,this.variance(sub_arr,mean || r_mean));
            for (var n=0; n<sub_arr.length; n++) {
                result += Math.pow((sub_arr[n] - r_mean) / r_sd,3);
            }
            return result /= sub_arr.length;
        },
        "kurtosis": function(inputArray,mean,standard_deviation,N,offset) {
            var sub_arr = inputArray.xtract_subarray(offset,N);
            var result = 0.0;
            var r_mean = mean || this.mean(sub_arr);
            var r_sd = standard_deviation || this.standard_deviation(inputArray,this.variance(sub_arr,mean || r_mean));
            for (var n=0; n<sub_arr.length; n++) {
                result += Math.pow((sub_arr[n] - r_mean) / r_sd,4);
            }
            result /= sub_arr.length;
            return result -= 3.0;
        },
        "spectral_centroid": function(magnitudeArray,frequencyArray,N,offset) {
            var mag_sub_arr = magnitudeArray.xtract_subarray(offset,N);
            var frq_sub_arr = frequencyArray.xtract_subarray(offset,N);
            var FA = 0, A = 0;
            for (var n=0; n<mag_sub_arr.length; n++) {
                FA += mag_sub_arr[n] * frq_sub_arr[n];
                A += mag_sub_arr[n];
            }
            if (A == 0.0) {
                return 0.0;
            } else {
                return FA / A;
            }
        },
        "spectral_mean": function(magnitudeArray,frequencyArray,N,offset) {
            return this.spectral_centroid(magnitudeArray,frequencyArray,N,offset);
        },
        "spectral_variance": function(magnitudeArray,frequencyArray,spectral_mean,N,offset) {
            var mag_sub_arr = magnitudeArray.xtract_subarray(offset,N);
            var frq_sub_arr = frequencyArray.xtract_subarray(offset,N);
            var r_mean = spectral_mean || this.features.spectral_mean(mag_sub_arr,frq_sub_arr);
            var A = 0, result = 0;
            for (var n=0; n<mag_sub_arr.length; n++) {
                A += mag_sub_arr[n];
                result += Math.pow(frq_sub_arr[n] - r_mean,2) * mag_sub_arr[n];
            }
            return result /= A;
        },
        "spectral_standard_deviation": function(magnitudeArray,frequencyArray,spectral_variance,N,offset) {
            var mag_sub_arr = magnitudeArray.xtract_subarray(offset,N);
            var frq_sub_arr = frequencyArray.xtract_subarray(offset,N);
            var r_variance = spectral_variance || this.features.spectral_variance(mag_sub_arr,frq_sub_arr);
        },
        "spectral_skewness": function(magnitudeArray,frequencyArray,spectral_mean,spectral_standard_deviation,N,offset) {
            var mag_sub_arr = magnitudeArray.xtract_subarray(offset,N);
            var frq_sub_arr = frequencyArray.xtract_subarray(offset,N);
            var r_mean = spectral_mean || this.features.spectral_mean(mag_sub_arr,frq_sub_arr);
            var r_std = spectral_standard_deviation || this.features.spectral_standard_deviation(mag_sub_arr,frq_sub_arr,this.features.spectral_variance(mag_sub_arr,frq_sub_arr,r_mean));
            var result = 0;
            for (var n=0; n<mag_sub_arr.length; n++) {
                result += Math.pow(frq_sub_arr[n] - r_mean,3)*mag_sub_arr[n];
            }
            return result /= Math.pow(r_std,3);
        },
        "spectral_kurtosis": function(magnitudeArray,frequencyArray,spectral_mean,spectral_standard_deviation,N,offset) {
            var mag_sub_arr = magnitudeArray.xtract_subarray(offset,N);
            var frq_sub_arr = frequencyArray.xtract_subarray(offset,N);
            var r_mean = spectral_mean || this.features.spectral_mean(mag_sub_arr,frq_sub_arr);
            var r_std = spectral_standard_deviation || this.features.spectral_standard_deviation(mag_sub_arr,frq_sub_arr,this.features.spectral_variance(mag_sub_arr,frq_sub_arr,r_mean));
            var result = 0;
            for (var n=0; n<mag_sub_arr.length; n++) {
                result += Math.pow(frq_sub_arr[n] - r_mean,4)*mag_sub_arr[n];
            }
            result /= Math.pow(r_std,4);
            return result -= 3.0;
        },
        "irregularity_k": function(magnitudeArray,N,offset) {
            var mag_sub_arr = magnitudeArray.xtract_subarray(offset,N);
            var result = 0;
            for(var n=1; n<mag_sub_arr.length-1; n++) {
                result += Math.abs(mag_sub_arr[n] - (mag_sub_arr[n-1]+mag_sub_arr[n]+mag_sub_arr[n+1])/3);
            }
            return result;
        },
        "irregularity_j": function(magnitudeArray,N,offset) {
            var mag_sub_arr = magnitudeArray.xtract_subarray(offset,N);
            var num = 0, den = 0;
            for (var n=0; n<mag_sub_arr.length-1; n++) {
                num += Math.pow(mag_sub_arr[n] - mag_sub_arr[n+1],2);
                den += Math.pow(mag_sub_arr[n],2);
            }
            return num / den;
        },
        "smoothness": function(magnitudeArray,N,offset) {
            var mag_sub_arr = magnitudeArray.xtract_subarray(offset,N);
            var prev = 0, current = 0, next = 0, temp = 0;
            prev = mag_sub_arr[0] <= 0 ? 1e-5 : mag_sub_arr[0];
            current = mag_sub_arr[1] <= 0 ? 1e-5 : mag_sub_arr[1];
            for (var n=1; n<mag_sub_arr.length-1; n++) {
                if (n>1) {
                    prev = current;
                    current = next;
                }
                next = mag_sub_arr[n+1] <= 0 ? 1e-5 : mag_sub_arr[n+1];
                temp += Math.abs(20.0*Math.log(current) - (20.0*Math.log(prev) + 20.0*Math.log(current) + 20.0*Math.log(next))/3.0)
            }
            return temp;
        },
        "zcr": function(timeArray,N,offset) {
            var sub_arr = timeArray.xtract_subarray(offset,N);
            var result = 0;
            for (var n=1; n<sub_arr.length; n++) {
                if (sub_arr[n] * sub_arr[n-1] < 0) {result++;}
            }
            return result;
        },
        "rolloff": function(magnitudeArray,sampleRate,threshold,N,offset) {
            var mag_sub_arr = magnitudeArray.xtract_subarray(offset,N);
            var pivot = 0, temp = 0;
            for (var n=0; n<mag_sub_arr.length; n++) {
                pivot += mag_sub_arr[n];
            }
            pivot *= threshold / 100.0;
            var n = 0;
            while(temp < pivot) {
                temp += mag_sub_arr[n];
                n++;
            }
            return n * (sampleRate/magnitudeArray.length);
        },
        "loudness": function(barkBandsArray,N,offset) {
            var sub_arr = barkBandsArray.xtract_subarray(offset,N);
            var result = 0;
            for (var n=0; n<sub_arr.length; n++) {
                result += MAth.pow(sub_arr[n], 0.23);
            }
            return result;
        },
        "flatness": function(magnitudeArray,N,offset) {
            var sub_arr = magnitudeArray.xtract_subarray(offset,N);
            var count = 0, denormal_found = false, num = 1.0, den = 0.0, temp = 0.0;
            for (var n=0; n<sub_arr.length; n++) {
                if (sub_arr[n] != 0.0) {
                    if (this.parent.helper.is_denormal(num)) {
                        denormal_found = true;
                        break;
                    }
                    num *= sub_arr[n];
                    den *= sub_arr[n];
                    count++;
                }
            }
            if (count == 0) {return 0;}
            num = Math.pow(num, 1.0 / sub_arr.length);
            den /= sub_arr.length;
            
            return num / den;
        },
        "flatness_db": function(magnitudeArray,flatness,N,offset) {
            if (typeof flatness != "number") {
                flatness = this.flatness(magnitudeArray,N,offset);
            }
            return 10.0 * Math.log10(flatness);
        },
        "tonality": function(magnitudeArray,flatness_db,N,offset) {
            if (typeof flatness_db != "number") {
                flatness_db = this.flatness_db(magnitudeArray,N,offset);
            }
            return Math.min(flatness_db / -60.0, 1);
        },
        "crest": function(data,max,mean) {
            var r_mean = mean || this.mean(data);
            var r_max = max || this.parent.helper.array_max(data);
            return r_max / r_mean;
        },
        "noisiness": function(h,p) {
            return (p-h)/p;
        },
        "rms_amplitude": function(timeArray,N,offset) {
            var sub_arr = timeArray.xtract_subarray(offset,N);
            var result = 0;
            for (var n=0; n<sub_arr.length; n++) {
                result += sub_arr[n]*sub_arr[n];
            }
            return Math.sqrt(result/sub_arr.length);
        },
        "spectral_inharmonicity": function(peakArray,frequencyArray,f0,N,offset) {
            var sub_peak_arr = peakArray.xtract_subarray(offset,N);
            var sub_frq_arr = frequencyArray.xtract_subarray(offset,N);
            var h = 0, num = 0.0, den = 0.0;
            if (typeof f0 != "number") {
                console.error("spectral_inharmonicity requires f0 to be defined. Call this.f0() to find.");
                return null;
            }
            for (var n=0; n<sub_peak_arr.length; n++) {
                if (sub_peak_arr[n] != 0.0) {
                    h = Math.floor(sub_frq_arr[n] / f0 + 0.5);
                    var mag_sq = Math.pow(sub_peak_arr[n],2);
                    num += Math.abs(sub_frq_arr[n] - h * f0) * mag_sq
                    den += mag_sq;
                }
            }
            return (2*num) / (f0*den);
        },
        "power": function(magnitudeArray,N,offset) {
            var sub_arr = magnitudeArray.xtract_subarray(offset,N);
            return null;
        },
        "odd_even_ratio": function(harmonicArray, frequencyArray, f0, N, offset) {
            if (typeof f0 != "number") {
                console.error("spectral_inharmonicity requires f0 to be defined. Call this.f0() to find.");
                return null;
            }
            var sub_harm_arr = harmonicArray.xtract_subarray(offset,N);
            var sub_frq_arr = frequencyArray.xtract_subarray(offset,N);
            var h=0, odd = 0.0, even = 0.0, temp;
            for (var n=0; n<sub_harm_arr.length; n++) {
                temp = sub_harm_arr[n];
                if (temp != 0.0) {
                    h = Math.floor(sub_frq_arr[n] / f0 + 0.5);
                    if (h % 2 != 0) {
                        odd += temp;
                    } else {
                        even += temp;
                    }
                }
            }
            
            if (odd == 0.0 || even == 0.0) {
                return 0.0;
            } else {
                return odd / even;
            }
        },
        "sharpness": function(magnitudeArray,N,offset) {
            var sub_arr = magnitudeArray.xtract_subarray(offset,N);
            var rv, sl = 0.0, g = 0.0, temp = 0.0;
            for (var n=0; n<sub_arr.length; n++) {
                sl = Math.pow(sub_arr[n], 0.23);
                g = (n < 15 ? 1.0 : 0.066 * Math.exp(0.171 * n));
                temp += n * g * sl;
            }
            temp = 0.11 * temp / sub_arr.length;
            return temp;
        },
        "spectral_slope": function(magnitudeArray,frequencyArray,N,offset) {
            var sub_mag_arr = magnitudeArray.xtract_subarray(offset,N);
            var sub_frq_arr = frequencyArray.xtract_subarray(offset,N);
            var F = 0.0, FA = 0.0, A =0.0, FXTRACT_SQ = 0.0;
            var M = sub_frq_arr.length;
            for (var n=0; n<sub_frq_arr.length; n++) {
                var f = sub_frq_arr[n];
                var a = sub_mag_arr[n];
                F += f;
                A += a;
                FA += f*a;
                FXTRACT_SQ += f*f;
            }
            return (1.0 / A) * (M * FA - F * A) / (M * FXTRACT_SQ - F * F);
        },
        "lowest_value": function(data, threshold, N, offset) {
            var sub_arr = data.xtract_subarray(offset,N);
            var result = +Infinity;
            for (var n=0; n<sub_arr.length; n++) {
                if (value > threshold) {
                    result = Math.min(result,sub_Arr[n]);
                }
            }
            return result;
        },
        "highest_value": function(data, N, offset) {
            var sub_arr = data.xtract_subarray(offset,N);
            return this.parent.helper.array_max(sub_arr);
        },
        "sum": function(data,N,offset) {
            var sub_arr = data.xtract_subarray(offset,N);
            return this.parent.help.array_sum(sub_arr);
        },
        "nonzero_count": function(data,N,offset) {
            var sub_arr = data.xtract_subarray(offset,N);
            var count = 0;
            for (var n=0; n<sub_arr.length; n++) {
                if (sub_arr != 0) {count++;}
            }
            return count;
        },
        "hps": function(magnitudeArray,frequencyArray,N,offset) {
            var sub_mag_arr = magnitudeArray.xtract_subarray(offset,N);
            var sub_frq_arr = frequencyArray.xtract_subarray(offset,N);
            var peak_index=0, position1_lwr=0, largest1_lwr=0, tempProduct=0, peak=0, ratio1=0;
            var M = Math.ceil(sub_frq_arr.length / 3.0);
            if (M <= 1) {
                console.error("Input Data is too short for HPS");
                return null;
            }
            
            for (var i=0; i<M; ++i) {
                tempProduct = sub_mag_arr[i]*sub_mag_arr[i*2]*sub_mag_arr[i*3];
                if (tempProduct > peak) {
                    peak = tempProduct;
                    peak_index = i;
                }
            }
            
            for (var i=0; i<sub_frq_arr.length; i++) {
                if (sub_mag_arr[i] > largest1_lwr && i != peak_index) {
                    largest1_lwr = sub_mag_arr[i];
                    position1_lwr = i;
                }
            }
            
            ratio1 = data[position1_lwr] / data[peak_index];
            
            if(position1_lwr > peak_index * 0.4 && position1_lwr < peak_index * 0.6 && ratio1 > 0.1)
                peak_index = position1_lwr;

            return frequencyArray[peak_index];
        },
        "f0": function(timeArray,sampleRate,N,offset) {
            if (typeof sampleRate != "number") {
                sampleRate = 44100.0;
            }
            var sub_arr;
            if (N != undefined || offset != undefined){
                sub_arr = timeArray.xtract_subarray(offset,N);
            } else {
                sub_arr = timeArray.subarray(0,timeArray.length);
            }
            var M = sub_arr.length/2;
            var threshold_peak =0.8, threshold_centre=0.3, err_tau_1=0, array_max=0;
            
            array_max = this.parent.helper.array_max(sub_arr);
            threshold_peak *= array_max;
            threshold_centre *= array_max;
            
            for (var n=0; n<sub_arr.length; n++) {
                if (sub_arr[n] > threshold_peak) {
                    sub_arr[n] = threshold_peak;
                } else if (sub_arr[n] < -threshold_peak) {
                    sub_arr[n] = -threshold_peak;
                }
                
                if (sub_arr[n] < threshold_centre) {
                    sub_arr[n] = 0;
                } else {
                    sub_arr[n] -= threshold_centre;
                }
            }
            
            for (var n=1; n<M; n++) {
                err_tau_1 += Math.abs(sub_arr[n] - sub_arr[n+1]);
            }
            for (var tau=2; tau<M; tau++) {
                var err_tau_x = 0;
                for (var n=1; n<M; n++) {
                    err_tau_x += Math.abs(sub_arr[n] - sub_arr[n+tau]);
                }
                if (err_tau_x < err_tau_1) {
                    var f0 = sampleRate / (tau + (err_tau_x / err_tau_1));
                    return f0;
                }
            }
            return -0;
        },
        "failsafe_f0": function(timeArray,sampleRate,N,offset) {
            console.log("failsafe_f0 == f0");
            return this.f0(timeArray,sampleRate,N,offset);
        },
        "spectrum": function(array,dft) {
            // This performs a DFT (for simplicity for now)
            // If using the Web Audio Analyser node, use the in-built FFT
            // For offline processing you have to use this or another FFT/DFT module
            // If running multiple batches ensure that you have used init_dft for speed
            if (dft == undefined) {
                dft = this.parent.init_dft(array.length);
            }
            var result = new Float32Array(dft.N);
            for (var k=0; k<dft.N; k++) {
                var imag = 0.0, real = 0.0;
                for (var n=0; n<dft.N; n++) {
                    real += array[n]*dft.real[k][n];
                    imag += array[n]*dft.imag[k][n];
                }
                result[k] = Math.sqrt((real*real)+(imag*imag));
            }
        },
        "mfcc": function(magnitudeArray,mfcc) {
            if (typeof mfcc != "object") {
                console.error("Invalid MFCC, must be MFCC object");
                return null;
            }
            if (mfcc.n_filters == 0) {
                console.error("Invalid MFCC, object must be built using init_mfcc");
                return null;
            }
            if (mfcc.filters[0].length != magnitudeArray.length) {
                console.error("Lengths do not match");
                return null;
            }
            var result = Float32Array(mfcc.n_filters);
            for (var f=0; f<mfcc.n_filters; f++) {
                result[f] = 0.0;
                var filter = mfcc.filters[f];
                for (var n=0; n<filter.length; n++) {
                    result[f] += magnitudeArray[n] * filter[n];
                }
                if (result[f] < 2e-42) {
                    result[f] = 2e-42;
                }
                result[f] = Math.log(result[f]);
            }
            return this.dct(result);
        },
        "dct": function(array) {
            var N = array.length;
            var result = new Float32Array(N);
            for (var n=0; n<N; n++) {
                for (var m=1; m<=N; ++m) {
                    result[n] += data[m-1] * Math.cos(Math.PI * (n/N)*(m-0.5));
                }
            }
            return result;
        },
        "autocorrelation": function(array) {
            var n = array.length;
            var result = new Float32Array(n);
            while(n--) {
                var corr = 0;
                for (var i=0; i<array.length - n; i++) {
                    corr += data[i] * data[i+n];
                }
                result[n] = corr;
            }
            return result;
        },
        "amdf": function(array) {
            var result = new Float32Array(n);
            var n = array.length;
            while(n--) {
                var md = 0.0;
                for (var i=0; i<array.length-n; i++) {
                    md += Math.abs(data[i] - data[i+n]);
                }
                result[n] = md / array.length;
            }
            return result;
        },
        "asdf": function(array) {
            var result = new Float32Array(n);
            var n = array.length;
            while(n--) {
                var sd = 0.0;
                for (var i=0; i<array.length-n; i++) {
                    sd += Math.pow(data[i]-data[i+n],2);
                }
                result[n] = sd / array.length;
            }
            return result;
        },
        "bark_coefficients": function(magnitudeArray,bark_limits) {
            var bands = bark_limits.length;
            var results = new Float32Array(bands);
            for (var band=0; band<bands-1; band++) {
                results[band] = 0.0;
                for (var n = bark_limits[band]; n < bark_limits[band+1]; n++) {
                    results[band] += magnitudeArray[n];
                }
            }
            return results;
        },
        "peak_spectrum": function(magnitudeArray, sampleRate, threshold, newFrequencyArray) {
            var N = magnitudeArray.length;
            var max=0.0, y=0.0, y2=0.0, y3=0.0, p=0.0;
            var q = sampleRate/N;
            if (threshold < 0 || threshold > 100) {
                threshold = 0;
                console.log("peak_spectrum threshold must be between 0 and 100");
            }
            threshold /= 100.0;
            var result = new Float32Array(N);
            if (newFrequencyArray == undefined) {
                newFrequencyArray = new Float32Array(N);
            }
            for (n=1; n<N-1; n++) {
                if (magnitudeArray[n] >= threshold) {
                    if (magnitudeArray[n] > magnitudeArray[n-1] && magnitudeArray[n] > magnitudeArray[n+1]) {
                        y = magnitudeArray[n-1];
                        y2 = magnitudeArray[n];
                        y3 = magnitudeArray[n+1];
                        p = 0.5*(y-y3)/ (magnitudeArray[n-1]-2 * (y2 + magnitudeArray[n+1]));
                        newFrequencyArray[n] = q * (n + 1 + p);
                        result[n] = y2 - 0.25 * (y-y3) *p;
                    } else {
                        result[n] = 0;
                        newFrequencyArray[n] = 0;
                    }
                } else {
                    result[n] = 0;
                    newFrequencyArray[n] = 0;
                }
            }
            return result;
        },
        "harmonic_spectrum": function(peakArray, peakFrequencyArray, f0, threshold, newFrequencyArray) {
            var N = peakArray.length;
            var result = new Float32Array(N);
            if (f0 == undefined || threshold == undefined) {
                console.error("harmonic_spectrum requires f0 and threshold to be numbers and defined");
                return null;
            }
            if (threshold > 1) {
                threshold /= 100.0;
                console.log("harmonic_spectrum assuming integer for threshold inserted, operating at t="+threshold);
            }
            while(n--) {
                if (peakFrequencyArray[n] != 0.0) {
                    var ratio = peakFrequencyArray[n] / f0;
                    var nearest = Math.round(ratio);
                    var distance = Math.abs(nearest-ratio);
                    if (distance > threshold) {
                        result[n] = 0.0;
                        newFrequencyArray[n] = 0.0;
                    } else {
                        result[n] = peakArray[n];
                        newFrequencyArray[n] =  peakFrequencyArray[n];
                    }
                } else {
                    result[n] = 0.0;
                    newFrequencyArray[n] = 0.0;
                }
            }
            return result;
        }
    }
    this.init_dft = function(N) {
        var dft = {
            N: N,
            real: [],
            imag: []
        }
        var power_const = -2.0 * Math.PI / N;;
        for (var k=0; k<N; k++) {
            var power_k = power_const*k;
            real[k] = new Float32Array(N);
            imag[k] = new Float32Array(N);
            for (var n=0; n<N; n++) {
                var power = power_k*n;
                real[k][n] = Math.cos(power);
                imag[k][n] = Math.sin(power);
            }
        }
        return dft;
    }
    this.init_mfcc = function(N, nyquist, style, freq_min, freq_max, freq_bands) {
        var mfcc = {
            n_filters: freq_bands,
            filters: []
        };
        var norm=1, M=N/2, height, norm_fact;
        
        if (freq_bands <= 1) {return null;}
        var mel_freq_max = 1127 * Math.log(1+freq_max/700);
        var mel_freq_min = 1127 * Math.log(1+freq_min/700);
        var freq_bw_mel = (mel_freq_max - mel_freq_min) / freq_bands;
        
        var mel_peak = new Float32Array(freq_bands+2);
        var lin_peak = new Float32Array(freq_bands+2);
        var fft_peak = new Float32Array(freq_bands+2);
        var height_norm = new Float32Array(freq_bands);
        mel_peak[0] = mel_freq_min;
        lin_peak[0] = freq_min;
        fft_peak[0] = lin_peak[0] / nyquist * M;
        
        for (var n = 1; n < (freq_bands + 2); ++n)
        {
            //roll out peak locations - mel, linear and linear on fft window scale
            mel_peak[n] = mel_peak[n - 1] + freq_bw_mel;
            lin_peak[n] = 700 * (Math.exp(mel_peak[n] / 1127) -1);
            fft_peak[n] = lin_peak[n] / nyquist * M;
        }
        
        for (var n = 0; n < freq_bands; n++)
        {
            //roll out normalised gain of each peak
            if (style == "XTRACT_EQUAL_GAIN")
            {
                height = 1;
                norm_fact = norm;
            }
            else
            {
                height = 2 / (lin_peak[n + 2] - lin_peak[n]);
                norm_fact = norm / (2 / (lin_peak[2] - lin_peak[0]));
            }
            height_norm[n] = height * norm_fact;
        }
        
        var i = 0, inc;
        for (var n = 0; n < freq_bands; n++) {
            // calculate the rise increment
            if(n==0) {
                inc = height_norm[n] / fft_peak[n];
            } else {
                inc = height_norm[n] / (fft_peak[n] - fft_peak[n - 1]);
            }
            var val = 0;
            // Create array
            mfcc.filters[n] = new Float32Array(N);
            // fill in the rise
            for(; i <= fft_peak[n]; i++)
            {
                mfcc.filters[n][i] = val;
                val += inc;
            }
            // calculate the fall increment
            inc = height_norm[n] / (fft_peak[n + 1] - fft_peak[n]);
            
            val = 0;
            next_peak = fft_peak[n + 1];
            
             // reverse fill the 'fall'
            for(i = Math.floor(next_peak); i > fft_peak[n]; i--)
            {
                mfcc.filters[n][i] = val;
                val += inc;
            }
        }
        return mfcc;
    }
    this.init_bark = function(N, sampleRate, bands) {
        var edges = [0, 100, 200, 300, 400, 510, 630, 770, 920, 1080, 1270, 1480, 1720, 2000, 2320, 2700, 3150, 3700, 4400, 5300, 6400, 7700, 9500, 12000, 15500, 20500, 27000];
        var bands = edges.length;
        var band_limits = new Int32Array(bands);
        while(bands--) {
            band_limits[bands] = edges[bands] / (sampleRate*N);
        }
        return band_limits;
    }
}

var jsXtractAnalyser = function(analyserNode) {
    this.analyserNode = analyserNode;
    
    this.processFeatures = function(callback) {
        if (typeof callback != "function") {
            console.error("callback must be a function call of function(this,data) where data is an object passed by processFeatures with time & frequency domain data");
            return;
        }
        var N = this.analyserNode.fftSize/2;
        var data = {
            "window_size": N,
            "sample_rate": this.analyserNode.context.sampleRate,
            "TimeData": new Float32Array(N),
            "SpectrumLogData": new Float32Array(N),
            "SpectrumData": new Float32Array(N),
            "Frequencies": new Float32Array(N)
        };
        this.analyserNode.getFloatFrequencyData(data.SpectrumLogData);
        if (this.analyserNode.getFloatTimeDomainData == undefined) {
            var TempTime = new Uint8Array(data.window_size);
            this.analyserNode.getByteTimeDomainData(TempTime);
            for (var n=0; n<data.window_size; n++) {
                var num = TempTime[n];
                num /= 128.0;
                num -= 1.0;
                data.TimeData[n] = num;
            }
            delete TempTime;
        } else {
            this.analyserNode.getFloatTimeDomainData(data.TimeData);
        }
        for (var N=FrequencyData.length, i=0; i<N; i++) {
            data.Frequencies[i] = i*((data.sample_rate/2)/N);
            data.SpectrumData[i] = Math.pow(10,data.SpectrumLogData[i]/20);
        }
        return callback(this,data);
    }
}
jsXtractAnalyser.prototype = new jsXtract();
jsXtractAnalyser.prototype.constructor = jsXtractAnalyser;