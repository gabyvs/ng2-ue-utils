Error.stackTraceLimit = 20;
var testing = require('@angular/core/testing');
var browserDynamic = require('@angular/platform-browser-dynamic/testing');

testing.TestBed.initTestEnvironment(
    browserDynamic.BrowserDynamicTestingModule,
    browserDynamic.platformBrowserDynamicTesting());

var context = require.context('./src', true, /\.spec\.ts$/);
context.keys().forEach(context);