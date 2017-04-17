var path = require('path');
var webpackConfig = require('./webpack/test.config.js');

module.exports = function (config) {
    config.set({
        basePath: '',
        port: 3334,
        logLevel: config.LOG_INFO,
        browsers: [process.env.TRAVIS ? 'Chrome_travis_ci' : 'Chrome'], //use Chrome locally only
        singleRun: true, //just run once by default
        frameworks: ['jasmine'], //use jasmine as framework
        files: [
            'node_modules/es6-shim/es6-shim.min.js',
            'node_modules/zone.js/dist/zone.js',
            'node_modules/zone.js/dist/long-stack-trace-zone.js',
            'node_modules/zone.js/dist/proxy.js',
            'node_modules/zone.js/dist/sync-test.js',
            'node_modules/zone.js/dist/jasmine-patch.js',
            'node_modules/zone.js/dist/async-test.js',
            'node_modules/zone.js/dist/fake-async-test.js',
            'node_modules/reflect-metadata/Reflect.js',
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
        },
        customLaunchers: {
            Chrome_travis_ci: {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        }
    });
};