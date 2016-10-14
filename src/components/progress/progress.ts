import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ProgressService } from './progress-service';

/**
 * This component displays a progress bar 56px from the top of the page.  You can interact with it via
 * ProgressService.notify.  This method takes an IEvent (defined in progress-service.ts) as its only argument.
 *
 * Previously this component included its position fixed in the window (top 56px).
 * Starting on 1.9.0 the position must be provided by the consumer if it's different than the position of the parent element,
 * otherwise it will take position top 0 from the parent element.
 *
 * ### Simple Example
 * 
 * in main app component:
 * ```
 * @Component({
 *     directives: [ Progress, MyContent ],
 *     providers: [ ProgressService ],
 *     selector: 'app-main',
 *     template: `
 *         <progress-bar></progress-bar>
 *         <my-content></my-content>
 *     `
 * })
 * ```
 *
 * and in MyContent component:
 * ```
 *
 * import { ProgressService } from 'ng2-ue-utils';
 *
 * @Component({
 *     selector: 'my-content',
 *     template: template
 * })
 * class MyContent {
 * 
 *     constructor(private _service: ProgressService){}
 *     
 * 
 *     private updateProgressBar(event: string, method: string, stackCount: number){
 *         const event: ProgressService.IEvent = {
 *             event: event as ProgressService.EventType,
 *             method: method as ProgressService.EventMethod,
 *             stackCount: number
 *         }
 *         this._service.notify(event);
 *     }
 *     
 * }
 * 
 */

declare const require: any;
const styles: any = require('!!css-loader!less-loader!./progress.less');

@Component({
    selector: 'progress-bar',
    styles: [styles.toString()],
    template: `
    <div class="progress-container" [ngClass]="baseColor">
        <div class="progress-reporter" [ngClass]="progressColor" [style.width.%]="progress" [hidden]="!progress"></div>
    </div>
    `
})
export class Progress implements OnDestroy, OnInit {

    private baseColor: string = 'empty';
    private progressColor: string = 'empty';
    private progress: number = 0;
    private intervalId: any;
    private status: string;
    private subscription: any;

    constructor (public progressService: ProgressService, private cdr: ChangeDetectorRef) {}

    private onEmit (status: ProgressService.IEvent) {
        if (status.event === 'start') {
            this.start();
        } else {
            this.setStatus(status.event, status.method);
            if (!status.stackCount) {
                this.end();
            }
        }
    }

    private setStatus (value: string, method: string) {
        switch (value) {
            case 'error':
                this.status = value;
                break;
            case 'warning':
                this.status = this.status !== 'error' ? value : this.status;
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
            this.status = undefined;
        }
        setTimeout(() => {
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
        this.subscription = this.progressService.observe$.filter(status => status.event !== 'next')
            .subscribe((event: ProgressService.IEvent) => {
                this.onEmit(event);
            });
    }

    public ngOnDestroy () {
        clearInterval(this.intervalId);
        this.subscription.unsubscribe();
        this.subscription = undefined;
    }
}
