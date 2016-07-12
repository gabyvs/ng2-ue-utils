import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

/**
 * As of Angular RC2, date pipes are broken for some browsers at least for using timestamps to be formatted to strings.
 * This pipe is meant to be use to overcome that issue. It is using moment to do the formatting.
 * @param {number} timestamp - number representing a valid date, like 1467929380554
 * @param {string} format - a moment valid format string. Check out {@link http://momentjs.com/docs/#/parsing/string-format/|momentjs}
 *
 * ### Simple Example
 *
 * ```
 * <span>{{timestamp | dateMoment }}</span>
 * ```
 *
 * will result on something like
 * ```
 * <span>Sep 4 1986 8:30 PM</span>
 * ```
 *
 * ### Example for using a different format
 *
 * ```
 * <span>{{timestamp | dateMoment:'MM-DD-YYYY' }}</span>
 * ```
 *
 * will result in something like
 * ```
 * <span>02-08-2013</span>
 * ```
 *
 */
@Pipe({name: 'dateMoment'})
export class DateMomentPipe implements PipeTransform {
    public transform(timestamp: number, args?: string): string {
        if (!timestamp) { return 'unknown'; }
        const date = moment(timestamp);
        if (date.isValid()) {
            return date.format(args || 'lll');
        }
        return 'Invalid date';
    }
}
