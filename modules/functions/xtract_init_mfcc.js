/// <reference path="../../typings/functions.d.ts" />

function get_fft_peak(N, freq_max, freq_min, freq_bands, nyquist, style) {
    var norm = 1,
        M = N / 2,
        height, norm_fact, n;
    var mel_freq_max = 1127 * Math.log(1 + freq_max / 700);
    var mel_freq_min = 1127 * Math.log(1 + freq_min / 700);
    var freq_bw_mel = (mel_freq_max - mel_freq_min) / freq_bands;

    var mel_peak = new Float64Array(freq_bands + 2);
    var lin_peak = new Float64Array(freq_bands + 2);
    var fft_peak = new Float64Array(freq_bands + 2);
    var height_norm = new Float64Array(freq_bands);
    mel_peak[0] = mel_freq_min;
    lin_peak[0] = freq_min;
    fft_peak[0] = Math.floor(lin_peak[0] / nyquist * M);

    for (n = 1; n < (freq_bands + 2); ++n) {
        //roll out peak locations - mel, linear and linear on fft window scale
        mel_peak[n] = mel_peak[n - 1] + freq_bw_mel;
        lin_peak[n] = 700 * (Math.exp(mel_peak[n] / 1127) - 1);
        fft_peak[n] = Math.floor(lin_peak[n] / nyquist * M);
    }

    for (n = 0; n < freq_bands; n++) {
        //roll out normalised gain of each peak
        if (style === "XTRACT_EQUAL_GAIN") {
            height = 1;
            norm_fact = norm;
        } else {
            height = 2 / (lin_peak[n + 2] - lin_peak[n]);
            norm_fact = norm / (2 / (lin_peak[2] - lin_peak[0]));
        }
        height_norm[n] = height * norm_fact;
    }
    return {
        f: fft_peak,
        h: height_norm
    };
}

export function xtract_init_mfcc(N, nyquist, style, freq_min, freq_max, freq_bands) {
    var mfcc = {
        n_filters: freq_bands,
        filters: []
    };
    var norm = 1,
        M = N / 2,
        height, norm_fact, n;

    if (freq_bands <= 1) {
        return null;
    }

    var i = 0,
        fh = get_fft_peak(N, freq_max, freq_min, freq_bands, nyquist, style),
        inc;
    var fft_peak = fh.f,
        height_norm = fh.h;
    var next_peak;
    for (n = 0; n < freq_bands; n++) {
        // calculate the rise increment
        if (n === 0) {
            inc = height_norm[n] / fft_peak[n];
        } else {
            inc = height_norm[n] / (fft_peak[n] - fft_peak[n - 1]);
        }
        var val = 0;
        // Create array
        mfcc.filters[n] = new Float64Array(N);
        // fill in the rise
        for (; i <= fft_peak[n]; i++) {
            mfcc.filters[n][i] = val;
            val += inc;
        }
        // calculate the fall increment
        inc = height_norm[n] / (fft_peak[n + 1] - fft_peak[n]);

        val = 0;
        next_peak = fft_peak[n + 1];

        // reverse fill the 'fall'
        for (i = Math.floor(next_peak); i > fft_peak[n]; i--) {
            mfcc.filters[n][i] = val;
            val += inc;
        }
    }
    return mfcc;
}
