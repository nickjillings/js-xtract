# JS-Xtract

[![Code Climate](https://codeclimate.com/github/nickjillings/js-xtract/badges/gpa.svg)](https://codeclimate.com/github/nickjillings/js-xtract) [![Build Status](https://travis-ci.org/nickjillings/js-xtract.svg?branch=master)](https://travis-ci.org/nickjillings/js-xtract)


JS-Xtract is a feature extraction library built in JavaScript. The library is based upon a previous library, LibXtract[1], which defined several functions for the C langauge.

## How to use it

JS-Xtract is self contained inside one file called jsXtract.min.js. Simply add this file your document header function, as shown below, to load the entire feature extraction library.

```html
<script src="jsXtract.min.js"></script>
```

Whilst the library has not been tested inside Node.js, it is built using ECMA Script version 5 and should be interpreted correctly, however your mileage will vary.

## Components

The following components have their own documentation points:

- Guides
  - [Using the procedural calls](http://dmtlab.bcu.ac.uk/nickjillings/docs/index.php?src=js-xtract/procedural.md)
  - [Using the Object Oriented calls](http://dmtlab.bcu.ac.uk/nickjillings/docs/index.php?src=js-xtract/object-oriented.md)
  - [Tying into a Web Audio API chain](http://dmtlab.bcu.ac.uk/nickjillings/docs/index.php?src=js-xtract/WebAudio.md)
- Features
  - [Time Domain](http://dmtlab.bcu.ac.uk/nickjillings/docs/index.php?src=js-xtract/temporal-features.md)
  - [Spectral Domain](http://dmtlab.bcu.ac.uk/nickjillings/docs/index.php?src=js-xtract/spectral-features.md)
- Objects
  - [TimeData](http://dmtlab.bcu.ac.uk/nickjillings/docs/index.php?src=js-xtract/TimeData.md)
  - [SpectrumData](http://dmtlab.bcu.ac.uk/nickjillings/docs/index.php?src=js-xtract/SpectrumData.md)
  - [PeakSpectrumData](http://dmtlab.bcu.ac.uk/nickjillings/docs/index.php?src=js-xtract/PeakSpectrumData.md)
  - [HarmonicSpectrumData](http://dmtlab.bcu.ac.uk/nickjillings/docs/index.php?src=js-xtract/HarmonicSpectrumData.md)
- [Typed Arrays](http://dmtlab.bcu.ac.uk/nickjillings/docs/index.php?src=js-xtract/TypedArrays.md)
- Web Audio Prototypes

## Development

This work is still in very active development and is updated regularly. However if you do find bugs, issues, prangs and scratches please let us know through the [issue tracker on GitHub](https://github.com/nickjillings/js-xtract)

## Paper

A paper on this project was presented at ISMIR 2016, available [here](http://dmtlab.bcu.ac.uk/nickjillings/papers/Jillings-JSXtract.pdf)

If you use this project, please use the following citation:

N. Jillings, J. Bullock and R. Stables “JS-Xtract: A Realtime Audio Feature Extraction Library for the Web”, International Society for Music Information Retrieval Conference (ISMIR 2016), August 2016.

## References

[1]: Bullock, J. and Conservatoire, U.C.E.B., 2007. Libxtract: A lightweight library for audio feature extraction. In Proceedings of the International Computer Music Conference (Vol. 43). [pdf](http://www.academia.edu/download/30764212/LibXtract-_a_lightweight_feature_extraction_library.pdf)

[2]: Muller, M. and Ewert, S., 2011. Chroma Toolbox: MATLAB implementations for extracting variants of chroma-based audio features. In Proceedings of International Society for Music Information Retrieval Conference (ISMIR 2011). [pdf](http://www.ismir2011.ismir.net/papers/PS2-8.pdf)
