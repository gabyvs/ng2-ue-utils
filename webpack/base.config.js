/* global __dirname */
/* global require */
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');
var buildPath = path.resolve(__dirname, '../docs/');
var nodeModulesPath = path.resolve(__dirname, '../node_modules');

var config = {
    devtool: 'source-map',
    entry: {
        app: ['./demo/main.ts'],
        vendor: [
            'es6-shim',
            'reflect-metadata',
            'zone.js',
            'rxjs',
            'lodash',
            'moment',
            '@angular/common',
            '@angular/compiler',
            '@angular/core',
            '@angular/forms',
            '@angular/platform-browser',
            '@angular/platform-browser-dynamic'
        ]
    },
    output: {
        path: buildPath,
        filename: 'bundles/bundle.js',
        sourceMapFilename: '[file].map',
        publicPath: '/'
    },
    externals: {
    },
    module: {
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
                exclude: [ nodeModulesPath ]
            },
            {
                test: /\.(:?html)$/,
                loader: 'html-loader'
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.less$/,
                loader: 'style-loader!css-loader!less-loader'
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.woff(2)?(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url-loader?limit=100000&mimetype=application/font-woff"
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url-loader?limit=100000&mimetype=application/octet-stream"
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                loader: "file-loader"
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url-loader?limit=100000&mimetype=image/svg+xml"
            }
        ]
    },
    tslint: {
        emitErrors: false,
        failOnHint: false
    },
    htmlLoader: {
        minimize: true,
        removeAttributeQuotes: false,
        caseSensitive: true,
        customAttrSurround: [ [/#/, /(?:)/], [/\*/, /(?:)/], [/\[?\(?/, /(?:)/] ],
        customAttrAssign: [ /\)?\]?=/ ]
    },
    resolve: {
        extensions: prepend(['.ts','.js','.json','.css','.html'], '.async')
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './demo/index.html'
        }),
        new webpack.optimize.CommonsChunkPlugin(
            /* chunkName= */'vendor', /* filename= */'bundles/vendor.bundle.js'
        )
    ]
};

module.exports = config;

// For every prefix in args will concat a new array copy of extensions with the prefix as prefix.
function prepend(extensions, args) {
    args = args || [];
    if (!Array.isArray(args)) { args = [args] }
    return extensions.reduce(function(memo, val) {
        return memo.concat(val, args.map(function(prefix) {
            return prefix + val
        }));
    }, ['']);
}