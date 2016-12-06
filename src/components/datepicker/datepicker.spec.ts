import {
    ComponentFixture,
    TestBed
} from '@angular/core/testing';

import {
    DatePicker
} from './datepicker';
import * as moment from 'moment';

declare const beforeEach, describe, expect, it, jasmine, spyOn;

describe('Component: DatePicker', () => {
    let fixture: ComponentFixture < DatePicker > ;
    let dp;
    let element;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DatePicker]
        });
        fixture = TestBed.createComponent(DatePicker);
        dp = fixture.componentInstance;
        element = fixture.nativeElement;
        fixture.detectChanges();
    });

    it('should initialize properly', () => {
        expect(moment().isSame(dp.now, 'day')).toBeTruthy();
        expect(dp._baseMonth).toEqual(moment().month());
        expect(dp.hideComponent).toBe(true);
    });

    it('should show/hide the component', () => {
        expect(dp.hideComponent).toBe(true);
        dp.show();
        expect(dp.hideComponent).toBe(false);
        dp.close();
        expect(dp.hideComponent).toBe(true);
    });

    it('should only emit datepick event if sanityCheck passes', () => {
        // sanity check fails then emit doesn't happen
        spyOn(dp, 'sanityCheck').and.returnValue(false);
        spyOn(dp.emitDate, 'emit');
        dp.emit();
        expect(dp.emitDate.emit).not.toHaveBeenCalled();

        // sanity check fails then emit does happen
        dp.sanityCheck.and.returnValue(true);
        dp.emit();
        expect(dp.emitDate.emit).toHaveBeenCalled();
    });

    it('should handle empty dates and single-day operations - chooseDate()', () => {
        spyOn(dp, 'sanityCheck');
        spyOn(dp, 'updateViewModel');

        // Ignores blank dates (cells in the beginning/end of month without dates)
        dp.chooseDate(2016, 9, undefined);
        expect(dp._beginDate).toBe(undefined);
        expect(dp._endDate).toBe(undefined);
        expect(dp.sanityCheck).not.toHaveBeenCalled();
        expect(dp.updateViewModel).not.toHaveBeenCalled();

        // Cases for single day picker
        this._maxRange = 1;
        dp.chooseDate(2016, 1, 1);
        expect(dp._beginDate.isSame(moment([2016, 1, 1]), 'day')).toBeTruthy();
        expect(dp._endDate.isSame(moment([2016, 1, 1]), 'day')).toBeTruthy();
        expect(dp.sanityCheck).toHaveBeenCalled();
        expect(dp.updateViewModel).toHaveBeenCalled();
    });

    it('should display new set of months in the viewModel - nextMonth()', () => {
        spyOn(dp, 'updateViewModel');

        for (let i = 0; i < 12; i++) {
            // long ago in 1993
            dp._year = 1993;

            // test cases for moving back a month
            dp._baseMonth = i;
            dp.nextMonth(-1);
            expect(dp._year).toBe(1993);
            expect(dp.updateViewModel).toHaveBeenCalledWith(i - 1);
            dp.updateViewModel.calls.reset();

            // test cases for next month
            dp._baseMonth = i;
            dp.nextMonth(1);
            expect(dp._year).toBe(1993);
            expect(dp.updateViewModel).toHaveBeenCalledWith(i + 1);
            dp.updateViewModel.calls.reset();

            // change back to today
            dp._baseMonth = i;
            dp.nextMonth(0);
            expect(dp._year).toBe(moment().year());
            expect(dp.updateViewModel).toHaveBeenCalledWith(moment().month());
            dp.updateViewModel.calls.reset();
        }
    });

    it('should handle normal date-range operations multiple times - chooseDate()', () => {
        spyOn(dp, 'sanityCheck');
        spyOn(dp, 'updateViewModel');
        dp._maxRange = 3;

        // Pick a normal date as _beginDate
        dp.chooseDate(2016, 2, 1);
        expect(dp._beginDate.isSame(moment([2016, 2, 1]), 'day')).toBeTruthy();
        expect(dp._endDate).toBe(undefined);
        expect(dp.sanityCheck).toHaveBeenCalled();
        expect(dp.updateViewModel).toHaveBeenCalled();

        // clear spy tracking information
        dp.sanityCheck.calls.reset();
        dp.updateViewModel.calls.reset();

        // Ignores blank dates (cells in the beginning/end of month without dates)
        dp.chooseDate(2016, 2, undefined);
        expect(dp._beginDate.isSame(moment([2016, 2, 1]), 'day')).toBeTruthy();
        expect(dp._endDate).toBe(undefined);
        expect(dp.sanityCheck).not.toHaveBeenCalled();
        expect(dp.updateViewModel).not.toHaveBeenCalled();

        // Pick a nomal date as _endDate
        dp.chooseDate(2016, 2, 3);
        expect(dp._beginDate.isSame(moment([2016, 2, 1]), 'day')).toBeTruthy();
        expect(dp._endDate.isSame(moment([2016, 2, 3]), 'day')).toBeTruthy();
        expect(dp.sanityCheck).toHaveBeenCalled();
        expect(dp.updateViewModel).toHaveBeenCalled();

        // clear spy tracking information
        dp.sanityCheck.calls.reset();
        dp.updateViewModel.calls.reset();

        // With a range selected, choose a new date (select new set of dates)
        dp.chooseDate(2016, 3, 1);
        expect(dp._beginDate.isSame(moment([2016, 3, 1]), 'day')).toBeTruthy();
        expect(dp._endDate).toBe(undefined);
        expect(dp.sanityCheck).toHaveBeenCalled();
        expect(dp.updateViewModel).toHaveBeenCalled();

        // clear spy tracking information
        dp.sanityCheck.calls.reset();
        dp.updateViewModel.calls.reset();
        dp._year = 2016;

        // choose a date in a different year
        dp.chooseDate(2017, 3, 1);
        expect(dp._beginDate.isSame(moment([2016, 3, 1]), 'day')).toBeTruthy();
        expect(dp._endDate.isSame(moment([2017, 3, 1]), 'day')).toBeTruthy();
        expect(dp.sanityCheck).toHaveBeenCalled();
        expect(dp.updateViewModel).toHaveBeenCalled();
    });

    it('should check for sanity of chosen dates with sanitize on and off', () => {
        const day1 = moment([2016, 5, 1]);
        const day2 = moment([2016, 5, 2]);
        const day3 = moment([2016, 5, 3]);
        const day5 = moment([2016, 5, 5]);
        const day10 = moment([2016, 5, 10]);

        // bulk set date properties
        const dateReset = (beginDate, endDate, beginRange, endRange, maxRange = 5) => {
            dp._beginDate = beginDate;
            dp._endDate = endDate;
            dp._beginRange = beginRange;
            dp._endRange = endRange;
            dp._maxRange = maxRange;
        };

        // use to check date values
        const dateCheck = (beginDate, endDate) => {
            expect(dp._beginDate).toBe(beginDate);
            expect(dp._endDate).toBe(endDate);
        };

        // norml day within range
        dateReset(day1, day3, undefined, undefined, 5);
        expect(dp.sanityCheck(false)).toBeTruthy();
        dateCheck(day1, day3);
        expect(dp.sanityCheck(true)).toBeTruthy();
        dateCheck(day1, day3);

        // normal day out of max range
        dateReset(day1, day5, undefined, undefined, 2);
        expect(dp.sanityCheck(false)).toBeFalsy();
        dateCheck(day1, day5);
        expect(dp.sanityCheck(true)).toBeFalsy();
        dateCheck(day5, undefined);

        // within maxrange, out of bounds
        dateReset(day1, day5, undefined, day3, 10);
        expect(dp.sanityCheck(false)).toBeFalsy();
        dateCheck(day1, day5);
        expect(dp.sanityCheck(true)).toBeFalsy();
        dateCheck(day1, undefined);

        // within maxrange, out of bounds
        dateReset(day1, day5, day2, day10, 10);
        expect(dp.sanityCheck(false)).toBeFalsy();
        dateCheck(day1, day5);
        expect(dp.sanityCheck(true)).toBeFalsy();
        dateCheck(undefined, undefined);

        // within maxrange & range, end date before start date
        dateReset(day5, day2, day1, day10, 10);
        expect(dp.sanityCheck(false)).toBeFalsy();
        dateCheck(day5, day2);
        expect(dp.sanityCheck(true)).toBeFalsy();
        dateCheck(day2, undefined);
        
        // valid startDate, but endDate out of bound
        dateReset(day2, day10, day1, day5, 3);
        expect(dp.sanityCheck(false)).toBeFalsy();
        dateCheck(day2, day10);
        expect(dp.sanityCheck(true)).toBeFalsy();
        dateCheck(day2, undefined);

        // valid startdate, enddate out of range
        dateReset(day3, day1, day2, day5, 3);
        expect(dp.sanityCheck(false)).toBeFalsy();
        dateCheck(day3, day1);
        expect(dp.sanityCheck(true)).toBeFalsy();
        dateCheck(day3, undefined);
    });

    it('updateViewModel() handle all requests including illegal requests', () => {
        spyOn(dp, 'generateCalendar');

        // test wraparound into the next year
        dp._year = 2016;
        dp._baseMonth = 11;
        dp._monthSpan = 3;
        dp.updateViewModel();
        expect(dp.generateCalendar).toHaveBeenCalledWith(2016, 10);
        expect(dp.generateCalendar).toHaveBeenCalledWith(2016, 11);
        expect(dp.generateCalendar).toHaveBeenCalledWith(2017, 0);        
        expect(dp.viewModel.length).toBe(3);
        dp.generateCalendar.calls.reset();

        // test wraparound into the previous year
        dp._year = 2016;
        dp._baseMonth = 0;
        dp._monthSpan = 3;
        dp.updateViewModel();
        expect(dp.generateCalendar).toHaveBeenCalledWith(2015, 11);
        expect(dp.generateCalendar).toHaveBeenCalledWith(2016, 0);
        expect(dp.generateCalendar).toHaveBeenCalledWith(2016, 1);        
        expect(dp.viewModel.length).toBe(3);
        dp.generateCalendar.calls.reset();

        // test cases where months span outside acceptable range
        dp._year = 2016;
        dp._baseMonth = 5;
        dp._monthSpan = 3;
        dp._endRange = moment([2016, 7, 15]);
        dp.updateViewModel(7);
        expect(dp.paginationRight).toBe('disabled');
        dp.generateCalendar.calls.reset();

        // test cases where months span outside acceptable range
        dp._year = 2016;
        dp._baseMonth = 5;
        dp._monthSpan = 3;
        dp._beginRange = moment([2016, 4, 15]);
        dp.updateViewModel(4);
        expect(dp.paginationLeft).toBe('disabled');
        dp.generateCalendar.calls.reset();
    });

    it('should generate correct calendar for all months', () => {
        // check for appropriate padding in all months
        for (let x = 0; x < 12; x++) {
            const year = moment().year();
            const month = x;
            const firstDay = new Date(year, month).getDay();
            const cal = dp.generateCalendar(year, month);

            for (let y = 0; y < firstDay; y++) {
                expect(cal[0][y].day).toBe(undefined);
                expect(cal[0][y].style).toBe('disabled');
            }
        }

        // check for today style
        dp.now = moment([2016, 9, 1]);
        const firstDay: number = new Date(2016, 9).getDay();
        const cal = dp.generateCalendar(2016, 9);
        expect(cal[0][firstDay].style).toBe('normal today');

    });

    it('should generate correct calendar with start and end dates', () => {
        dp._beginDate = moment([2016, 10, 1]);
        dp._endDate = moment([2016, 10, 3]);
        const firstDay: number = new Date(2016, 10).getDay();
        const cal = dp.generateCalendar(2016, 10);
        expect(cal[0][firstDay].style).toBe('normal startdate between');
        expect(cal[0][firstDay + 1].style).toBe('normal between');
        expect(cal[0][firstDay + 2].style).toBe('normal enddate between');
    });

    it('should generate correct calendar with between ', () => {
        dp._beginDate = moment([2016, 10, 1]);
        dp._endDate = moment([2016, 10, 3]);

    });
});
