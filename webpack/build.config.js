/* global __dirname */
var webpack = require("webpack");
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = exports = require("./base.config.js");

exports.entry.app = ['./app/main-build.ts'];

exports.plugins = [
    new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './app/index.html'
    }),
    new webpack.optimize.CommonsChunkPlugin(
        /* chunkName= */'vendor', /* filename= */'ng2ueutils/bundles/vendor.bundle.js'
    )
];