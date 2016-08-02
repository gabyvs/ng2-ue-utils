import {Component, Input, Output, EventEmitter} from '@angular/core';

declare const require: any;
const styles: any = require('!!css-loader!less-loader!./list-headers.less');

/**
 * A component which can be used as a header to a table which allows for emitting events to allow for
 * sorting elements by attributes.
 * 
 * ### Simple Example
 *
 * ```
 * <list-headers (emitSort)="sort($event)" [headers]="headers"></list-headers>
 *
 * ```
 *
 * This will trigger sort() upon clicking on one of the header values to be sorted
 * Header values is also set as headers using the interface defined in its own namespace.
 */

@Component({
    selector: 'list-headers',
    styles: [styles.toString()],
    template: `
        <div *ngFor="let header of headers" (click)="sort(header.property)" [ngStyle]="header.styles">
            <span class="header-title">{{(header.label || header.property) | uppercase}} </span>
            <span class="header-icon"
                  [ngClass]="ascOrder ? 'arrow-down' : 'arrow-up'"
                  *ngIf="header.property && sortedBy === header.property">
            </span>
        </div>
    `
})
export class ListHeaders {
    @Input() public headers: ListHeaders.IHeader;
    @Output() public emitSort = new EventEmitter();

    private sortedBy = 'name';
    private ascOrder = true;

    public sort(header) {
        if (!header) { return; }
        if (this.sortedBy === header) {
            this.ascOrder = !this.ascOrder;
        } else {
            this.ascOrder = true;
        }
        this.sortedBy = header;
        this.emitSort.emit({ order: this.ascOrder ? 'asc' : 'desc', sortBy: this.sortedBy });
    }
}

export namespace ListHeaders {
    'use strict';

    export interface IStyle {
        width: string;
    }

    export interface IHeader {
        label: string;
        property: string;
        styles: IStyle;
    }    
}
