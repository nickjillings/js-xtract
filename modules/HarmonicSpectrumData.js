/*globals Float32Array, Float64Array */
/*globals window, console */
var HarmonicSpectrumData = function (N, sampleRate, parent) {
    if (N === undefined || N <= 0) {
        console.error("SpectrumData constructor requires N to be a defined, whole number");
        return;
    }
    if (sampleRate === undefined) {
        sampleRate = Math.PI;
    }
    PeakSpectrumData.call(this, N);

    Object.defineProperties(this, {
        "odd_even_ratio": {
            'value': function () {
                if (this.result.odd_even_ratio === undefined) {
                    if (this.f0 === undefined) {
                        this.spectral_fundamental(this.data(), this.sampleRate);
                    }
                    this.result.odd_even_ratio = xtract_odd_even_ratio(this.data(), this.f0);
                }
                return this.result.odd_even_ratio;
            }
        },
        "noisiness": {
            'value': function () {
                if (parent.constructor !== PeakSpectrumData) {
                    this.result.noisiness = null;
                } else {
                    this.result.noisiness = xtract_noisiness(this.nonzero_count(), parent.nonzero_count());
                }
                return this.result.noisiness;
            }
        }
    });
};
HarmonicSpectrumData.prototype = Object.create(PeakSpectrumData.prototype);
HarmonicSpectrumData.prototype.constructor = HarmonicSpectrumData;
