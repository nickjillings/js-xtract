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
                this.result.odd_even_ratio = xtract_odd_even_ratio(_data, _f0);
            }
            return this.result.odd_even_ratio;
        }
    });
}
