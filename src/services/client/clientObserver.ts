import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import {ISimplifiedError} from './client';

/**
 * This injectable service can optionally be provided to the ObservableClient or ObservableClientBase classes included
 * in this library in order to provide you with a stream of http call status represented as IClientEvent emissions.
 * 
 * The spy (ClientObserver) is designed to allow you to feed client events into the progress service to update the 
 * state of your progress bar component, both of which are also included in this library. You can also use it to feed error notifications
 * using the notification service and notifications component.
 *
 * If used together with the Client included in this library, the emissions are IClientEvents that have the following information:
 * stackCount: the number of calls in flight, so you know if there are any pending calls
 * event: a ClientEvent, which can have the values 'error' | 'start' | 'complete' | 'next'
 * method: a ClientMethod, which can have the values 'get' | 'put' | 'post' | 'delete'
 * error: if the client call resulted in an error, a readable string representing the error cause
 * errorInfo: if the client call resulted in an error, ISimplifiedError including a message, code, path and the original error response.
 *          Use this object to parse errors if you need something specific for your app.
 * path: a string of the relative path for the http call that was made
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
    errorInfo?: ISimplifiedError;
    path?: string;
}

@Injectable()
export class ClientObserver {
    private _emitter: Subject<IClientEvent> = new Subject<IClientEvent>();
    private _stackCount: number = 0;
    public clientEvents: Observable<IClientEvent> = this._emitter.asObservable();

    private countUp = () => { this._stackCount++; };

    private countDown = () => { this._stackCount = Math.max(0, this._stackCount - 1); };
    
    public emitChange = (event: ClientEvent, method: ClientMethod, path?: string, error?: any) => {
        if (event === 'start') {
            this.countUp();
        }
        if (event === 'error' || event === 'complete') {
            this.countDown();
        }
        this._emitter.next({
            error: error ? (error.message) : undefined,
            errorInfo: error,
            event: event,
            method: method,
            path: path,
            stackCount: this._stackCount
        });
    };

    public observeOn = <T>(method: ClientMethod, obs: Observable<T>, path?: string): Observable<T> => {
        this.emitChange('start', method, path);
        return obs.do(
            next => {
                this.emitChange('next', method, path);
            },
            error => {
                this.emitChange('error', method, path, error);
            },
            () => {
                this.emitChange('complete', method, path);
            }
        );
    };

    public reset = () => {
        this._stackCount = 0;
        this._emitter.next({
            event: 'complete',
            method: 'get',
            stackCount: this._stackCount
        });
    }
}
