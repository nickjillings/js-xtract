var PeakSpectrumData = function (N, sampleRate, parent) {
    if (N === undefined || N <= 0) {
        throw ("SpectrumData constructor requires N to be a defined, whole number");
    }
    if (sampleRate === undefined) {
        sampleRate = Math.PI;
    }
    SpectrumData.call(this, N);

    Object.defineProperties(this, {
        "spectral_inharmonicity": {
            'value': function () {
                if (this.result.spectral_inharmonicity === undefined) {
                    this.result.spectral_inharmonicity = xtract_spectral_inharmonicity(this.data, this.sampleRate);
                }
                return this.result.spectral_inharmonicity;
            }
        },
        "harmonic_spectrum": {
            'value': function (threshold) {
                if (this.result.harmonic_spectrum === undefined) {
                    if (this.f0 === undefined) {
                        this.spectral_fundamental(this.data(), this.sampleRate);
                    }
                    this.result.harmonic_spectrum = new HarmonicSpectrumData(this.length, this.sampleRate, this);
                    var hs = xtract_harmonic_spectrum(this.data(), this.f0, threshold);
                    this.result.harmonic_spectrum.copyDataFrom(hs.subarray(0, this.length));
                }
                return this.result.harmonic_spectrum;
            }
        }
    });
};
PeakSpectrumData.prototype = Object.create(SpectrumData.prototype);
PeakSpectrumData.prototype.constructor = PeakSpectrumData;
