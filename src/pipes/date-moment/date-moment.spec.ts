import { DateMoment } from './date-moment';
import * as moment from 'moment';

describe('FromNowPipe', () => {
    let pipe: DateMoment;

    beforeEach(() => {
        pipe = new DateMoment();
    });

    it('by default, transforms a timestamp to a string containing short month name, day of month, year, short time', () => {
        const testDate = moment('2013-02-08 09:30').valueOf();
        expect(pipe.transform(testDate)).toEqual('Feb 8, 2013 9:30 AM');
    });

    it('transforms a timestamp to a moment formatted date', () => {
        const testDate = moment('2013-02-08 09:30').valueOf();
        expect(pipe.transform(testDate, 'MM-DD-YYYY')).toEqual('02-08-2013');
    });

    it('transforms an undefined input to "unknown"', () => {
        expect(pipe.transform(undefined)).toEqual('unknown');
    });
    
    it('transforms an invalid input to "Invalid date"', () => {
        expect(pipe.transform(9999999999999999999999)).toEqual('Invalid date');
    });
});
