import { Injectable } from '@angular/core';
import { RequestOptionsArgs } from '@angular/http';
import { Observable, Observer } from 'rxjs/Rx';

import {IClientBase} from './client';

@Injectable()
export class ClientMock implements IClientBase {
    private predefinedResponses: any;

    constructor () {
        this.predefinedResponses = {
            '/userinfo': {
                value: {
                    'user_id': '1c95f365',
                    'user_name': 'dimitri@apigee.com',
                    'given_name': 'Dmitri',
                    'family_name': 'Karamazov',
                    'email': 'dimitri@apigee.com',
                    'name': 'Dimitri Fyodorovich Karamazov'
                }
            },
            '/users/dimitri@apigee.com/userroles': {
                value: {
                    role: [ { name: 'orgadmin', organization: 'abc' } ]
                }
            },
            '/organizations/abc/userroles/orgadmin/permissions': {
                value: {
                    resourcePermission: [ { organization: 'abc', path: '/', permissions: ['get', 'put', 'delete']} ]
                }
            }
        };
    }

    public on = <T>(path: string, value: any, error?: boolean): void => {
        this.predefinedResponses[path] = { error: error, value: value  };
    };

    public get = <T>(path: string, options?: RequestOptionsArgs): Observable<T> => {
        return new Observable<T>((observer: Observer<T>) => {
            if (this.predefinedResponses[path]) {
                if (this.predefinedResponses[path].error) {
                    observer.error(this.predefinedResponses[path].value);
                } else {
                    observer.next(this.predefinedResponses[path].value);
                }

                observer.complete();
            } else {
                observer.error({message: 'No handler for path: ' + path});
            }
        });
    };

    public put = <T, U>(path: string, payload: U, options?: RequestOptionsArgs): Observable<T>  => {
        return new Observable<T>((observer: Observer<T>) => {
            if (this.predefinedResponses[path]) {
                observer.next(this.predefinedResponses[path].value);
                observer.complete();
            } else {
                observer.error({message: 'No handler for path: ' + path});
            }
        });
    };

    public post = <T, U>(path: string, payload: U, options?: RequestOptionsArgs): Observable<T>  => {
        return new Observable<T>((observer: Observer<T>) => {
            if (this.predefinedResponses[path]) {
                observer.next(this.predefinedResponses[path].value);
                observer.complete();
            } else {
                observer.error({message: 'No handler for path: ' + path});
            }
        });
    };

    public delete = <T>(path: string, options?: RequestOptionsArgs): Observable<T> => {
        return new Observable<T>((observer: Observer<T>) => {
            if (this.predefinedResponses[path]) {
                observer.next(this.predefinedResponses[path].value);
                observer.complete();
            } else {
                observer.error({message: 'No handler for path: ' + path});
            }
        });
    };
}
