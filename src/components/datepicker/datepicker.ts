import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';

// import requirejs
declare const require: any;

/**
 * These pagination controls are designed to work with a pagination list wrapper, which is taken as an input along with
 * the desired page size.
 * 
 * @input settings: this is the pagination wrapper.
 * @input pageSize: this is the desired number of results per page.
 * 
 * @output emitPaginate: this event is intended to be heard by a handler which queries the wrapper for the desired
 * range of results.
 * 
 * ### Simple Example
 *
 * ```
 * <pagination [settings]="paginationSettings" (emitPaginate)="onPaginate($event)"></pagination>
 * ```
 * 
 */

@Component({
    selector: 'datepicker',
    styles: [require('!!css-loader!less-loader!./datepicker.less').toString()],
    template: require('./datepicker.html')
})
export class DatePicker implements OnInit {
    // all integer input will be non-zero based to be user-friendly
    @Input() public set month(value: number) {
        if (!value) {
            return;
        } else if (value < 1 || value > 12) {
            throw RangeError('Invalid month: ' + value);
        } else {
            this._baseMonth = value - 1;
        }
    };

    @Input() public set year(value: number) {
        if (!value) {
            return;
        } else if (value < 1900 || value > 2100) {
            throw RangeError('Invalid year: ' + value);
        } else {
            this._year = value;
        }
    };
    
    @Input() public set monthSpan(value: number){
        if (value > 3 || value < 1) {
            throw RangeError('Invalid monthSpan: ' + value);
        } else {
            this._monthSpan = value;
        }
    };
    @Input() public set maxRange(value: number){
        if (value < 1) {
            throw RangeError('Invalid maxRange: ' + value);
        } else {
            this._maxRange = value;
        }
    };

    // strict range limits
    @Input() public set beginRange (value: number | string) {
        if (value) {
            this._beginRange = moment(value);    
        }
    };
    @Input() public set endRange (value: number | string) {
        if (value) {
            this._endRange = moment(value);
        }
    };

    // preselected dates
    @Input() public set beginDate (value: number | string) {
        if (value) {
            this._beginDate = moment(value);   
        }
    };
    @Input() public set endDate (value: number | string) {
        if (value) {
            this._endDate = moment(value);   
        }
    };

    // display alignment
    @Input() public set alignCal (value: string) {
        if (value === 'right' || value === 'left' || value === 'top' || value === 'bottom') {
            this.alignClass = value;
        } else if (value) {
            throw Error('Invalid alignment: ' + value);
        }
    };

    @Output() public emitDate = new EventEmitter();

    public monthText: string[] = ['JAN', 'FEB', 'MAR', 'APR',
    'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    public dayText: string[] = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    // visibility binding
    private hideComponent: boolean = true;
    private paginationLeft: string = '';
    private paginationRight: string = '';
    private alignClass: string = '';

    // internal members
    private _year: number = moment().year();
    private _monthSpan: number = 1;
    private _maxRange: number = 1;
    private _beginRange: moment.Moment;
    private _endRange: moment.Moment;
    private _beginDate: moment.Moment;
    private _endDate: moment.Moment;
    private _baseMonth: number;
    private now: moment.Moment;
    public viewModel: Object[];

    public ngOnInit() {
        this.now = moment();
        this._baseMonth = moment().month();
        this.updateViewModel(); // initiate first render
    }

    public show() {
        this.hideComponent = false; 
    }

    public close() {
        this.hideComponent = true;
    }

    /**
     * Method called by template to submit date selection
     * Emits event through the output (only function to do so)
     */
    public emit() {
        // validate chosen date then emit event
        if (this.sanityCheck(false)) {
            this.emitDate.emit({beginDate: +(this._beginDate), endDate: +(this._endDate)});
            this.close();
        }
    }

    /**
     * Method called by template to display new set of months in the viewModel
     * Calls updateViewModel without mutating selected dates 
     */
    public nextMonth(interval: number = 0) {
        if (interval === 0) {
            this._year = this.now.year();
            this.updateViewModel(this.now.month());
        } else {
            this.updateViewModel(this._baseMonth + interval);
        }
    }

    /**
     * Method to register date selection called by the template. Updates viewModel.
     * @param {number} year - Chosen year
     * @param {number} month - Chosen month
     * @param {number} day - Chosen day
     */
    public chooseDate(year: number, month: number, day: number) {
        // ignore blank dates
        if (!day) { return; }

        // CASE: Single day picker
        if (this._maxRange === 1) {
            this._beginDate = this._endDate = moment([year, month, day]);

        // CASE: no _beginDate
        // CASE: _beginDate and _endDate both exist
        } else if (!this._beginDate || this._beginDate && this._endDate) {
            this._beginDate = moment([year, month, day]);
            this._endDate = undefined;

        // Case: pick the end date
        } else {
            this._endDate = moment([year, month, day]);
        }

        // update viewModel, regardless of sanity check result
        this.sanityCheck();
        this.updateViewModel();
    }

    /**
     * Internal method to trigger an update of the calendar with latest data
     * Side-effect: this.viewModel gets updated with new calendar data
     * @param {number} [newMonth=currentMonth] New base month
     */
    protected updateViewModel(newMonth: number = this._baseMonth) {
        /** Const with offset to first and last month to be drawn */
        const begin = (this._monthSpan === 3) ? -1 : 0;
        const end = (this._monthSpan === 1) ? 1 : 2;

        /** Const with earliest and latest dates that will be rendered */
        const earliestDate = moment(moment([this._year, newMonth + begin + 1, 1])['_d']);
        const latestDate = moment(moment([this._year, newMonth + end - 1, -1])['_d']);

        /** verify all dates will fall within the restrictive range */
        if (this._beginRange && this._beginRange.isAfter(earliestDate)) {
            this.paginationLeft = 'disabled';
        } else if (this._endRange && this._endRange.isBefore(latestDate)) {
            this.paginationRight = 'disabled';
        } else {
            /** Reset pagination controls */
            this.paginationLeft = '';
            this.paginationRight = '';
        }

        /** Reset viewModel and update month properties */
        this.viewModel = [];
        this._baseMonth = newMonth;

        for (let i = begin; i < end; i++) {
            /** Get year and month (with overflow handling 2016/13 -> 2017/1) */
            const renderDate = moment(moment([this._year, this._baseMonth + i, 1])['_d']);
            const year = renderDate.year();
            const month = renderDate.month();

            this.viewModel.push({
                calendar: '',
                days: this.generateCalendar(year, month),
                month: month,
                monthText: this.monthText[month],
                year: year
            });
        }
    }

    /**
     * Method that generates calendar HTML
     * @param {number} year Calendar display year.
     * @param {number} month Calendar display month. (zero-based)
     * @return {string[][]}
     */
    protected generateCalendar(year: number, month: number): string[][] {
        let calendar: string[][] = [];
        let firstDay = (new Date(year, month)).getDay(); // first day of the month offset
        const monthLength = (new Date(year, month + 1, 0)).getDate(); // days in the month
        const generateDay = (day: number): {} => {
            let newDay = {day: undefined, style: 'normal'};
            let styles: string[] = [];

            // empty day object paddings
            if (day === 0) {
                newDay.style = 'disabled';
                return newDay;
            }

            // copy integer day
            newDay.day = day;
            styles.push('normal');

            /** States to help apply appropriate styles */
            const sBegin: boolean = !(!this._beginDate || this._endDate);
            const sComplete: boolean = !(!this._beginDate || !this._endDate);
            const TS = moment([year, month, day]);
            const max = (sBegin) ? moment(this._beginDate).add(this._maxRange, 'days') : 0;

            /** Apply today class regardless of state */
            if (TS.isSame(this.now, 'day')) {
                styles.push('today');
            }

            /** Apply start & enddate styles */
            if (this._beginDate && TS.isSame(this._beginDate, 'day')) { 
                styles.push('startdate'); 
            }
            if (sComplete && TS.isSame(this._endDate, 'day')) { 
                styles.push('enddate');
            }

            /** Apply highlight to selected date range */
            if (sComplete && TS.isSameOrAfter(this._beginDate, 'day') 
                && TS.isSameOrBefore(this._endDate, 'day')) {
                styles.push('between');
            }

            // available tobe selected dates
            if (sBegin && TS.isAfter(this._beginDate, 'day') 
                && TS.isSameOrBefore(max, 'day')
                && TS.isSameOrBefore(this._endRange, 'day')) {
                styles.push('availble-range');
            }

            // disable out of range dates    
            if (this._beginRange && TS.isBefore(this._beginRange, 'day')) {
                styles.push('disabled');
            } else if (this._endRange && TS.isAfter(this._endRange, 'day')) {
                styles.push('disabled');
            }

            // flatten styles array to a single string
            newDay.style = styles.join(' ');
            return newDay;
        };

        // loop variables
        let totalDays: number = 1;
        let rowDays: number = 0;
        let row = [];

        // loop until all days have been generated
        while (totalDays <= monthLength) {
            let day;
            // insert empty days until we reach the right day of week
            if (firstDay !== 0) {
                day = generateDay.call(this, 0);
                firstDay--;
            } else {
                // if row is full create a new row
                if (rowDays === 7) {
                    calendar.push(row);
                    rowDays = 0;
                    row = [];
                }
                day = generateDay.call(this, totalDays);
                totalDays++;
            }
            row.push(day);
            rowDays++;
        }

        // do a final push for the last row and return
        calendar.push(row);
        return calendar;
    }

    /**
     * Utility method to sanity-check given dates
     * SIDE-EFFECT: Will mutate properties _beginDate and/or _endDate to appropriate
     *   values if they are found to be insane and sanitize flag is on.
     * @param {boolean} [sanitize=true] Fix invalid values (induces side-effect)
     * @return {boolean} Go for launch?
     */
    protected sanityCheck(sanitize: boolean = true): boolean {
        // function to check if date is within accepted range
        const isInRange = (d: moment.Moment): boolean => {
            if (this._beginRange && d.isBefore(this._beginRange, 'day')) {
                return false;
            }
            if (this._endRange && d.isAfter(this._endRange, 'day')) {
                return false;
            }
            return true;
        };

        // function to return check as fail and sanitize if requested
        const doSanitize = (beginDate, endDate) => {
            if (sanitize) {
                this._beginDate = beginDate;
                this._endDate = endDate;
            }
            return false;
        };

        // reject if _startDate goes before beginRange
        if (!isInRange(this._beginDate)) {
            return doSanitize(undefined, undefined);
        }

        // reject if either _beginDate or _endDate is missing
        if (!this._beginDate || !this._endDate) {
            return false;
        }

        // reject if _endDate comes before _beginDate
        if (this._endDate.isBefore(this._beginDate)) {
            return doSanitize(this._endDate, undefined);
        }

        // reject if _endDate goes beyond endRange
        if (!isInRange(this._endDate)) {
            return doSanitize(this._beginDate, undefined);
        }

        // reject if _endDate goes beyond max range length limit
        if (this._endDate.isAfter(moment(this._beginDate).add(this._maxRange, 'days'))) {
            return doSanitize(this._endDate, undefined);
        }

        // otherwise all is good
        return true;
    }
}
