import { ChangeDetectorRef, Component, OnDestroy, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProgressService } from './progress-service';
import { IClientEvent } from '../../services/client/clientObserver';

/**
 * This component displays a progress bar.  You can interact with it via `ProgressService#notify`.
 *
 * Previously this component included an absolute position style which set it 56px from the top of the window.
 * Starting on 1.9.0 the position must be provided by the consumer, otherwise it will take position top 0 from the 
 * parent element.
 * 
 * The default behavior is that, once a call is in flight, the progress bar will continue progressing while it and any 
 * additional calls initiated in the meantime are in flight.  It will only complete once the last in-flight call has 
 * resolved.  To retain control over when the progress bar restarts in your application, pass in the `restartOnAjax` 
 * attributelike this:
 * 
 * <progress-bar [restartOnAjax]="true">
 *     
 * This will tell the Progress component to restart on each `start` event it receives from the progress service.  This
 * affords you complete control because you can filter/validate the events that you send to ProgressService#notify in
 * your application's controller.
 *
 * ### Simple Example
 * 
 * in main app component:
 * ```
 * @Component({
 *     selector: 'app-main',
 *     template: `
 *         <progress-bar></progress-bar>
 *         <my-component></my-component>
 *     `
 * })
 * ```
 *
 * and in MyComponent:
 * ```
 * import { OnInit } from '@angular/core';
 * import { ProgressService } from 'ng2-ue-utils';
 *
 * @Component({
 *     selector: 'my-component',
 *     template: '<div> my content </div>'
 * })
 * class MyComponent implements OnInit {
 * 
 *     constructor(private progressService: ProgressService, private clientObserver: ClientObserver){}
 *     
 *     private ngOnInit(){
 *         this.clientObserver.clientEvents.subscribe(
 *             (clientEvent: IClientEvent) => {
 *                 this.progressService.notify(clientEvent);
 *             }
 *         )
 *     }
 * }
 * 
 */

declare const require: any;
const styles: any = require('!!css-loader!less-loader!./progress.less');

export type progressStatus = 'init'|'started'|'success'|'warning'|'error';

@Component({
    selector: 'progress-bar',
    styles: [styles.toString()],
    template: `
    <div class="progress-container ut-root" [ngClass]="baseColor">
        <div class="progress-reporter ut-reporter" [ngClass]="progressColor" [style.width.%]="progress" [hidden]="!progress"></div>
    </div>
    `
})
export class Progress implements OnDestroy, OnInit {

    @Input() private restartOnAjax: boolean;

    private baseColor: string = 'empty';
    private progressColor: string = 'empty';
    private progress: number = 0;
    private intervalId: any;
    private initColorsTimeoutId: any;
    private status: progressStatus = 'init';
    private subscription: Subscription;

    constructor (public progressService: ProgressService, private cdr: ChangeDetectorRef) {}

    private onEmit (status: IClientEvent) {
        if (status.event === 'start' && (this.restartOnAjax || this.status === 'init')) {
            this.start();
        } else {
            this.setStatus(status.event, status.method);
            if (!status.stackCount) {
                this.end();
            }
        }
    }

    public setStatus (value: string, method: string) {
        switch (value) {
            case 'error':
                this.status = value as progressStatus;
                break;
            case 'warning':
                this.status = this.status !== value as progressStatus ? 'warning' : this.status;
                break;
            case 'complete':
                if (this.status !== 'error' && this.status !== 'warning' && method !== 'get') {
                    this.status = 'success';
                }
                break;
            default:
                break;
        }
    }

    private start (): void {
        clearTimeout(this.initColorsTimeoutId);
        this.status = 'started';
        this.baseColor = 'on';
        this.progressColor = 'default';
        this.progress = 0;
        this.cdr.detectChanges();
        this.grow();
    }

    private end (): void {
        this.progress = 100;
        clearInterval(this.intervalId);
        if (this.status) {
            this.progressColor = this.status;
            this.status = 'init';
        }
        this.initColorsTimeoutId = setTimeout(() => {
            this.baseColor = 'empty';
            this.progressColor = 'empty';
        }, 500);
    }

    private grow () {
        clearInterval(this.intervalId);
        this.intervalId = setInterval(() => {
            const remaining = 100 - this.progress;
            this.progress = this.progress + (0.15 * Math.pow(1 - Math.sqrt(remaining), 2));
        }, 200);
    }

    public ngOnInit () {
        this.subscription = this.progressService.observe$
            .filter(status => !!status)
            .filter(status => status.event !== 'next')
            .subscribe((event: IClientEvent) => {
                this.onEmit(event);
            });
    }

    public ngOnDestroy () {
        clearInterval(this.intervalId);
        this.subscription.unsubscribe();
        this.subscription = undefined;
    }
}
