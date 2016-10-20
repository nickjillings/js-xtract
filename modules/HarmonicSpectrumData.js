var HarmonicSpectrumData = function (N, sampleRate, parent) {
    if (N == undefined || N <= 0) {
        console.error("SpectrumData constructor requires N to be a defined, whole number");
        return;
    }
    if (sampleRate == undefined) {
        sampleRate = Math.PI;
    }
    this.__proto__ = new PeakSpectrumData(N);
    this.__proto__.constructor = HarmonicSpectrumData;

    Object.defineProperty(this, "features", {
        'get': function () {
            return this.constructor.prototype.features;
        },
        'set': function () {}
    });

    // Harmonic Spectrum features
    Object.defineProperty(this, "odd_even_ratio", {
        'value': function () {
            if (this.result.odd_even_ratio == undefined) {
                if (this.f0 == undefined) {
                    this.spectral_fundamental(this.getData(), this.sampleRate);
                }
                this.result.odd_even_ratio = xtract_odd_even_ratio(this.getData(), this.f0);
            }
            return this.result.odd_even_ratio;
        }
    });

    Object.defineProperty(this, "noisiness", {
        'value': function () {
            if (parent.constructor !== PeakSpectrumData) {
                this.result.noisiness = null;
            } else {
                this.result.noisiness = xtract_noisiness(this.nonzero_count(), parent.nonzero_count());
            }
            return this.result.noisiness;
        }
    });
}
