import { Observable, Subject } from 'rxjs/Rx';

export interface IClientObserver {
    observe: () => Observable<IClientEvent>;
}

export type ClientEvent = 'error' | 'start' | 'complete' | 'next';
export type ClientMethod = 'get' | 'put' | 'post' | 'delete';

export interface IClientEvent {
    stackCount: number;
    event: ClientEvent;
    method: ClientMethod;
    error?: any;
}

export class ClientObserver implements IClientObserver {
    private _emitter: Subject<IClientEvent>;
    private _stackCount: number;
    
    constructor () {
        this._emitter = new Subject<IClientEvent>();
        this._stackCount = 0;
    }

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
    
    public observe = (): Observable<IClientEvent> => Observable.from<IClientEvent>(this._emitter);
}
