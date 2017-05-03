import {ErrorHandler, Inject, Injectable} from '@angular/core';
import { GTMService, IGAEventProps } from './gtm';
import {APP_CONFIG, IAppConfig} from './app-config';

/**
 * This is a customize error handler that logs all uncaught JavaScript errors to the console, and additionally
 * pushes a Google Tag Manager event to the data layer, in order to log the error in Google Analytics.
 *
 * If the "dataLayer" object is not defined (i.e. GTM is disabled), or no gtmErrorCategory is provided by IAppConfig,
 * this handler will only log the error to the JavaScript console, as the default ErrorHandler would.
 *
 * The following GTM event structure will be used:
 *
 * category: <IAppConfig.gtmErrorCategory>
 * action: <error message>
 * label: version: <IAppConfig.appVersion>
 * value: 0
 * nonInteraction: true
 *
 * ```
 * import { NgModule } from '@angular/core';
 * import { APP_CONFIG, GTMService, IAppConfig, WindowRef, GTMErrorHandler } from 'ng2-ue-utils';
 *
 * import { MyMainComponent } from './route/to/myMainComponent';
 *
 * const appConfig: IAppConfig = {
 *   apiBasePath: 'myapibasepath',
 *   appBasePath: 'myappbasepath',
 *   gtmAppName: 'nameforgoogletagmanager'
 *   appVersion: 'myappversion'
 *   gtmErrorCategory: 'googleanalyticserrorcategory'
 * };
 *
 * @NgModule({
 *   bootstrap:    [ MyMainComponent ],
 *   declarations: [
 *       MyMainComponent
 *   ],
 *   imports: [ Ng2UEUtilsModule ],
 *   providers: [
 *       GTMService,
 *       WindowRef,
 *       { provide: ErrorHandler, useClass: GTMErrorHandler },
 *       { provide: APP_CONFIG, useValue: appConfig }
 *   ]
 * })
 * export class AppModule {}
 * ```
 */
@Injectable()
export class GTMErrorHandler extends ErrorHandler {

    /**
     * Get the original error from an Angular wrapped error.
     *
     * Note: this function implementation is specific to the version of Angular used. Unfortunately there does not seem
     * to be any public facilities to manage unpacking a wrapped error. Looking at the Angular source, the structure of
     * the wrapped error changes often. If Angular is updated this method will more than likely have to change.
     *
     * @param error     the wrapped error
     * @returns {any}   the original error
     */
    private static findOriginalError(error: any): any {

        // Guard against unexpected differences in wrapped error structure
        if (!error.rejection) {
            return error;
        }

        // Locate original error
        error = error.rejection;
        while (error && error.originalError) {
            error = error.originalError;
        }

        return error;
    }

    /**
     * Extract error message from an error object.
     *
     * @param error         the error to extract the message from
     * @returns {string}    the error message
     */
    private static extractMessage(error: any): string {
        return error instanceof Error ? error.message : error.toString();
    }

    constructor (private gtmService: GTMService, @Inject(APP_CONFIG) private appConfig: IAppConfig) { super(false); }

    /**
     * Overridden error handler method.
     *
     * Logs the provided error to both the JavaScript console and the GTM data layer, as a Google Analytics event.
     *
     * @param error the error to handle
     */
    public handleError(error) {

        // Let the default error handler log the error to the console.
        super.handleError(error);

        // Log error event to GTM data layer.
        this.logErrorToGTM(error);

        // If the exception is not rethrown processes like bootstrap will always succeed, if an error is encountered.
        throw error;
    };

    /**
     * Logs a Google Analytic event to GTM data layer, based on provided error and app configuration.
     *
     * If IAppConfig.appVersion is not defined, no event will be pushed.
     *
     * @param error the error to log
     */
    private logErrorToGTM(error) {

        // If no gtmErrorCategory is defined do not push event to GTM
        if (!this.appConfig.gtmErrorCategory) {
            return;
        }

        // Angular will wrap the original error we wish to log
        const originalError: any = GTMErrorHandler.findOriginalError(error);

        // Build GTM event based on application configuration and error
        const event: IGAEventProps = {
            action: GTMErrorHandler.extractMessage(originalError),
            category: this.appConfig.gtmErrorCategory,
            label: this.getVersionLabel(),
            noninteraction: true,
            value: 0
        };

        // This call will only log the event when the "dataLayer" object is defined (i.e. GTM is enabled)
        this.gtmService.registerEventTrack(event);
    }

    /**
     * Get the version label for the Google Analytics event.
     *
     * @returns {string} "version: <IAppConfig.appVersion>"; or a blank string, if no appVersion is defined
     */
    private getVersionLabel(): string {
        if (this.appConfig.appVersion) {
            return 'version: ' + this.appConfig.appVersion;
        }

        return '';
    }

}
