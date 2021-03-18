/// <reference path="../../typings/objects/CommonMemory.d.ts" />

import {xtract_init_dct} from "../functions/xtract_init_dct";
import {xtract_init_mfcc} from "../functions/xtract_init_mfcc";
import {xtract_init_bark} from "../functions/xtract_init_bark";
import {xtract_init_chroma} from "../functions/xtract_init_chroma";

function searchMapProperties(map, properties) {
    var match = map.find(function (e) {
        for (var prop in properties) {
            if (e[prop] !== properties[prop]) {
                return false;
            }
        }
        return true;
    });
    return match;
}

var dct_map = {
    parent: this,
    store: [],
    createCoefficients: function (N) {
        var match = searchMapProperties(this.store, {
            N: N
        });
        if (!match) {
            match = {
                N: N,
                data: xtract_init_dct(N)
            };
            this.store.push(match);
        }
        return match.data;
    }
};

var mfcc_map = {
    parent: this,
    store: [],
    createCoefficients: function (N, nyquist, style, freq_min, freq_max, freq_bands) {
        var search = {
            N: N,
            nyquist: nyquist,
            style: style,
            freq_min: freq_min,
            freq_max: freq_max,
            freq_bands: freq_bands
        };
        var match = searchMapProperties(this.store, search);
        if (!match) {
            match = search;
            match.data = xtract_init_mfcc(N, nyquist, style, freq_min, freq_max, freq_bands);
            this.store.push(match);
        }
        return match.data;
    }
};

var bark_map = {
    parent: this,
    store: [],
    createCoefficients: function (N, sampleRate, numBands) {
        var search = {
            N: N,
            sampleRate: sampleRate,
            numBands: numBands
        };
        var match = searchMapProperties(this.store, search);
        if (!match) {
            match = search;
            match.data = xtract_init_bark(N, sampleRate, numBands);
            this.store.push(match);
        }
        return match.data;
    }
};


var chroma_map = {
    parent: this,
    store: [],
    createCoefficients: function (N, sampleRate, nbins, A440, f_ctr, octwidth) {
        var search = {
            N: N,
            sampleRate: sampleRate,
            nbins: nbins,
            A440: A440,
            f_ctr: f_ctr,
            octwidth: octwidth
        };
        var match = searchMapProperties(this.store, search);
        if (!match) {
            match = search;
            match.data = xtract_init_chroma(N, sampleRate, nbins, A440, f_ctr, octwidth);
            this.store.push(match);
        }
        return match.data;
    }
};

export function createDctCoefficients(N) {
    return dct_map.createCoefficients(N);
}

export function createMfccCoefficients(N, nyquist, style, freq_min, freq_max, freq_bands) {
    return mfcc_map.createCoefficients(N, nyquist, style, freq_min, freq_max, freq_bands);
}

export function createBarkCoefficients(N, sampleRate, numBands) {
    if (typeof numBands !== "number" || numBands < 0 || numBands > 26) {
        numBands = 26;
    }
    return bark_map.createCoefficients(N, sampleRate, numBands);
}

export function createChromaCoefficients(N, sampleRate, nbins, A440, f_ctr, octwidth) {
    return chroma_map.createCoefficients(N, sampleRate, nbins, A440, f_ctr, octwidth);
}
