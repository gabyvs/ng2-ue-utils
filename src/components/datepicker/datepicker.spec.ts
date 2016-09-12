import { addProviders, async, beforeEach, inject } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing/component_fixture';
import { TestComponentBuilder } from '@angular/core/testing/test_component_builder';

import { DatePicker } from './datepicker';

describe('Component: DatePicker', () => {
    let fixture: ComponentFixture<DatePicker>;
    let dp;
    let element;

    let initialize = () => {
        dp.monthspan = 2;
        dp.maxRange = 7;
        dp.beginRange = 1470121200000;
        dp.endRange = 1479974400000;
        dp.now = new Date('2016/9/1');
        dp.month = 9;
        dp.baseMonth = 8;
        dp.year = 2016;
        fixture.detectChanges();
    };

    beforeEach(() => {
        addProviders([
            TestComponentBuilder
        ]);
    });

    beforeEach(async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb
            .createAsync(DatePicker)
            .then((f: ComponentFixture<DatePicker>) => {
                fixture = f;
                dp = f.componentInstance;
                element = f.nativeElement;
                initialize();
            });
    })));

    it('should call constructor', () => {
        expect(dp.now.getTime()).toEqual(new Date('2016/9/1').getTime());
        expect(dp.baseMonth).toEqual(8);
        expect(dp.hideComponent).toBe(true);
    });

    it('should parse arbitary date', () => {
        const timestamp: number = new Date('2016/6/17').getTime();

        expect(dp.parseDate(12345)).toEqual(12345); // test timestamp
        expect(dp.parseDate('12345')).toEqual(12345);
        expect(dp.parseDate('06/17/2016')).toEqual(timestamp); // test string format
        expect(dp.parseDate('June 17 2016')).toEqual(timestamp);
        expect(dp.parseDate('2016/06/17')).toEqual(timestamp);
        expect(dp.parseDate('2016/6/17')).toEqual(timestamp);
    });

    it('should show/hide the component', () => {
        dp.show();
        expect(dp.hideComponent).toBe(false);
        dp.close();
        expect(dp.hideComponent).toBe(true);
    });

    it('should filter out bad picks', () => {
        //range longer than max range
        dp._beginDate = 1470141200001;
        dp._endDate = 1479954300000;
        expect(dp.isValid()).toBe(false);

        // missing end date
        dp._beginDate = 1470121200001;
        dp._endDate = undefined;
        expect(dp.isValid()).toBe(false);

        // missing begin date
        dp._beginDate = undefined;
        dp._endDate = 1470121200001;
        expect(dp.isValid()).toBe(false);

        // missing both dates
        dp._beginDate = undefined;
        dp._endDate = undefined;
        expect(dp.isValid()).toBe(false);

        // endDate earlier than beginDate
        dp._beginDate = 1479974300000;
        dp._endDate = 1470121200001;
        expect(dp.isValid()).toBe(false);
    });

    it('should generate correct calendars', () => {
        const calendar = dp.generateCalendar(dp.year, dp.baseMonth);
        expect(calendar.length).toEqual(5);
        expect(calendar[0].length).toEqual(7);
        expect(calendar[0][4].day).toEqual(1);
        expect(calendar[0][4].style).toEqual('normal today');
    });
});
