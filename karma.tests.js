Error.stackTraceLimit = 20;

var context = require.context('./src', true, /\.spec\.ts$/);
context.keys().forEach(context);
var testing = require('@angular/core/testing');
var browserDynamic = require('@angular/platform-browser-dynamic/testing');

testing.setBaseTestProviders(
    browserDynamic.TEST_BROWSER_DYNAMIC_PLATFORM_PROVIDERS,
    browserDynamic.TEST_BROWSER_DYNAMIC_APPLICATION_PROVIDERS
);