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
    preLoaders: [
        {
            test: /\.ts$/,
            loader: "tslint"
        }
    ],
    loaders: [
        {
            test: /\.ts$/,
            loader: 'ts-loader',
            query: {
                "compilerOptions": {
                    "removeComments": false
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
    ],
    postLoaders: [
        {
            test: /\.(js|ts)$/,
            include:path.resolve(__dirname, '../src'),
            loader: 'istanbul-instrumenter-loader',
            exclude: [
                /window-ref.ts/,
                /\.spec\.ts$/,
                /node_modules/
            ]
        }
    ],
    tslint: {
        emitErrors: false,
        failOnHint: false
    }
};
module.exports = exports;
