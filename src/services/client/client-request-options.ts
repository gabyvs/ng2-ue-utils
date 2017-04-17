import {
    Headers,
    RequestOptionsArgs,
    RequestOptions }    from '@angular/http';
import { IAppConfig }   from '../context/app-config';

export class ClientRequestOptions extends RequestOptions {
    constructor(options?: RequestOptionsArgs, appConfig?: IAppConfig) {
        super(options);
        if (!this.headers) {
            this.headers = new Headers();
        }
        if (window && window.location && window.location.href) {
            this.headers.append('X-Restart-URL', window.location.href);    
        }
        this.headers.append('Accept', 'application/json');
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('X-Requested-With', 'XMLHttpRequest');
        if (appConfig) {
            this.headers.append('x-apigee-app-id', appConfig.gtmAppName);
            if (appConfig.appVersion) {
                this.headers.append('x-apigee-app-version', appConfig.appVersion);
            }
        }
    }
}
