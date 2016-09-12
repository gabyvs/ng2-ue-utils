import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

// import requirejs
declare const require: any;

@Component({
    selector: 'datepicker',
    styles: [require('!!css-loader!less-loader!./datepicker.less').toString()],
    template: require('./datepicker.html')
})
export class DatePicker implements OnInit {
    // all integer input will be non-zero based to be user-friendly
    @Input() public bindTarget: string;
    @Input() public month: number = (new Date().getMonth() + 1);
    @Input() public year: number = (new Date().getFullYear());
    @Input() public monthSpan: number = 1;
    @Input() public maxRange: number = 1;
    @Output() public emitDate = new EventEmitter();

    private monthText: string[] = ['January', 'February', 'March', 'April', 
    'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    public dayText: string[] = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    private beginDate: number;
    private endDate: number;
    private baseMonth: number;
    private now: Date;
    public viewModel: Object[];

    constructor() {
        // copy references
        this.baseMonth = this.month - 1; // -1 for zero based months
        this.now = new Date();
    }

    public ngOnInit() {
        // TODO::exceptions instead of console messages

        // sanitize base month
        if (this.month < 1 || this.month > 12) {
            console.warn('Invalid month: ' + this.month + '. Defaulting to current month.');
            this.month = new Date().getMonth() + 1;

            // TODO:: use this.now instead of new objects
        }

        // sanitize base year
        if (this.year < 1900 || this.year > 2100) {
            console.warn('Invalid year: ' + this.year + '. Defaulting to current year.');
            this.year = new Date().getFullYear();
        }

        // sanitize monthSpan
        if (this.monthSpan > 3 || this.monthSpan < 1) {
            console.warn('Invalid monthSpan: ' + this.monthSpan + '. Defaulting to 1.');
            this.monthSpan = 1;
        }

        // sanitize maxRange
        if (this.maxRange < 1) {
            console.warn('Invalid maxRange: ' + this.maxRange + '. Defaulting to 1.');
            this.maxRange = 1;
        }

        // check if bindtarget was specified TODO:find alternative
        if (typeof this.bindTarget !== 'string') {
            console.error('No bind target specified');
        }

        // initiate first draw
        this.changeMonth();
    }

    /**
     * Public method to trigger change or refresh calendar
     * @param {number} [newMonth=currentMonth] New base month 
     * @return {string}
     */
    public changeMonth(newMonth: number = (this.baseMonth + 1)) {
        const begin = (this.monthSpan === 3) ? -1 : 0;
        const end = this.monthSpan - 1;

        this.viewModel = [];
        this.month = newMonth;
        this.baseMonth = newMonth - 1;

        // add viewmodels
        for (let i = begin; i < end; i++) {
            let month = new Date(this.year, this.baseMonth + i).getMonth();

            this.viewModel.push({
                calendar: '',
                days: this.generateCalendar(this.year, month),
                month: month,
                monthText: this.monthText[month],
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
            this.beginDate = this.endDate = new Date(this.year, month, day).getTime();

        // CASE: no beginDate
        // CASE: beginDate and endDate both exist
        } else if (!this.beginDate || this.beginDate && this.endDate) {
            this.beginDate = new Date(this.year, month, day).getTime();
            delete this.endDate;

        // Case: pick the end date
        } else {
            this.endDate = new Date(this.year, month, day).getTime();
        }

        // validate chosen date then emit event
        if (this.isValid()) {
            this.emitDate.emit({beginDate: this.beginDate, endDate: this.endDate});
        } 

        // update viewModel
        this.changeMonth();
    }

    /**
     * Utility method to sanity-check given dates
     * @return {boolean} Go for launch?
     */
    private isValid(): boolean {
        // reject if either beginDate or endDate is missing
        if (!this.beginDate || !this.endDate) {
            return false;
        }

        // reject if endDate comes before beginDate
        if (this.beginDate > this.endDate) {
            // fix this dilemma
            this.beginDate = this.endDate;
            delete this.endDate;
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
        let totalDays = 1;
        let rowDays = 0;
        let row = [];

        // loop until all days have been generated
        while (totalDays <= monthLength) {
            let dayObj = {day: undefined, style: 'normal'};

            // insert empty days until we reach the right day of week
            if (firstDay !== 0) {
                dayObj.style = 'empty';
                row.push(dayObj);
                rowDays++;
                firstDay--;

            } else {
                // if row is full create a new row
                if (rowDays === 7) {
                    calendar.push(row);
                    rowDays = 0;
                    row = [];
                }


                let timeStamp = new Date(year, month, totalDays).getTime();
                dayObj.day = totalDays;

                if (this.now.getFullYear() === year && this.now.getMonth() === month && this.now.getDate() === totalDays) {
                    dayObj.style += ' today';
                }

                if (timeStamp === this.beginDate) {
                    dayObj.style += ' startdate';
                }

                if (timeStamp === this.endDate) {
                    dayObj.style += ' enddate';
                }

                if (timeStamp > this.beginDate && 
                    timeStamp < this.endDate) {
                    dayObj.style += ' between';
                }

                if (this.maxRange > 1) {
                    if (timeStamp < this.beginDate) {
                        dayObj.style += ' disabled';
                    } else if (timeStamp > (new Date(this.beginDate + (this.maxRange * 3600 * 24 * 1000))).getTime()) {
                        dayObj.style += ' disabled';
                    }
                }

                row.push(dayObj);
                totalDays++;
                rowDays++;
            }
        }
        calendar.push(row);

        return calendar;
    }
}
