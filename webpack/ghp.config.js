/* global __dirname */
var webpack = require("webpack");

module.exports = exports = require("./base.config.js");

exports.entry.app = ['./demo/main.ts'];

exports.plugins = [
    new webpack.optimize.CommonsChunkPlugin(
        /* chunkName= */'vendor', /* filename= */'bundles/vendor.bundle.js'
    )
];