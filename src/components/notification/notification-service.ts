import { Injectable } from '@angular/core';
import { Subject, Observable }    from 'rxjs';

@Injectable()
export class NotificationService {

    private observer = new Subject<any>();

    public observe$: Observable<any> = this.observer.asObservable();

    public notify (notification: NotificationService.INotification) {
        this.observer.next(notification);
    }
}

export namespace NotificationService {
    'use strict';

    export interface INotification {
        message: string;
        type?: NotificationType;
        gtmAction?: string;
    }

    export type NotificationType = 'error' | 'warning' | 'success';
    
}
