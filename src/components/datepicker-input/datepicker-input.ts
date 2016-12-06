import {
    Component,
    Input,
    Output,
    EventEmitter,
    ViewChild,
    OnInit
} from '@angular/core';

import {
    DatePicker
} from '../../index';

import * as moment from 'moment';

// import requirejs
declare const require: any;
const template: string = require('./datepicker-input.html');

/**
 * Optional component which provides an example of basic usability case for the datepicker component
 */

@Component({
    selector: 'datepicker-input',
    styles: [ `span { cursor: pointer; font-family: 'Open Sans', 'Helvetica Neue', 'Helvetica'; border: 1px solid #ccc; 
        padding: 4px 10px; display: inline-block; text-align: center; background-color: white; }` ],
    template: template
})
export class DatePickerInput implements OnInit {
    // Inputs for the datepicker
    @Input() public month: number;
    @Input() public year: number;
    @Input() public monthSpan: number;
    @Input() public maxRange: number;
    @Input() public beginRange: number | string;
    @Input() public endRange: number | string;
    @Input() public beginDate: number | string;
    @Input() public endDate: number | string;
    @Input() public alignCal: string;

    @ViewChild(DatePicker) private dp: DatePicker;
    @Output() public emitDate = new EventEmitter();

    // selected dates
    public dates: string = 'Choose a date range';

    public ngOnInit(): void {
        if (this.beginDate && this.endDate) {
            let start: moment.Moment = moment(this.beginDate);
            let end: moment.Moment = moment(this.endDate);

            if (start.isValid() && end.isValid()) {
        this.dates = start.format('MMM DD, YYYY') + ' - ' + end.format('MMM DD, YYYY');  
            }
        }
    }

    public show(event): void {
        this.dp.show();
        event.stopPropagation();
    }

    public dateChange(event): void {
        let start = moment(event.beginDate);
        let end = moment(event.endDate);
        this.dates = start.format('MMM DD, YYYY') + ' - ' + end.format('MMM DD, YYYY');
        this.emitDate.emit(event);
    }
};
