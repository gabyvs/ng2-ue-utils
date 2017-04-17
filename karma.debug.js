var path = require('path');
var webpackConfig = require('./webpack/debug.config.js');

module.exports = function (config) {
    config.set({
        basePath: '',
        port: 3334,
        logLevel: config.LOG_INFO,
        browsers: ['Chrome'], //use Chrome as default
        singleRun: false, //just run once by default
        frameworks: ['jasmine'], //use jasmine as framework
        autoWatch: true, //use jasmine as framework
        files: [
            'node_modules/es6-shim/es6-shim.min.js',
            'node_modules/zone.js/dist/zone.js',
            'node_modules/zone.js/dist/long-stack-trace-zone.js',
            'node_modules/zone.js/dist/proxy.js',
            'node_modules/zone.js/dist/sync-test.js',
            'node_modules/zone.js/dist/jasmine-patch.js',
            'node_modules/zone.js/dist/async-test.js',
            'node_modules/zone.js/dist/fake-async-test.js',
            'node_modules/phantomjs-polyfill/bind-polyfill.js',
            'node_modules/reflect-metadata/Reflect.js',
            { pattern: 'karma.tests.js', watched: false } //test files
        ],
        preprocessors: {
            'karma.tests.js': ['webpack', 'sourcemap']
        },
        reporters: ['progress'],
        webpack: webpackConfig,
        webpackMiddleware: {
            noInfo: true
        }
    });
};