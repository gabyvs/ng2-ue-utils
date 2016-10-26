import { Component }    from '@angular/core';

import {
    ContextService,
     Filtering,
     Modal,
     NotificationService,
     Pagination,
     ProgressService,
     ValueHandler
}                       from '../src';

declare const require: any;
const template: string = require('./demo.html');
const styles: any = require('!!css-loader!less-loader!./demo.less');

@Component({
    selector: 'demo',
    styles: [ styles.toString()],
    template: template
})
export class Demo {

    // Value Handler
    public vhEvent: ValueHandler.IEvent;

    public vhAttribute: any = {
        name: 'email',
        value: 'example@example.com'
    };
    public vhValidation: ValueHandler.IValidationRule = {
        fn: (newVal: string) => {
            const re = /\S+@\S+\.\S+/;
            return re.test(newVal);
        },
        message: 'my invalid input msg :)'
    };

    // Hint Scroll
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

    // Modal
    public modalResult: string;

    // Pagination
    public paginationEvent: any;
    public emptyPaginationState: Pagination.IRangeSnapshot = {
        count: 0,
        filteredCount: 0,
        from: 0,
        to: 0
    };
    public paginationState: Pagination.IRangeSnapshot = {
        count: 234,
        filteredCount: 73,
        from: 25,
        to: 50
    };

    // List Headers
    public listheaderEvent: any;
        public headers = [
        { label: 'display name',    property: 'displayName',    styles: { width: '23%' } },
        { label: 'description',     property: 'description',    sortOnInit: 'desc',     styles: { width: '54%' } },
        { label: 'modified',        property: 'lastModifiedAt', styles: { width: '23%' } }
    ];

    // Filtering
    public emitFilterCriteria: any;
    public customFilterFields: Filtering.IFilterField[] = [
        { field: 'ny', label: 'New York' },
        { field: 'nj', label: 'New Jersey' },
        { field: 'ca', label: 'California' }
    ];

    // Date Moment Pipe
    public today = new Date().valueOf();

    // From Now Pipe
    public recent = this.today - (1000 * 60 * 10);

    // constructor(public notificationService: NotificationService, public progressService: ProgressService) {}
    constructor(
         public context: ContextService,
         public notificationService: NotificationService,
         public progressService: ProgressService) {}

    // Notification
    public emitWarning(): void {
        const warning: NotificationService.INotification = {
            message: 'My warning message',
            type: 'warning' as NotificationService.NotificationType
        };
        this.notificationService.notify(warning);
    }
    public emitError(): void {
        const error: NotificationService.INotification = {
            message: 'My error message',
            type: 'error' as NotificationService.NotificationType
        };
        this.notificationService.notify(error);
    }
    public emitSuccess(): void {
        const success: NotificationService.INotification = {
            message: 'My success message',
            type: 'success' as NotificationService.NotificationType
        };
        this.notificationService.notify(success);
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

    // List Headers
    public sort(listheaderEvent): void {
        this.listheaderEvent = listheaderEvent;
    }

    // Filtering
    public onFilter(emitFilterCriteria): void {
        this.emitFilterCriteria = emitFilterCriteria;
    }

    // Value Handler
    public vhEditAttribute(event: ValueHandler.IEvent): void {
        this.vhEvent = event;
        this.vhAttribute.value = event.value;
        event.subject.next();
    }

}
