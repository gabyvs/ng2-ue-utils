import {Component, EventEmitter, Input, Output} from '@angular/core';

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

declare const require: any;
const styles: any = require('!!css-loader!less-loader!./pagination.less');

@Component({
    selector: 'pagination',
    styles: [styles.toString()],
    template: `
    <div class="alm-pagination">
        <span class="alm-pagination-text">{{ settings?.from + 1 }} - {{ settings?.to }} of {{ settings?.filteredCount }}</span>
        <span class="alm-pagination-text" *ngIf="settings?.filteredCount !== settings?.count">
            (filtered from a total of {{ settings.count }})</span>
        <div class="btn-group" role="group">
             <button class="alm-pagination-symbol btn btn-default btn-sm backward"
                    (click)="backward()"
                    [disabled]="settings?.from < 1"></button>
            <button class="alm-pagination-symbol btn btn-default btn-sm forward"
                    (click)="forward()"
                    [disabled]="settings?.to === settings?.filteredCount"></button>
        </div>
    </div>
    `
})
export class Pagination {

    @Input()
    public settings: Pagination.IRangeSnapshot;

    @Input()
    public pageSize: number = 25;

    @Output()
    public emitPaginate = new EventEmitter();

    public forward () {
        if (this.settings.to === this.settings.filteredCount) { return; }
        let to = Math.min(this.settings.filteredCount, this.settings.to + this.pageSize);
        this.emitPaginate.emit({ from: this.settings.to, to: to });
    }

    public backward () {
        if (this.settings.from < 1) { return; }
        this.emitPaginate.emit({ from: this.settings.from - this.pageSize, to: this.settings.from });
    }
}

export module Pagination {
    export interface IRangeSnapshot {
        count: number;
        filteredCount: number;
        from: number;
        to: number;
    }
}
