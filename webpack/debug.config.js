/* global __dirname */
var webpack = require("webpack");
var path = require('path');
var nodeModulesPath = path.resolve(__dirname, '../node_modules');
var exports = require("./base.config.js");

exports.devtool = 'inline-source-map';
delete exports.entry;
delete exports.output;
exports.plugins = [];

exports.module = {
    loaders: [
        {
            test: /\.ts$/,
            loader: 'ts-loader',
            query: {
                "compilerOptions": {
                    "removeComments": true
                }
            },
            exclude: [ nodeModulesPath ]
        },
        {
            test: /\.(:?html)$/,
            loader: 'html-loader'
        },
        {
            test: /\.json$/,
            loader: 'json-loader'
        }
    ]
};
module.exports = exports;
