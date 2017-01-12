import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';

/**
 * This injectable service can optionally be provided to the ObservableClient or ObservableClientBase classes included
 * in this library in order to provide you with a stream of http call status represented as IClientEvent emissions.
 * 
 * The spy (ClientObserver) is designed to allow you to feed client events into the progress service to update the 
 * state of your progress bar component, both of which are also included in this library.
 *
 * ### Simple Example
 *
 * Add service to your app module so it can be injected into your components
 * 
 * ```
 * import { Ng2UEUtilsModule, ClientObserver } from 'ng2-ue-utils';
 * import { AppComponent } from './path/to/appComponent';
 * import { MyComponent } from './path/to/myComponent';
 *
 * @NgModule({
 *   bootstrap:     [ AppComponent ],
 *   declarations:  [ AppComponent, MyComponent ],
 *   imports:       [ Ng2UEUtilsModule ],
 *   providers:     [ ClientObserver ]
 * })
 * ```
 *
 * And in myComponent.ts
 * ```
 * import { ClientObserver } from 'ng2-ue-utils';
 *
 * @Component({
 *     selector: 'my-component',
 *     template: `<div> my content </div>`
 * })
 * class MyComponent {
 *
 *     constructor(private progressService: ProgressService, private spy: ClientObserver){}
 *
 *     private subscribeToServerCallsEvents () {
 *       this.spy.clientEvents
 *          .filter(status => status.event !== 'next')
 *          .subscribe((event: IClientEvent) => {
 *               this.progressService.notify(event);
 *           });
 *     }
 * }
 * ```
 */

export type ClientEvent = 'error' | 'start' | 'complete' | 'next';
export type ClientMethod = 'get' | 'put' | 'post' | 'delete';

export interface IClientEvent {
    stackCount: number; // number of calls in flight, including this one
    event: ClientEvent;
    method: ClientMethod;
    error?: any;
}

@Injectable()
export class ClientObserver {
    private _emitter: Subject<IClientEvent> = new Subject<IClientEvent>();
    private _stackCount: number = 0;
    public clientEvents: Observable<IClientEvent> = this._emitter.asObservable();

    private countUp = () => { this._stackCount++; };

    private countDown = () => { this._stackCount = Math.max(0, this._stackCount - 1); };
    
    public emitChange = (event: ClientEvent, method: ClientMethod, error?: any) => {
        if (event === 'start') {
            this.countUp();
        }
        if (event === 'error' || event === 'complete') {
            this.countDown();
        }
        this._emitter.next({
            error: error,
            event: event,
            method: method,
            stackCount: this._stackCount
        });
    };

    public observeOn = <T>(method: ClientMethod, obs: Observable<T>): Observable<T> => {
        this.emitChange('start', method);
        return obs.do(
            next => {
                this.emitChange('next', method);
            },
            error => {
                this.emitChange('error', method, error);
            },
            () => {
                this.emitChange('complete', method);
            }
        );
    };
}
