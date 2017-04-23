import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import * as _ from 'lodash';

declare const require: any;
const styles: any = require('!!css-loader!less-loader!./list-headers-table.less');

/**
 * A component which can be used as a header to a table which allows for emitting events to allow for
 * sorting elements by attributes.
 * 
 * ### Simple Example
 *
 * ```
 * <list-headers-table (emitSort)="sort($event)" [headers]="headers"></list-headers-table>
 *
 * ```
 * 
 * In model:
 * ```
 *  class Component {
 *      public headers = [
 *          { label: 'display name',    property: 'displayName',    styles: { width: '23%' }},
 *          { label: 'description',     property: 'description',    styles: { width: '54%' }, sortOnInit: 'desc'},
 *          { label: 'modified',        property: 'lastModifiedAt', styles: { width: '23%' }}
 *      ];
 *  }
 * ```
 *
 * This will trigger sort() upon clicking on one of the header values to be sorted.
 * 
 * Header values are also set as headers using the interface defined in its own namespace.  Note that the default
 * sorting criteria can be set by adding the optional `sortOnInit` property to the desired header.
 */

@Component({
    selector: 'list-headers-table',
    styles: [styles.toString()],
    template: `
        <tr>
            <th *ngFor="let header of headers" (click)="sort(header.property)" [ngStyle]="header.styles">
                <span class="header-title">{{(header.label || header.property) | uppercase}} </span>
                <span class="header-icon"
                      [ngClass]="ascOrder ? 'arrow-down' : 'arrow-up'"
                      *ngIf="header.property && sortedBy === header.property">
                </span>
            </th>
        </tr>
    `
})
export class ListHeadersTable implements OnInit {
    @Input() public headers: ListHeaders.IHeader[];
    @Output() public emitSort = new EventEmitter();

    private sortedBy: string;
    private ascOrder: boolean;

    public sort(header) {
        if (!header) { return; }
        if (this.sortedBy === header) {
            this.ascOrder = !this.ascOrder;
        } else {
            this.ascOrder = true;
        }
        this.sortedBy = header;
        this.emitSort.emit({ 
            order: this.ascOrder ? 'asc' as ListHeaders.ascOrder : 'desc' as ListHeaders.ascOrder, 
            sortBy: this.sortedBy 
        });
    }
    
    public ngOnInit() {
        const sortHeader: ListHeaders.IHeader = _.find(this.headers, (header: ListHeaders.IHeader) => {
            return header.sortOnInit;
        }) || this.headers[0];
        this.ascOrder = sortHeader.sortOnInit ? sortHeader.sortOnInit === 'asc' : true;
        this.sortedBy = sortHeader.property;
    }
}

export namespace ListHeaders {
    'use strict';

    export interface IStyle {
        width: string;
    }

    export interface IHeader {
        label: string;
        property?: string;
        styles?: IStyle;
        sortOnInit?: ascOrder;
    }
    
    export type ascOrder = 'asc' | 'desc';
}
