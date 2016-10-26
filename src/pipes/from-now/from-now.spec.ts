import * as moment from 'moment';

import { FromNow } from './from-now';

declare const beforeEach, describe, expect, it;

describe('FromNowPipe', () => {
    let pipe: FromNow;
    beforeEach(() => {
        pipe = new FromNow();
    });
    it('transforms a timestamp of yesterday to "a day ago"', () => {
        let yesterday = moment().subtract(1, 'd').valueOf() as number;
        expect(pipe.transform(yesterday)).toEqual('a day ago');
    });

    it('transforms an undefined timestamp to "unknown"', () => {
        expect(pipe.transform(undefined)).toEqual('unknown');
    });
});
