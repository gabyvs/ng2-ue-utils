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

export module NotificationService {

    export interface INotification {
        message: string;
        type?: NotificationType;
    }

    export type NotificationType = 'error' | 'warning';
    
}