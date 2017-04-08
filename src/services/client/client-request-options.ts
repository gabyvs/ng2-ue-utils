import {
    Headers,
    RequestOptionsArgs,
    RequestOptions
} from '@angular/http';

export class ClientRequestOptions extends RequestOptions {
    constructor(options?: RequestOptionsArgs, spaName?: string) {
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
        if (spaName) {
            this.headers.append('x-apigee-app-id', spaName);
        }
    }
}
