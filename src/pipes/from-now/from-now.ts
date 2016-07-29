import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

/**
 * This pipe leverages moment.js to format a valid timestamp into a relative time statement.
 * @param {number} timestamp - number representing a valid date, like 1467929380554
 *
 * ### Simple Example
 *
 * ```
 * <span>{{ timestamp | fromNow }}</span>
 * ```
 *
 * will result on something like
 * ```
 * <span>Ten minutes ago</span>
 * ```
 *
 */

@Pipe({name: 'fromNow'})
export class FromNow implements PipeTransform {
    public transform(timestamp: number): string {
        if (!timestamp) { return 'unknown'; }
        return moment(timestamp).fromNow();
    }
}
