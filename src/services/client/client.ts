import {Injectable} from '@angular/core';
import {
    Http,
    RequestOptionsArgs,
    Response,
} from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { ClientRequestOptions } from './client-request-options';
import { WindowRef } from '../window-ref';

interface ISimplifiedError {
    message: string;
    code: string;
}

const knownCodes = [401, 403];

const defaultErrorMessages = {
    '401': 'Unauthorized',
    '403': 'Forbidden. You don\'t have permissions to access this resource'
};

const extractSimplifiedError = (error: any, path: string): ISimplifiedError => {
    if (!error) {
        return {
            code: 'Unknown Error',
            message: 'Unknown error processing path: ' + path
        };
    }
    try {
        const err = error.json();
        return {
            code: err.code,
            message: err.message
        };

    } catch (e) {
        return {
            code: error.status || 'Unknown Error',
            message: defaultErrorMessages[error.status.toString()] || 'Unknown error processing path: ' + path
        };
    }
};

export interface IClientBase {
    get: <T>(path: string, options?: RequestOptionsArgs) => Observable<T>;
    delete: <T>(path: string, options?: RequestOptionsArgs) => Observable<T>;
    put: <T, U>(path: string, payload: U, options?: RequestOptionsArgs) => Observable<T>;
    post: <T, U>(path: string, payload: U, options?: RequestOptionsArgs) => Observable<T>;
}

const mapToJson = <T>(obs: Observable<Response>): Observable<T> => {
    return obs.map((response: Response) => { // return `undefined` if response is undefined or response body is an empty string
        return ((response && response.text()) ? response.json() : undefined) as T;
    });
};

const errorOrRedirect = (path: string, error: any, win: WindowRef) => {
    if (error && error.status === 401 && error.headers && error.headers.get) {
        const errorLocation = error.headers.get('location') ||  error.headers.get('Location');
        console.log('[SPA] Unauthorized call detected. Trying redirection to:', errorLocation);
        win.location(errorLocation);
    }
    const err = extractSimplifiedError(error, path);
    return Observable.throw(`${err.message}. Error code: ${err.code}`);
};

@Injectable()
export class Client implements IClientBase {
    constructor (private http: Http, private win: WindowRef) {}

    private catchOrRedirect = (path: string) =>
        (error: any, caught: Observable<Response>) => errorOrRedirect(path, error, this.win);

    private mapAndCatch = <T>(path: string, obs: Observable<Response>): Observable<T> => mapToJson<T>(
        obs
            .flatMap(resp => {
                if (knownCodes.indexOf(resp.status) >= 0) {
                    return Observable.throw(resp);
                }
                return Observable.of(resp);
            })
            .catch(this.catchOrRedirect(path))
    );

    public get = <T>(path: string, options?: RequestOptionsArgs): Observable<T>  => {
        // TODO: Fix for breaking change in Angular 2 RC5: http get requests need to have a non empty body
        // https://github.com/angular/angular/issues/10612 Should be fixed in RC6
        if (!options) { options = {}; }
        if (!options.body) { options.body = ''; }
        return this.mapAndCatch<T>(path, this.http.get(path, new ClientRequestOptions(options)));
    };

    public delete = <T>(path: string, options?: RequestOptionsArgs): Observable<T>  =>
        this.mapAndCatch<T>(path, this.http.delete(path, new ClientRequestOptions(options)));

    public put = <T, U>(path: string, payload: U, options?: RequestOptionsArgs): Observable<T>  =>
        this.mapAndCatch<T>(path, this.http.put(path, JSON.stringify(payload), new ClientRequestOptions(options)));

    public post = <T, U>(path: string, payload: U, options?: RequestOptionsArgs): Observable<T>  =>
        this.mapAndCatch<T>(path, this.http.post(path, JSON.stringify(payload), new ClientRequestOptions(options)));
}
