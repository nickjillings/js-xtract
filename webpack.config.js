const path = require('path');

module.exports = {
    mode: "development",
    devtool: "source-map",
    entry: "./modules/index",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "jsXtract.js",
        library: "jsXtract",
        libraryTarget: "umd",
        globalObject: 'this'
    }
};
