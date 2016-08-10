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

if (AnalyserNode) {

    AnalyserNode.prototype.timeData = undefined;
    AnalyserNode.prototype.spectrumData = undefined;
    AnalyserNode.prototype.getXtractData = function () {
        if (this.timeData == undefined || this.scpectrumData == undefined) {
            this.timeData = new TimeData(this.fftSize, this.context.sampleRate);
            this.spectrumData = new SpectrumData(this.frequencyBinCount, this.context.sampleRate);
        }
        var dst = new Float32Array(this.fftSize);
        if (this.getFloatTimeDomainData) {
            this.getFloatTimeDomainData(dst);
        } else {
            var view = new UInt8Array(this.fftSize);
            this.getByteTimeDomainData(view);
            for (var i=0; i<this.fftSize; i++) {
                dst[i] = view[i];
                dst[i] = (dst[i]/127.5)-1;
            }
        }
        this.timeData.copyDataFrom(dst);
        this.timeData.result.spectrum = this.spectrumData;
        var LogStore = new Float32Array(this.frequencyBinCount);
        this.getFloatFrequencyData(LogStore);
        for (var i=0; i<this.frequencyBinCount; i++) {
            LogStore[i] = Math.pow(10.0, LogStore[i]/20);
        }
        this.spectrumData.copyDataFrom(LogStore);
        return this.timeData;
    }
    AnalyserNode.prototype.previousFrame = undefined;
    AnalyserNode.prototype.previousResult = undefined;
    AnalyserNode.prototype.frameCallback = function (func, arg_this) {
        // Perform a callback on each frame
        // The function callback has the arguments (current_frame, previous_frame, previous_result)
        if (this.callbackObject == undefined) {
            this.callbackObject = this.context.createScriptProcessor(this.fftSize, 1, 1);
            this.connect(this.callbackObject);
        }
        var _func = func;
        var _arg_this = arg_this;
        var self = this;
        this.callbackObject.onaudioprocess = function (e) {
            var current_frame = self.getXtractData();
            this.previousResult = _func.call(_arg_this,current_frame, this.previousFrame, this.previousResult);
            this.previousFrame = current_frame;
            var N = e.outputBuffer.length;
            var output = new Float32Array(N);
            var result = this.previousResult;
            if (typeof this.previousResult != "number") {
                result = 0.0;
            }
            for (var i=0; i<N; i++) {
                output[i] = result;
            }
            e.outputBuffer.copyToChannel(output, 0, 0);
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
}

if (AudioBuffer) {

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
        var frames = [];
        var N = this.length;
        var K = Math.ceil(N / frame_size);
        for (var c = 0; c < this.numberOfChannels; c++) {
            var data = this.getChannelData(c);
            frames[c] = [];
            for (var k=0; k<K; k++) {
                var frame = new TimeData(hop_size, this.sampleRate);
                frame.copyDataFrom(data.subarray(frame_size*k, frame_size*k+hop_size));
                frames[c].push(frame);
            }
        }
        return frames;
    }

    AudioBuffer.prototype.xtract_process_frame_data = function (func, frame_size, hop_size, arg_this) {
        // Process each data point and return a JSON of each frame result from func
        // Func must return something for this to be a useful feature
        // func has the following arguments (element, index, array);
        var result = {
            num_channels: this.numberOfChannels,
            channel_results: []
        };
        var K = frame_size >> 1;
        var frames = this.xtract_get_data_frames(frame_size,hop_size);
        for (var c = 0; c < frames.length; c++) {
            result.channel_results[c] = {
                num_frames: frames[c].length,
                results: []
            };
            for (var k=0; k<frames[c].length; k++) {
                var frame = frames[c][k];
                func.call(arg_this,frame,k,frames[c]);
                result.channel_results[c].results[k] = JSON.parse(frame.toJSON());
            }
        }
        return result;
    }
}
