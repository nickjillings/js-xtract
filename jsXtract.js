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

var jsXtract = function() {
    this.features = {
        "mean": function(inputArray) {
            var result = 0.0;
            for (var value of inputArray) {
                result += value;
            }
            return result /= inputArray.length;
        },
        "variance": function(inputArray,mean) {
            var result = 0.0;
            var r_mean = mean || this.mean(inputArray);
            for (var value of inputArray) {
                result += Math.pow(value-r_mean,2);
            }
            return result /= (inputArray.length - 1);
        },
        "standard_deviation": function(inputArray,variance) {
            return Math.sqrt(variance || this.variance(inputArray));
        },
        "average_deviation": function(inputArray,mean) {
            var result = 0;
            var r_mean = mean || this.mean(inputArray);
            for (var value of inputArray) {
                result += Math.abs(value - r_mean);
            }
            return result /= inputArray.length;
        },
        "skewness": function(inputArray,mean,standard_deviation) {
            var result = 0.0;
            var r_mean = mean || this.mean(inputArray);
            var r_sd = standard_deviation || this.standard_deviation(inputArray,this.variance(inputArray,mean || r_mean));
            for (var value of inputArray) {
                result += Math.pow((value - r_mean) / r_sd,3);
            }
            return result /= inputArray.length;
        },
        "kurtosis": function(inputArray,mean,standard_deviation) {
            var result = 0.0;
            var r_mean = mean || this.mean(inputArray);
            var r_sd = standard_deviation || this.standard_deviation(inputArray,this.variance(inputArray,mean || r_mean));
            for (var value of inputArray) {
                result += Math.pow((value - r_mean) / r_sd,4);
            }
            result /= inputArray.length;
            return result -= 3.0;
        },
        "spectral_centroid": function(magnitudeArray,frequencyArray) {
            var FA = 0, A = 0;
            for (var n=0; n<magnitudeArray.length; n++) {
                FA += magnitudeArray[n] * frequencyArray[n];
                A += magnitudeArray[n];
            }
            if (A == 0.0) {
                return 0.0;
            } else {
                return FA / A;
            }
        },
        "spectral_mean": function(magnitudeArray,frequencyArray) {
            var FA = 0, A = 0;
            for (var n=0; n<magnitudeArray.length; n++) {
                FA += magnitudeArray[n] * frequencyArray[n];
                A += magnitudeArray[n];
            }
            if (A == 0.0) {
                return 0.0;
            } else {
                return FA / A;
            }
        },
        "spectral_variance": function(magnitudeArray,frequencyArray,spectral_mean) {
            var r_mean = spectral_mean || this.features.spectral_mean(magnitudeArray,frequencyArray);
            var A = 0, result = 0;
            for (var n=0; n<magnitudeArray.length; n++) {
                A += magnitudeArray[n];
                result += Math.pow(frequencyArray[n] - r_mean,2) * magnitudeArray[n];
            }
            return result /= A;
        },
        "spectral_standard_deviation": function(magnitudeArray,frequencyArray,spectral_variance) {
            var r_variance = spectral_variance || this.features.spectral_variance(magnitudeArray,frequencyArray);
        },
        "spectral_skewness": function(magnitudeArray,frequencyArray,spectral_mean,spectral_standard_deviation) {
            var r_mean = spectral_mean || this.features.spectral_mean(magnitudeArray,frequencyArray);
            var r_std = spectral_standard_deviation || this.features.spectral_standard_deviation(magnitudeArray,frequencyArray,this.features.spectral_variance(magnitudeArray,frequencyArray,r_mean));
            var result = 0;
            for (var n=0; n<magnitudeArray.length; n++) {
                result += Math.pow(frequencyArray[n] - r_mean,3)*magnitudeArray[n];
            }
            return result /= Math.pow(r_std,3);
        },
        "spectral_kurtosis": function(magnitudeArray,frequencyArray,spectral_mean,spectral_standard_deviation) {
            var r_mean = spectral_mean || this.features.spectral_mean(magnitudeArray,frequencyArray);
            var r_std = spectral_standard_deviation || this.features.spectral_standard_deviation(magnitudeArray,frequencyArray,this.features.spectral_variance(magnitudeArray,frequencyArray,r_mean));
            var result = 0;
            for (var n=0; n<magnitudeArray.length; n++) {
                result += Math.pow(frequencyArray[n] - r_mean,4)*magnitudeArray[n];
            }
            result /= Math.pow(r_std,4);
            return result -= 3.0;
        },
        "irregularity_k": function(magnitudeArray) {
            var result = 0;
            for(var n=1; n<magnitudeArray.length-1; n++) {
                result += Math.abs(magnitudeArray[n] - (magnitudeArray[n-1]+magnitudeArray[n]+magnitudeArray[n+1])/3);
            }
            return result;
        },
        "irregularity_j": function(magnitudeArray) {
            var num = 0, den = 0;
            for (var n=0; n<magnitudeArray.length-1; n++) {
                num += Math.pow(magnitudeArray[n] - magnitudeArray[n+1],2);
                den += Math.pow(magnitudeArray[n],2);
            }
            return num / den;
        },
        "smoothness": function(magnitudeArray) {
            var prev = 0, current = 0, next = 0, temp = 0;
            prev = magnitudeArray[0] <= 0 ? 1e-5 : magnitudeArray[0];
            current = magnitudeArray[1] <= 0 ? 1e-5 : magnitudeArray[1];
            for (var n=1; n<magnitudeArray.length-1; n++) {
                if (n>1) {
                    prev = current;
                    current = next;
                }
                next = magnitudeArray[n+1] <= 0 ? 1e-5 : magnitudeArray[n+1];
                temp += Math.abs(20.0*Math.log(current) - (20.0*Math.log(prev) + 20.0*Math.log(current) + 20.0*Math.log(next))/3.0)
            }
            return temp;
        },
        "zcr": function(timeArray) {
            var result = 0;
            for (var n=1; n<timeArray.length; n++) {
                if (timeArray[n] * timeArray[n-1] < 0) {result++;}
            }
            return result;
        },
        "rolloff": function(magnitudeArray,sampleRate,threshold) {
            var pivot = 0, temp = 0;
            for (var value of magnitudeArray) {
                pivot += value;
            }
            pivot *= threshold / 100.0;
            var n = 0;
            while(temp < pivot) {
                temp += magnitudeArray[n];
                n++;
            }
            return n * (sampleRate/magnitudeArray.length);
        }
    }
}

var jsXtractAnalyser = function(analyserNode) {
    this.analyserNode = analyserNode;
    this.processFeatures = function(featureObject) {
        var results = {
            "window_size": this.analyserNode.fftSize/2,
            "sample_rate": this.analyserNode.context.sampleRate,
            "features": {}
        };
        var MagnitudeData = new Float32Array(results.window_size);
        var TimeData = new Float32Array(results.window_size);
        var FrequencyData = new Float32Array(results.window_size);
        var MagnitudeData_lin = new Float32Array(results.window_size);
        this.analyserNode.getFloatFrequencyData(MagnitudeData);
        this.analyserNode.getFloatTimeDomainData(TimeData);
        for (var N=FrequencyData.length, i=0; i<N; i++) {
            FrequencyData[i] = i*((results.sample_rate/2)/N);
            MagnitudeData_lin[i] = Math.pow(10,MagnitudeData[i]/20);
        }
        for (var feature of featureObject) {
            if (eval("typeof this.features."+feature+'=="function"')) {
                switch(feature) {
                    case "mean":
                        results.features.mean = this.features.mean(TimeData);
                        break;
                    case "variance":
                        results.features.variance = this.features.variance(TimeData,results.features.mean);
                        break;
                    case "standard_deviation":
                        results.features.standard_deviation = this.features.standard_deviation(TimeData,results.features.variance || this.features.variance(TimeData,results.features.mean));
                        break;
                    case "average_deviation":
                        results.features.average_deviation = this.features.average_deviation(TimeData,results.features.mean);
                        break;
                    case "skewness":
                        results.features.skewness = this.features.skewness(TimeData,results.features.mean,results.features.standard_deviation);
                        break;
                    case "kurtosis":
                        results.features.kurtosis = this.features.kurtosis(TimeData,results.features.mean,results.features.standard_deviation);
                        break;
                    case "spectral_centroid":
                    case "spectral_mean":
                        results.features.spectral_centroid = this.features.spectral_centroid(MagnitudeData_lin,FrequencyData);
                        break;
                }
            }
        }
        return results;
    }
}
jsXtractAnalyser.prototype = new jsXtract();
jsXtractAnalyser.prototype.constructor = jsXtractAnalyser;