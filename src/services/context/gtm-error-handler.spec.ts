import {GTMServiceMock} from './gtm.mock';
import {TestBed} from '@angular/core/testing';
import {APP_CONFIG, IAppConfig} from './app-config';
import {GTMService, IGAEventProps} from './gtm';
import {ErrorHandler} from '@angular/core';
import {GTMErrorHandler} from './gtm-error-handler';

const testErrorMessage: string = 'test error message';
const testError: Error = new Error(testErrorMessage);
const mockAppConfig: IAppConfig = {
    apiBasePath: 'test base path',
    appBasePath: 'test base path',
    appVersion: 'test version',
    gtmAppName: 'test app name',
    gtmErrorCategory: 'test error category'
};
const expectedEvent: IGAEventProps = {
    action: 'Error: ' + testErrorMessage,
    category: mockAppConfig.gtmErrorCategory,
    label: 'version: ' + mockAppConfig.appVersion,
    noninteraction: true,
    value: 0
};

let consoleErrorFunc = console.error; // Backup error function for restoration in afterEach()
let errorHandler: GTMErrorHandler;
let gtmService: GTMServiceMock;

/**
 * Configures the TestBed with a specific instance of IAppConfig.
 *
 * Normally this would be done in beforeEach() but we need to inject different variations of IAppConfig for each test.
 * Injecting the object and modifying it after the fact does not seem to work.
 *
 * @param appConfig the IAppConfig to inject into the testbed
 */
function configureTestBed(appConfig: IAppConfig) {
    TestBed.configureTestingModule({
        providers: [
            { provide: APP_CONFIG,      useValue: appConfig },
            { provide: GTMService,      useClass: GTMServiceMock },
            { provide: ErrorHandler,    useClass: GTMErrorHandler }
        ]
    });

    errorHandler = TestBed.get(ErrorHandler);
    gtmService = TestBed.get(GTMService);
}

/**
 * Calls the handleError() method on the GTMErrorHandler under test, with the testError, and eats any exceptions thrown.
 */
function executeErrorHandler() {
    try {
        errorHandler.handleError(testError);
    } catch (e) {
        // Expected
    }
}

describe('GTM Error Handler', () => {

    beforeEach(() => {
        // Temporarily disable console error output. Output will be restored in afterEach()
        console.error = function() {
            // Do nothing
        };
    });

    afterEach(() => console.error = consoleErrorFunc);

    it('Logs a GTM error event', () => {
        configureTestBed(mockAppConfig);
        executeErrorHandler();
        expect(gtmService.registerEventTrack).toHaveBeenCalledWith(expectedEvent);
    });

    it('Logs a GTM error event with no label', () => {
        mockAppConfig.appVersion = undefined;
        expectedEvent.label = '';
        configureTestBed(mockAppConfig);
        executeErrorHandler();
        expect(gtmService.registerEventTrack).toHaveBeenCalledWith(expectedEvent);
    });

    it('Does not log a GTM error event with no gtmErrorCategory', () => {
        mockAppConfig.gtmErrorCategory = undefined;
        configureTestBed(mockAppConfig);
        executeErrorHandler();
        expect(gtmService.registerEventTrack).not.toHaveBeenCalled();
    });

});
