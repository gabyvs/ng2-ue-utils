var path = require('path');
var webpackConfig = require('./webpack/test.config.js');

module.exports = function (config) {
    config.set({
        basePath: '',
        port: 3334,
        logLevel: config.LOG_INFO,
        browsers: ['PhantomJS'], //use PhantomJS as default
        singleRun: true, //just run once by default
        frameworks: ['jasmine'], //use jasmine as framework
        files: [
            'node_modules/zone.js/dist/zone.min.js',
            'node_modules/zone.js/dist/async-test.js',
            'node_modules/phantomjs-polyfill/bind-polyfill.js',
            'node_modules/reflect-metadata/Reflect.js',
            'node_modules/es6-shim/es6-shim.min.js',

            { pattern: 'karma.tests.js', watched: false } //test files
        ],
        preprocessors: {
            'karma.tests.js': ['webpack', 'sourcemap'] //preprocess with webpack and sourcemap loader
        },
        coverageReporter: {
            dir : 'coverage/',
            reporters: [
                { type: 'text-summary' },
                { type: 'json' },
                { type: 'html' }
            ]
        },
        reporters: ['dots', 'coverage'], //report results in this format
        webpack: webpackConfig,
        webpackMiddleware: {
            noInfo: true
        }
    });
};