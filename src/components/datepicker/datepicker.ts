import { Component, OnInit, OnChanges, SimpleChange, HostBinding, Input, Output, EventEmitter } from '@angular/core';

// import requirejs
declare const require: any;

@Component({
    selector: 'datepicker',
    styles: [require('!!css-loader!less-loader!./datepicker.less').toString()],
    template: require('./datepicker.html')
})
export class DatePicker implements OnInit, OnChanges {
    // all integer input will be non-zero based to be user-friendly
    @Input() public month: number = (new Date().getMonth() + 1);
    @Input() public year: number = (new Date().getFullYear());
    @Input() public monthSpan: number = 1;
    @Input() public maxRange: number = 1;

    // strict range limits
    @Input() public set beginRange (value: number | string) {
        this._beginRange = this.parseDate(value);
    };
    @Input() public set endRange (value: number | string) {
        this._endRange = this.parseDate(value);
    };

    // preselected dates
    @Input() public set beginDate (value: number | string) {
        this._beginDate = this.parseDate(value);
    };
    @Input() public set endDate (value: number | string) {
        this._endDate = this.parseDate(value);
    };

    @Output() public emitDate = new EventEmitter();

    public monthText: string[] = ['JAN', 'FEB', 'MAR', 'APR',
    'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    public dayText: string[] = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    // component style
    @HostBinding('class.hidden')
    private hideComponent: boolean = true;

    // internal members
    private _beginRange: number;
    private _endRange: number;
    private _beginDate: number;
    private _endDate: number;
    private baseMonth: number;
    private now: Date;
    public viewModel: Object[];

    constructor() {
        // copy references
        this.baseMonth = this.month - 1; // -1 for zero based months
        this.now = new Date();
    }

    public ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
        // TODO::exceptions instead of console messages
        // sanitize base month
        if (this.month < 1 || this.month > 12) {
            //throw new Error(`Expected string or number, got '${padding}'.`);
            console.warn('Invalid month: ' + this.month + '. Defaulting to current month.');
            this.month = this.now.getMonth() + 1;
        }

        // sanitize base year
        if (this.year < 1900 || this.year > 2100) {
            console.warn('Invalid year: ' + this.year + '. Defaulting to current year.');
            this.year = this.now.getFullYear();
        }

        // sanitize number of months displayed
        if (this.monthSpan > 3 || this.monthSpan < 1) {
            console.warn('Invalid monthSpan: ' + this.monthSpan + '. Defaulting to 1.');
            this.monthSpan = 1;
        }

        // sanitize maxRange
        if (this.maxRange < 1) {
            console.warn('Invalid maxRange: ' + this.maxRange + '. Defaulting to 1.');
            this.maxRange = 1;
        }
    }

    /**
     * Utility method to parse number or string literal to UNIX timestamp
     * @param {number|string} Literal to be parsed
     * @return {number} timestamp
     */
    private parseDate(date: number | string): number {
        // if input date is a number (timestamp)
        if (typeof date === 'number') {
            return date;
        }

        // implementation of isNumeric()
        if (!isNaN(parseFloat(<string> date)) && isFinite(<number> date)
            && (parseInt(<string> date).toString().length === (<string> date).length)) {
            return +date;
        }

        return Date.parse(<string> date);
    }

    public ngOnInit() {
        this.changeMonth(); // initiate first render
    }

    public show(event: MouseEvent) {
        console.log(event);
        //this.top = event.pageY + 'px';
        //this.left = event.pageX + 'px';
        this.hideComponent = false;

    }

    public close() {
        this.hideComponent = true;
    }

    public emit() {
        // validate chosen date then emit event
        if (this.isValid()) {
            this.emitDate.emit({beginDate: this._beginDate, endDate: this._endDate});
            this.close();
        }
    }

    /**
     * Public method to trigger change or refresh calendar
     * @param {number} [newMonth=currentMonth] New base month
     * Side-effect: this.viewModel gets updated with new calendar data
     */
    public changeMonth(newMonth: number = (this.baseMonth + 1)) {
        const begin = (this.monthSpan === 3) ? -1 : 0;
        const end = (this.monthSpan === 1) ? 1 : 2;

        // check for end range
        if (new Date(this.year, newMonth + begin, 0).getTime() < this._beginRange) {
            return;
        } else if (new Date(this.year, newMonth + end - 2, 1).getTime() > this._endRange) {
            return;
        }

        this.viewModel = [];
        this.month = newMonth;
        this.baseMonth = newMonth - 1;

        // add viewmodels
        for (let i = begin; i < end; i++) {
            let year = new Date(this.year, this.baseMonth + i).getFullYear();
            let month = new Date(this.year, this.baseMonth + i).getMonth();

            this.viewModel.push({
                calendar: '',
                days: this.generateCalendar(this.year, month),
                month: month,
                monthText: this.monthText[month],
                year: year
            });
        }

        // TODO:DELETE (debug) expose viewModel to window object
        window['view'] = this.viewModel;
    }

    /**
     * Method to register date selection and emit events
     * @param {number} month Chosen month
     * @param {number|''} day Chosen day
     * @return {string}
     */
    public chooseDate(month: number, day: any) {
        // ignore blank dates
        if (day === '') { return; }

        // CASE: Single day picker
        if (this.maxRange === 1) {
            this._beginDate = this._endDate = new Date(this.year, month, day).getTime();

        // CASE: no _beginDate
        // CASE: _beginDate and _endDate both exist
        } else if (!this._beginDate || this._beginDate && this._endDate) {
            this._beginDate = new Date(this.year, month, day).getTime();
            delete this._endDate;

        // Case: pick the end date
        } else {
            this._endDate = new Date(this.year, month, day).getTime();
        }

        // update viewModel
        this.isValid();
        this.changeMonth();
    }

    /**
     * Utility method to sanity-check given dates
     * @return {boolean} Go for launch?
     */
    private isValid(): boolean {
        // reject if _endDate comes before _beginDate
        if (this._beginDate > this._endDate) {
            this._beginDate = this._endDate;
            this._endDate = undefined;
            return false;
        }

        // reject if _endDate goes beyond max range length limit
        if (this._endDate > (this._beginDate + ((this.maxRange - 1) * 3600 * 24 * 1000))) {
            this._beginDate = this._endDate;
            this._endDate = undefined;
            return false;
        }

        // reject if _startDate goes before beginRange
        if (this._beginDate < this._beginRange || this._beginDate > this._endRange) {
            this._beginDate = undefined;
            return false;
        }

        // reject if _endDate goes beyond endRange
        if (this._endDate > this._endRange || this._endDate < this._beginRange) {
            this._endDate = undefined;
            return false;
        }

        // reject if either _beginDate or _endDate is missing
        if (!this._beginDate || !this._endDate) {
            return false;
        }

        // all is good
        return true;
    }

    /**
     * Method that generates calendar HTML
     * @param {number} year Calendar display year.
     * @param {number} month Calendar display month. (zero-based)
     * @return {string[][]}
     */
    private generateCalendar(year: number, month: number): string[][] {
        let calendar: string[][] = [];
        let firstDay = (new Date(year, month)).getDay(); // first day of the month offset
        let monthLength = (new Date(year, month + 1, 0)).getDate(); // days in the month

        // loop variables
        let totalDays: number = 1;
        let rowDays: number = 0;
        let row = [];

        const generateDay = (day: number, _this): {} => {
            let dayObj = {day: undefined, style: 'normal'};
            let timeStamp = new Date(year, month, day).getTime();

            // empty day object paddings
            if (day === 0) {
                dayObj.style = 'empty';
                return dayObj;
            }

            dayObj.day = day;

            if (_this.now.getFullYear() === year && _this.now.getMonth() === month && _this.now.getDate() === day) {
                dayObj.style += ' today';
            }

            if (timeStamp === _this._beginDate) {
                dayObj.style += ' startdate';
            }

            if (timeStamp === _this._endDate) {
                dayObj.style += ' enddate';
            }

            if (timeStamp > _this._beginDate && timeStamp < _this._endDate  + 1) {
                dayObj.style += ' between';
            }  else if (timeStamp > _this._beginDate && timeStamp <  (new Date(_this._beginDate + ((_this.maxRange - 1) * 3600 * 24 * 1000))).getTime() ) {
                dayObj.style += ' availble-range';
            }

            if (_this.maxRange > 1) {
                if (timeStamp < _this._beginDate) {
                    //dayObj.style += ' disabled';
                } else if (timeStamp > (new Date(_this._beginDate + ((_this.maxRange - 1) * 3600 * 24 * 1000))).getTime()) {
                    // dayObj.style += ' disabled';
                }
            }

            if (timeStamp < _this._beginRange) {
                dayObj.style += ' disabled';
            } else if (timeStamp > _this._endRange) {
                dayObj.style += ' disabled';
            }

            return dayObj;
        };

        // loop until all days have been generated
        while (totalDays <= monthLength) {
            let day;

            // insert empty days until we reach the right day of week
            if (firstDay !== 0) {
                day = generateDay(0, this);
                firstDay--;

            } else {
                // if row is full create a new row
                if (rowDays === 7) {
                    calendar.push(row);
                    rowDays = 0;
                    row = [];
                }

                day = generateDay(totalDays, this);
                totalDays++;
            }

            row.push(day);
            rowDays++;
        }

        calendar.push(row);
        return calendar;
    }
}
