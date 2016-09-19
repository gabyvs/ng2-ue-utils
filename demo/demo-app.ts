import { Component } from '@angular/core';
import { DateMoment } from '../src/pipes/date-moment/date-moment';
import { FromNow } from '../src/pipes/from-now/from-now';
import { LoadingDots } from '../src/components/loading-dots/loading-dots';
import { Filtering } from '../src/components/filtering/filtering';
import { HintScroll } from '../src/components/hint-scroll/hint-scroll';
import { Modal } from '../src/components/modal/modal';
import { Pagination } from '../src/components/pagination/pagination';
import { ValueHandler } from '../src/components/value-handler/value-handler';
import { Notification } from '../src/components/notification/notification';
import { NotificationService } from '../src/components/notification/notification-service';
import { Progress } from '../src/components/progress/progress';
import { ProgressService } from '../src/components/progress/progress-service';
import { ToggleOnHover } from '../src/directives/toggle-on-hover/toggle-on-hover';
import { FocusOnInit } from '../src/directives/focus-on-init/focus-on-init';
import { ListHeaders } from '../src/components/list-headers/list-headers';

declare const require: any;
const template: string = require('./demo.html');
const styles: any = require('!!css-loader!less-loader!./demo.less');

@Component({
    directives: [LoadingDots, ToggleOnHover, FocusOnInit, Filtering, HintScroll, Modal, Pagination, ValueHandler, 
        Notification, Progress, ListHeaders],
    pipes: [DateMoment, FromNow],
    providers: [NotificationService, ProgressService],
    selector: 'app',
    styles: [styles.toString()],
    template: template
})
export class AppComponent {
    public today = new Date().valueOf();
    public recent = this.today - (1000 * 60 * 10);
    public emitFilterCriteria: any;
    public classForE2E: string = 'classForE2E';
    public paginationEvent: any;
    public listheaderEvent: any;
    public vhEvent: ValueHandler.IEvent;
    public modalResult: string;
    public paginationState: Pagination.IRangeSnapshot = {
        count: 234,
        filteredCount: 73,
        from: 25,
        to: 50
    };
    public customFilterFields: Filtering.IFilterField[] = [
        { field: 'ny', label: 'New York' },
        { field: 'nj', label: 'New Jersey' },
        { field: 'ca', label: 'California' }
    ];
    public vhAttribute: any = {
        name: 'email',
        value: 'example@example.com'
    };
    private warning: NotificationService.INotification = {
        message: 'My warning message',
        type: 'warning' as NotificationService.NotificationType
    };
    private error: NotificationService.INotification = {
        message: 'My error message',
        type: 'error' as NotificationService.NotificationType
    };
    private success: NotificationService.INotification = {
        message: 'My success message',
        type: 'success' as NotificationService.NotificationType
    };
    public vhValidation: ValueHandler.IValidationRule = {
        fn: (newVal: string) => {
            const re = /\S+@\S+\.\S+/;
            return re.test(newVal);
        },
        message: 'my invalid input msg :)'
    };
    public scrollableDivs: string[] = [
        'myContent1',
        'myContent2',
        'myContent3',
        'myContent4',
        'myContent5',
        'myContent6',
        'myContent7',
        'myContent8',
        'myContent9',
        'myContent10',
        'myContent11',
        'myContent12',
    ];
    public headers = [
        { label: 'display name',    property: 'displayName',    styles: { width: '23%' } },
        { label: 'description',     property: 'description',    sortOnInit: 'desc',     styles: { width: '54%' } },
        { label: 'modified',        property: 'lastModifiedAt', styles: { width: '23%' } }
    ];
    
    constructor(public notificationService: NotificationService, public progressService: ProgressService) {}
    
    // Value Handler
    public vhEditAttribute(event: ValueHandler.IEvent): void {
        this.vhEvent = event;
        this.vhAttribute.value = event.value;
        event.subject.next();
    }
    
    // Filtering
    public onFilter(emitFilterCriteria): void {
        this.emitFilterCriteria = emitFilterCriteria;
    }
    
    // Modal
    public openModal(myModal: Modal): void {
        myModal.open();
    }
    public resolveModal(submitted): void {
        this.modalResult = submitted ? 'submitted!' : 'cancelled.';
    }
    
    // Pagination
    public onPaginate(paginationEvent): void {
        this.paginationEvent = paginationEvent;
    }
    
    // Notification
    public emitWarning(): void {
        this.notificationService.notify(this.warning);
    }
    public emitError(): void {
        this.notificationService.notify(this.error);
    }
    public emitSuccess(): void {
        this.notificationService.notify(this.success);
    }
    
    // Progress
    public progress(error?: boolean): void {
        this.progressService.notify({
            event: 'start',
            method: 'get',
            stackCount: 1
        });
        if (error) {
            setTimeout(() => {
                this.progressService.notify({
                    event: 'error',
                    method: 'get',
                    stackCount: 0
                });
            }, 3000);
        } else {
            setTimeout(() => {
                this.progressService.notify({
                    event: 'complete',
                    method: 'get',
                    stackCount: 0
                });
            }, 3000);
        }
    }

    public sort(listheaderEvent): void {
        this.listheaderEvent = listheaderEvent;
    }
}
