import {
    ErrorHandler,
    Injectable }        from '@angular/core';
import { GTMService }   from './gtm';

/**
 * Custom error handler that prints the error to the console and pushes a GA event to the GTM data layer to
 * log the error in Google Analytics.
 */
@Injectable()
export class UEErrorHandler implements ErrorHandler {

    constructor (private gtmService: GTMService) {}

    public handleError(error) {
        console.log('error-handler.ts at 13: ');
        console.error(error);
        console.log('error-handler.ts at 15: ');

        // TODO: this should have a type on gtm file or here, I changed the order of the keys for tslinter purposes
        // const eventProps: any = {
        //     error: error.toString(),
        //     stack: error.stack,
        //     url: window.location.href
        // };
        this.gtmService.registerPageTrack('example, insert your eventProps here and call a better method.');
        console.log('error-handler.ts at 24: ');
    };
}
