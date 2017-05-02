import { ErrorHandler, Injectable } from '@angular/core';
import { GTMService, IGAEventProps } from './gtm';
import { IAppConfig } from "./app-config";

/**
 * This is a customize error handler that logs all uncaught JavaScript errors to the console, and additionally
 * pushes a Google Tag Manager event to the data layer, in order to log the error in Google Analytics.
 *
 * If the "dataLayer" object is not defined (i.e. GTM is disabled) this handler will only log the error to
 * the JavaScript console, as the default ErrorHandler would.
 *
 * The following GTM event structure will be used:
 *
 * category: <IAppConfig.gtmErrorCategory>
 * action: <error message>
 * label: version: <IAppConfig.version>
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

    constructor (private gtmService: GTMService, private appConfig: IAppConfig) { super(); }

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
    };

    /**
     * Logs Google Analytics event to GTM data layer, based on provided error.
     *
     * @param error the error to log
     */
    private logErrorToGTM(error) {
        let event: IGAEventProps = {
            category: this.appConfig.gtmErrorCategory,
            action: error.toString(),
            label: 'version: ' + this.appConfig.appVersion,
            value: 0,
            noninteraction: true
        };

        // This call will only log the event when the "dataLayer" object is defined (i.e. GTM is enabled)
        this.gtmService.registerEventTrack(event);
    }

}
