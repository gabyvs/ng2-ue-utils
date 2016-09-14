import { Component, OnDestroy, OnInit } from '@angular/core';
import { NotificationService } from './notification-service';

/**
 * This component leverages the `NotificationService` to display dismissible notifications on the DOM.  In order to
 * register a notification to be displayed in your component app, make a call to the `notify` method on your instance
 * of `NotificationService` with the `NotificationService.INotification` signature.
 *
 * ### Simple Example
 *
 * in main app component:
 * ```
 * @Component({
 *     directives: [ Notification, MyContent ],
 *     providers: [ NotificationService ],
 *     selector: 'app-main',
 *     template: `
 *         <notification></notification>
 *         <my-content></my-content>
 *     `
 * })
 * ```
 *
 * and in MyContent component:
 * ```
 *
 * import { NotificationService } from 'ng2-ue-utils';
 *
 * @Component({
 *     selector: 'my-content',
 *     template: template
 * })
 * class MyContent {
 * 
 *     constructor(private _service: NotificationService){}
 *     
 *     ...
 * 
 *     private handleError(error: {code: number, message: string}){
 *         const notification: NotificationService.INotification = { 
 *             message: message, 
 *             type: 'error' as NotificationService.NotificationType 
 *         }
 *         this._service.notify(notification);
 *     }
 *     
 * }
 * ```
 */

declare const require: any;
const styles: any = require('!!css-loader!less-loader!./notification.less');

@Component({
    selector: 'notification',
    styles: [styles.toString()],
    template: `
    <div class="notification-container" [ngClass]="baseColor" [class.show]="notification" [class.hide]="hide">
        <div class="notification-content" (mouseover)="resetTimer()" (mouseout)="restartTimer()">
            <div aria-hidden="true" class="close" (click)="close()">x</div>
            <div><span class="glyphicon {{ icon }}"></span><span class="main-text">{{ notification }}</span></div>
            <div><span class="details-text">Click to see details and additional notifications (coming soon!)</span></div>
        </div>
    </div>
    `
})
export class Notification implements OnDestroy, OnInit {

    private serviceSubscription;
    private baseColor: string = 'empty';
    private notification: string;
    private hide: boolean = false;
    private icon: string = 'glyphicon-alert';
    private hideTime: number = 1000;
    private fadeTime: number = 4000;
    private fadeTimerHandle: any;

    constructor (private notificationService: NotificationService) {}

    private show (message: string, type?: string) {
        this.notification = message;
        switch (type) {
            case 'success':
                this.fadeTimerHandle = setTimeout(() => this.close(), this.fadeTime);
                this.icon = 'glyphicon-ok';
                this.baseColor = 'success';
                break;
            case 'warning':
                this.icon = 'glyphicon-alert';
                this.baseColor = 'warning';
                break;
            default: //must be an error
                this.icon = 'glyphicon-alert';
                this.baseColor = 'error';
                break;
        }
    }

    public close () {
        this.hide = true;
        setTimeout(() => {
            this.fadeTimerHandle = undefined;
            this.notification = undefined;
            this.baseColor = 'empty';
            this.hide = false;
        }, this.hideTime);
    }

    public resetTimer () {
        if (this.fadeTimerHandle) {
            clearTimeout(this.fadeTimerHandle);
        }
    }

    public restartTimer () {
        if (this.fadeTimerHandle) {
            this.fadeTimerHandle = setTimeout(() => this.close(), this.fadeTime);
        }
    }

    public ngOnInit () {
        this.serviceSubscription = this.notificationService.observe$.subscribe((notification: NotificationService.INotification) => {
            this.show(notification.message, notification.type);
        });
    }

    public ngOnDestroy () {
        this.serviceSubscription.unsubscribe();
        this.serviceSubscription = undefined;
    }
}
