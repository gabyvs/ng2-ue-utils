/* global __dirname */
var webpack = require("webpack");
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = exports = require("./base.config.js");
exports.devtool = 'inline-source-map';
exports.debug = true;
exports.entry.app = ['webpack/hot/dev-server', 'webpack-dev-server/client?http://localhost:8081'].concat(exports.entry.app);
exports.plugins = [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProvidePlugin({
        'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    }),
    new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './demo/index.html'
    }),
    new webpack.optimize.CommonsChunkPlugin(
        /* chunkName= */'vendor', /* filename= */'ng2ueutils/bundles/vendor.bundle.js'
    )
];