import { Injectable }           from '@angular/core';
import { RequestOptionsArgs }   from '@angular/http';
import {
    Observable,
    Observer }                  from 'rxjs/Rx';

import { IClientBase }          from './client';

/**
 * This injectable service can be used on your tests to mock asynchronous http calls.
 *
 * ### Simple Example
 *
 * Add service to your test file before each test is run and get the client mock instance
 *
 * ```
 * let myCustomClient: MyCustomClient;
 * let client: ClientMock;
 * beforeEach(() => {
 *       TestBed.configureTestingModule({
 *           imports: [ Ng2UEUtilsModule ],
 *           providers:      [
 *               MyCustomClient,
 *               ClientObserver,
 *               { provide: Client, useClass: ClientMock },
 *               { provide: APP_CONFIG, useValue: appConfig }
 *           ]
 *       });
 *       myCustomClient = TestBed.get(MyCustomClient);
 *       client = TestBed.get(Client);
 *   });
 * ```
 *
 * And in each of your tests
 * ```
 * it('Gets entity list', (done) => {
 *      const mockResponse = { id: 123, name: 'mockName' };
 *      client.on(`/my/entity/relative/route?myQueryParam=100`, mockResponse); // route configured on your router for getMyEntityList
 *      let counter = 0;
 *
 *      myCustomClient.getMyEntitiesList().subscribe(
 *           () => {
 *              // Add your test code for each next event
 *               counter += 1;
 *               switch (counter) {
 *                    case 1:
 *                       // your test for first emission
 *                       break;
 *                   case 2:
 *                       // your test for second emission, and so on,
 *                       break;
 *                   default:
 *                       expect('Should not enter default case').toBeUndefined();
 *                       done();
 *                       break;
 *               }
 *           },
 *           () => {
 *           // add your test code for each error event
 *               expect('Should not enter here').toBeUndefined();
 *               done();
 *           },
 *           () => {
 *           // add your test code for complete event
 *               expect(counter).toBe(0);
 *               done();
 *           }
 *       );
 *   });
 *
 * ```
 */
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

    private request = <T>(path: string): Observable<T> => {
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
        }).delay(0);
    };

    public on = <T>(path: string, value: any, error?: boolean): void => {
        this.predefinedResponses[path] = { error: error, value: value  };
    };

    public get = <T>(path: string, options?: RequestOptionsArgs): Observable<T> => {
        return this.request<T>(path);
    };

    public put = <T, U>(path: string, payload: U, options?: RequestOptionsArgs): Observable<T>  => {
        return this.request<T>(path);
    };

    public post = <T, U>(path: string, payload: U, options?: RequestOptionsArgs): Observable<T>  => {
        return this.request<T>(path);
    };

    public delete = <T>(path: string, options?: RequestOptionsArgs): Observable<T> => {
        return this.request<T>(path);
    };
}
