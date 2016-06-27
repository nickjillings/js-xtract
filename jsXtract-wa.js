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

AnalyserNode.prototype.getXtractData = function () {
    var N = this.fftSize / 2;
    var data = {
        "window_size": N,
        "sample_rate": this.context.sampleRate,
        "TimeData": new Float32Array(N),
        "SpectrumData": new Float32Array(2 * N + 2)
    };
    var SpectrumLogData = new Float32Array(N + 1);
    this.getFloatFrequencyData(SpectrumLogData);
    if (this.getFloatTimeDomainData == undefined) {
        var TempTime = new Uint8Array(data.window_size);
        this.getByteTimeDomainData(TempTime);
        for (var n = 0; n < data.window_size; n++) {
            var num = TempTime[n];
            num /= 128.0;
            num -= 1.0;
            data.TimeData[n] = num;
        }
        delete TempTime;
    } else {
        this.getFloatTimeDomainData(data.TimeData);
    }
    for (var N = SpectrumLogData.length, i = 0; i < N; i++) {
        data.SpectrumData[i + N] = i * ((data.sample_rate / 2) / N);
        data.SpectrumData[i] = Math.pow(10, SpectrumLogData[i] / 20);
    }
    return data;
}

AnalyserNode.prototype.frameCallback = function (func, arg_this) {
    // Perform a callback on each frame
    if (this.callbackObject == undefined) {
        this.callbackObject = this.context.createScriptProcessor(this.fftSize, 1, 0);
        this.connect(this.callbackObject);
    }
    var _func = func;
    var _arg_this = arg_this;
    var self = this;
    this.callbackObject.onaudioprocess = function (e) {
        _func.call(_arg_this, self.getXtractData());
    }
}

AnalyserNode.prototype.clearCallback = function () {
    this.disconnect(this.callbackObject);
    this.callbackObject = undefined;
}

AnalyserNode.prototype.xtractFrame = function (func, arg_this) {
    // Collect the current frame of data and perform the callback function
    func.call(arg_this, this.getXtractData());
}

AudioBuffer.prototype.xtract_get_data_frames = function (frame_size, hop_size) {
    if (typeof frame_size != "number") {
        throw ("xtract_get_data_frames requires the frame_size to be defined");
    }
    if (frame_size <= 0 || frame_size != Math.floor(frame_size)) {
        throw ("xtract_get_data_frames requires the frame_size to be a positive integer");
    }
    if (hop_size == undefined) {
        hop_size = frame_size;
    }
    if (hop_size <= 0 || hop_size != Math.floor(hop_size)) {
        throw ("xtract_get_data_frames requires the hop_size to be a positive integer");
    }
    var frames = [this.numberOfChannels];
    var N = this.length;
    var K = Math.ceil(N / frame_size);
    for (var c = 0; c < this.numberOfChannels; c++) {
        var data = this.getChannelData(c);
        frames[c] = data.xtract_get_data_frames(frame_size, hop_size, true);
    }
    return frames;
}

AudioBuffer.prototype.xtract_process_frame_data = function (func, frame_size, hop_size, arg_this) {
    // Process each data point and return a JSON of each frame result from func
    // Func must return something for this to be a useful feature
    // func has three arguments (currentFrame, previousFrame, previousResult);
    var result = {
        num_channels: this.numberOfChannels,
        channel_results: []
    };
    var K = frame_size >> 1;
    var frame_time = 0;
    for (var c = 0; c < this.numberOfChannels; c++) {
        var channel_vector = this.getChannelData(c);
        var channel_result = {
            num_frames: channel_vector.length,
            results: []
        }
        result.channel_results.push(channel_vector.xtract_process_frame_data(func, this.sampleRate, frame_size, hop_size, arg_this));

    }
    return result;
}
