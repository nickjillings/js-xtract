var PeakSpectrumData = function (N, sampleRate, parent) {
    if (N == undefined || N <= 0) {
        console.error("SpectrumData constructor requires N to be a defined, whole number");
        return;
    }
    if (sampleRate == undefined) {
        sampleRate = Math.PI;
    }
    this.__proto__ = new SpectrumData(N);
    this.__proto__.constructor = PeakSpectrumData;

    Object.defineProperty(this, "features", {
        'get': function () {
            return this.constructor.prototype.features;
        },
        'set': function () {}
    });

    // Peak Specturm features
    Object.defineProperty(this, "spectral_inharmonicity", {
        'value': function () {
            if (this.result.spectral_inharmonicity == undefined) {
                this.result.spectral_inharmonicity = xtract_spectral_inharmonicity(this.getData(), this.sampleRate);
            }
            return this.result.spectral_inharmonicity;
        }
    });

    Object.defineProperty(this, "harmonic_spectrum", {
        'value': function (threshold) {
            if (this.result.harmonic_spectrum == undefined) {
                if (this.f0 == undefined) {
                    this.spectral_fundamental(this.getData(), this.sampleRate);
                }
                this.result.harmonic_spectrum = new HarmonicSpectrumData(this.length, this.sampleRate, this);
                var hs = xtract_harmonic_spectrum(this.getData(), this.f0, threshold);
                this.result.harmonic_spectrum.copyDataFrom(hs.subarray(0, this.length));
            }
            return this.result.harmonic_spectrum;
        }
    });
}
