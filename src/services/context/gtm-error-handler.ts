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

    constructor (private gtmService: GTMService, @Inject(APP_CONFIG) private appConfig: IAppConfig) { super(); }

    /**
     * Overridden error handler method.
     *
     * Logs the provided error to both the JavaScript console and the GTM data layer, as a Google Analytics event.
     *
     * @param error the error to handle
     */
    public handleError(error) {
        // Log error event to GTM data layer. It's crucial that this call is made first, as the super call below will
        // rethrow the error, stopping execution.
        this.logErrorToGTM(error);

        // Let the default error handler log the error to the console.
        super.handleError(error);
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

        // Build GTM event based on application configuration and error
        let event: IGAEventProps = {
            action: error.toString(),
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
