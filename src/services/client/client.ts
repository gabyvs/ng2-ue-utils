import {
    Inject,
    Injectable }                from '@angular/core';
import {
    Http,
    RequestOptionsArgs,
    Response }                  from '@angular/http';
import { Observable }           from 'rxjs/Observable';

import {
    parse,
    IParseResult }              from './client-error-parser';
import { ClientRequestOptions } from './client-request-options';
import {
    APP_CONFIG,
    IAppConfig }                from '../context/app-config';
import { GTMService }           from '../context/gtm';
import { WindowRef }            from '../window-ref';

const knownCodes = [401, 403];

export interface ISimplifiedError {
    message: string;
    code: string;
    originalError: any;
    path: string;
}

export interface IClientBase {
    get: <T>(path: string, options?: RequestOptionsArgs) => Observable<T>;
    delete: <T>(path: string, options?: RequestOptionsArgs) => Observable<T>;
    put: <T, U>(path: string, payload: U, options?: RequestOptionsArgs) => Observable<T>;
    post: <T, U>(path: string, payload: U, options?: RequestOptionsArgs) => Observable<T>;
}

@Injectable()
export class Client implements IClientBase {
    constructor (
        private http: Http,
        private gtmService: GTMService,
        private win: WindowRef,
        @Inject(APP_CONFIG) private appConfig: IAppConfig) {}

    private mapToJson = <T>(obs: Observable<Response>): Observable<T> => {
        return new Observable<T>(o => {
            const start: number = new Date().valueOf();
            const measure = (response) => {
                const end: number = new Date().valueOf();
                if (response.url) {
                    this.gtmService.registerClientCall(response.status, response.url, end - start);
                } else if (response.originalError) {
                    this.gtmService.registerClientCall(response.originalError.status, response.originalError.url, end - start);
                }

            };
            const s = obs
                .do(measure, measure)
                .map((response: Response) => { // return `undefined` if response is undefined or response body is an empty string
                    return ((response && response.text()) ? response.json() : undefined) as T;
                })
                .subscribe(o);
            return s;
        });
    };

    private errorOrRedirect = (path: string, error: any, win: WindowRef) => {
        if (error && error.status === 401 && error.headers && error.headers.get) {
            const errorLocation = error.headers.get('location') ||  error.headers.get('Location');
            console.log('[SPA] Unauthorized call detected. Trying redirection to:', errorLocation);
            win.location(errorLocation);
        }
        const parsingResult: IParseResult = parse(error, path);
        if (parsingResult.malformedError) {
            this.gtmService.registerSPAEvent(
                { action: path, event: 'Edge_malFormedError', label: parsingResult.malformedError, value: error.status });
        }
        return Observable.throw(parsingResult.simplifiedError);
    };

    private catchOrRedirect = (path: string) =>
        (error: any, caught: Observable<Response>) => this.errorOrRedirect(path, error, this.win);

    private mapAndCatch = <T>(path: string, obs: Observable<Response>): Observable<T> => this.mapToJson<T>(
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
        return this.mapAndCatch<T>(path,
            this.http.get(path, new ClientRequestOptions(options, this.appConfig)));
    };

    public delete = <T>(path: string, options?: RequestOptionsArgs): Observable<T>  =>
        this.mapAndCatch<T>(path, this.http.delete(path,
            new ClientRequestOptions(options, this.appConfig)));

    public put = <T, U>(path: string, payload: U, options?: RequestOptionsArgs): Observable<T>  =>
        this.mapAndCatch<T>(path, this.http.put(path, JSON.stringify(payload),
            new ClientRequestOptions(options, this.appConfig)));

    public post = <T, U>(path: string, payload: U, options?: RequestOptionsArgs): Observable<T>  =>
        this.mapAndCatch<T>(path, this.http.post(path, JSON.stringify(payload),
            new ClientRequestOptions(options, this.appConfig)));
}
