import { Injectable } from '@angular/core';
import { Subject, Observable }    from 'rxjs';

@Injectable()
export class ProgressService {

    private observer = new Subject<any>();

    public observe$: Observable<any> = this.observer.asObservable();

    public notify (event: ProgressService.IEvent) {
        this.observer.next(event);
    }
}

export namespace ProgressService {
    'use strict';
    
    export interface IEvent {
        event: EventType;
        method: EventMethod;
        stackCount: number;
    }

    export type EventType = 'error' | 'warning' | 'start' | 'complete' | 'next';
    export type EventMethod = 'get' | 'put' | 'post' | 'delete';

}
