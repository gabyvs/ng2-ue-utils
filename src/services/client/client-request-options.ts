import {
    Headers,
    RequestOptionsArgs,
    RequestOptions
} from '@angular/http';

export class ClientRequestOptions extends RequestOptions {
    constructor(options?: RequestOptionsArgs) {
        super(options);
        if (!this.headers) {
            this.headers = new Headers();
        }
        if (window && window.location && window.location.href) {
            this.headers.append('X-Restart-URL', window.location.href);    
        }
        this.headers.append('Accept', 'application/json');
        this.headers.append('Content-Type', 'application/json');
    }
}
