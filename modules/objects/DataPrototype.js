/// <reference path="../../typings/objects/DataPrototype.d.ts" />
import {xtract_array_to_JSON} from "../functions/xtract_array_to_JSON";
import {createDctCoefficients, createMfccCoefficients, createBarkCoefficients, createChromaCoefficients} from "./CommonMemory";

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

export class DataPrototype {
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
                    str = '"' + n + '": ' + xtract_array_to_JSON(p);
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
        return createDctCoefficients(Number(N));
    }

    createMfccCoefficients(N, nyquist, style, freq_min, freq_max, freq_bands) {
        N = Number(N);
        nyquist = Number(nyquist);
        freq_min = Number(freq_min);
        freq_max = Number(freq_max);
        freq_bands = Number(freq_bands);
        return createMfccCoefficients(N, nyquist, style, freq_min, freq_max, freq_bands);
    }

    createBarkCoefficients(N, sampleRate, numBands) {
        N = Number(N);
        sampleRate = Number(sampleRate);
        numBands = Number(numBands);
        return createBarkCoefficients(N, sampleRate, numBands);
    }

    createChromaCoefficients(N, sampleRate, nbins, A440, f_ctr, octwidth) {
        N = Number(N);
        sampleRate = Number(sampleRate);
        nbins = Number(nbins);
        A440 = Number(A440);
        f_ctr = Number(f_ctr);
        octwidth = Number(octwidth);
        return createChromaCoefficients(N, sampleRate, nbins, A440, f_ctr, octwidth);
    }
}
