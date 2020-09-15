const path = require('path');

module.exports = {
    mode: "development",
    entry: "./modules/index",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "jsXtract.js",
        library: "jsXtract",
        libraryTarget: "umd",
        globalObject: 'this'
    }
};
