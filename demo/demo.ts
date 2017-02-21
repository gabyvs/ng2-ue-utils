import { Component, OnInit }    from '@angular/core';
import { Observable } from 'rxjs';

import {
    ContextService,
     Filtering,
     NotificationService,
     Pagination,
     ProgressService,
     ValueHandler
}                       from '../src';
import {IClientEvent} from '../src/services/client/clientObserver';

declare const require: any;
const template: string = require('./demo.html');
const styles: any = require('!!css-loader!less-loader!./demo.less');

@Component({
    selector: 'demo',
    styles: [ styles.toString()],
    template: template
})
export class Demo implements OnInit {
    
    // Tooltip
    public isEnabled: boolean = false;
    private dynamicTooltipContentOptions: string[] = ['How much wood would a woodchuck chuck if a woodchuck could ' +
    'chuck wood?', 'Governor Marley', 'Mélée Island', 'A rubber chicken with a pulley in the middle', 
        'Captain LeChuck'];
    public dynamicTooltipContent: string = this.dynamicTooltipContentOptions[0];
    
    public firstTooltip: string = 'Tooltip content is set with the \'tooltip\' attribute, ' +
        'and position is set with the \'tooltipPosition\' attribute';
    public longTooltip: string = 'I am a very long tooltip... my maximum allowable width is set with the ' +
        '\'max-width\' attribute (350 in this case, but I default to 200)';
    
    private progressEventsReceived: number = 0;
    private progressStart: IClientEvent = {
        event: 'start',
        method: 'get',
        stackCount: 1
    };
    private progressSuccess: IClientEvent = {
        event: 'complete',
        method: 'get',
        stackCount: 0
    };
    private progressError: IClientEvent = {
        event: 'error',
        method: 'get',
        stackCount: 0
    };
    public latestEvent: IClientEvent;
    
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
    public baseModalSubmitCount: number = 0;
    public baseModalCloseCount: number = 0;
    
    // Binary Choice Modal
    public binaryModalSubmitCount: number = 0;
    public binaryModalCancelCount: number = 0;
    public binaryModalCloseCount: number = 0;

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

    // Date change
    public datePickerEvent: any;

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
    public openModal(modal: any): void {
        modal.open();
    }

    public baseModalSubmit(): void {
        this.baseModalSubmitCount++;
    }
    
    public baseModalClose(): void {
        this.baseModalCloseCount++;
    }

    public modalCountText(prop: string): string {
        const timeOrTimes: string = this[prop] > 1 ? 'times' : 'time';
        return this[prop] + ' ' + timeOrTimes;
    }
    
    // Binary Choice Modal
    public binaryChoiceModalHandler(result: boolean): void {
        result ? this.binaryModalSubmitCount++ : this.binaryModalCancelCount++;
        this.binaryModalCloseCount++;
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

    public dateChange(event): void {
        this.datePickerEvent = event;
    }
    
    private handleEvent(event: IClientEvent): void {
        this.latestEvent = event;
        this.progressService.notify(event);
    }
    
    public ngOnInit() {
        Observable
            .timer(0, 2000)
            .subscribe(
                (x) => {
                    this.progressEventsReceived++;
                    if (x % 6 === 0) {
                        this.handleEvent(this.progressError);
                    } else if (x % 3 === 0) {
                        this.handleEvent(this.progressSuccess);
                    } else {
                        this.handleEvent(this.progressStart);
                    }
                }
            );
    }

    // Tooltip
    public changeDynamicTooltip(): void {
        const otherContentOptions = this.dynamicTooltipContentOptions.filter(word => word !== this.dynamicTooltipContent);
        const randomContentIndex: number = this.randomIndex(otherContentOptions.length);
        this.dynamicTooltipContent = otherContentOptions[randomContentIndex];
    }

    public flipIsEnabled() {
        this.isEnabled = !this.isEnabled;
    }

    private randomIndex(upperBound: number) {
        return Math.floor(Math.random() * upperBound);
    }
}
