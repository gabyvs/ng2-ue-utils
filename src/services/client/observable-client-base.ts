import { Observable } from 'rxjs/Rx';

import { ClientObserver, ClientMethod } from './clientObserver';
import { Client } from './client';

/**
 * This service is used as a simple wrapper of Client (http client) for PUT, GET, POST and DELETE calls.
 * The service is wrapping all calls in a ClientObserver that can optionally be passed in as a parameter. 
 * So, by using this service instead of the regular Client, all the calls sent to the server can be monitored 
 * for their progress.
 *
 * If you are using Repository class from this library, you might want to use ObservableClient instead of this class.
 * But if you are implementing your own repositories or you are not using them at all, then this client is a simpler
 * alternative to the regular ObservableClient.
 * 
 * If you are not using the ClientObserver nor the Repository, you could simply use the Client directly instead
 * of this class.
 *
 * The methods on this service take required types and a URL. They register the call in the spy (if available) and 
 * pass the call to the Client (http Client). They return Observables for the calls.
 *
 * You can also use the method spyCall directly to bundle complex calls to be observed as a single client event.
 *
 * ### Simple Example
 *
 * To use it on your SPA:
 *
 * Add it to your app module so it can be injected on your components
 * ```
 * @NgModule({
 *   bootstrap:     [ AppComponent ],
 *   declarations:  [ AppComponent ],
 *   imports:       [ Ng2UEUtilsModule ],
 *   providers:     [ Client, ClientObserver, MyCustomClient ]
 * })
 * ```
 *
 * And in your service
 * ```
 * import { ObservableClientBase } from 'ng2-ue-utils';
 *
 * @Injectable()
 * export class MyCustomClient extends ObservableClientBase {
 *
 *      constructor (client: Client, private router: MyRouter, spy: ClientObserver) {
 *       super(client, spy);
 *      }
 *
 *     // Simple use
 *      public getMyEntity (id: string): Observable<IRawEntity> {
 *          return this.get<IRawEntity>(this.router.entityURL(id));
 *      }
 *
 *     // Use for bundle complex custom calls (for example, pagination on the server)
 *    public getEntityList (): Observable<Array<IRawEntity>> {
 *       // The spy will receive a single call, while many calls are being made for pagination
 *       return this.spyCall(
 *          'get',
 *          this.aSinglePage().expand((prevList => this.nextPage(prevList)), undefined, undefined),
 *          myUrl
 *       );
 *   }
 * }
 * ```
 */

export class ObservableClientBase {
    constructor (protected client: Client, protected spy?: ClientObserver) {
        this.spy = spy;
    }

    public spyCall = <T>(method: ClientMethod, obs: Observable<T>, path?: string): Observable<T> => {
        return this.spy ? this.spy.observeOn(method, obs, path) : obs;
    };

    public put = <T, U> (url: string, entity: U): Observable<T> => this.spyCall(
        'put',
        this.client.put<T, U>(url, entity),
        url
    );

    public get = <T> (url: string): Observable<T> => {
        return this.spyCall(
            'get',
            this.client.get<T>(url),
            url
        );
    }

    public delete = <T> (url: string): Observable<T> => this.spyCall(
        'delete',
        this.client.delete<T>(url),
        url
    );

    public post = <T, U> (url: string, entity: U): Observable<T> => this.spyCall(
        'post',
        this.client.post<T, U>(url, entity),
        url
    );
}
