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

// This binds the js-xtract with the Web Audio API AudioBuffer and AnalyserNodes

AnalyserNode.prototype.getXtractData = function() {
    var N = this.fftSize/2;
    var data = {
        "window_size": N,
        "sample_rate": this.context.sampleRate,
        "TimeData": new Float32Array(N),
        "SpectrumLogData": new Float32Array(N),
        "SpectrumData": new Float32Array(N),
        "Frequencies": new Float32Array(N)
    };
    this.getFloatFrequencyData(data.SpectrumLogData);
    if (this.getFloatTimeDomainData == undefined) {
        var TempTime = new Uint8Array(data.window_size);
        this.getByteTimeDomainData(TempTime);
        for (var n=0; n<data.window_size; n++) {
            var num = TempTime[n];
            num /= 128.0;
            num -= 1.0;
            data.TimeData[n] = num;
        }
        delete TempTime;
    } else {
        this.getFloatTimeDomainData(data.TimeData);
    }
    for (var N=data.Frequencies.length, i=0; i<N; i++) {
        data.Frequencies[i] = i*((data.sample_rate/2)/N);
        data.SpectrumData[i] = Math.pow(10,data.SpectrumLogData[i]/20);
    }
    return data;
}

AudioBuffer.prototype.getFramedData = function(frame_size) {
    if (typeof frame_size != "number") {
        console.error("getFramedData requires frame_size to be a number");
    }
    if (frame_size <= 0) {
        console.error("getFramedData requires frame_size to be a positive number");
    }
    if (frame_size != Math.floor(frame_size)) {
        console.log("getFramedData requires frame_size to be integer");
        frame_size = Math.floor(frame_size);
    }
    var frames = [this.numberOfChannels];
    var N = this.length;
    var K = Math.ceil(N/frame_size);
    for (var c=0; c<this.numberOfChannels; c++) {
        frames[c] = [];
        var m = 0;
        var data = this.getChannelData(c);
        for (var k=0; k<K; k++) {
            frames[c][k] = new Float32Array(frame_size);
            for (var n=0; n<frame_size; n++) {
                frames[c][k][n] = data[m];
                m++;
            }
        }
    }
    return frames;
}