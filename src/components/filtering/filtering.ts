import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { Subject } from 'rxjs';

import { DROPDOWN_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';

/**
 * A component which provides users with a dropdown and input with which to select filtering criteria.  The component
 * accepts all possible sorting criteria as inputs and displays them in the dropdown, and emits the `emitFilter` event
 * to its parent so that its handler can filter a collection.  `emitFilter` is called on `keyup` whenever the user types 
 * something into the input field.
 * 
 * The `filterFields` input expects a FilterField array, interface is defined below.  Valid input might look like this:
 *
 *      [
 *          { field: 'fullName',  label: 'Name' },
 *          { field: 'email',     label: 'Email' },
 *          { field: 'userName',  label: 'Username' }
 *      ]
 * 
 * ### Simple Example
 *
 * ```
 * <filtering (emitFilter)="onFilter($event)" [filterFields]="customFilterFields"></filtering>
 * ```
 * 
 */

declare const require: any;
const template: string = require('./filtering.html');
const styles: any = require('!!css-loader!less-loader!./filtering.less');

@Component({
    directives: [DROPDOWN_DIRECTIVES],
    selector: 'filtering',
    styles: [styles.toString()],
    template: template
})
export class Filtering implements OnInit {

    @Input() public filterFields: Filtering.IFilterField[];

    @Output() public emitFilter = new EventEmitter();

    public allField = { field: '', label: 'All' };

    public filteredBy = this.allField;
    
    private filterTermStream = new Subject<string>();

    public filter(term: string) { this.filterTermStream.next(term); }

    public filterBy(field: any, value?: string) {
        this.filteredBy = field;
        if (value) {
            this.emitFilter.emit({ filterBy: this.filteredBy.field, filterText: value });
        }
    }

    public ngOnInit () {
        this.filterTermStream
            .debounceTime(400)
            .distinctUntilChanged()
            .subscribe(term => {
                this.emitFilter.emit({ filterBy: this.filteredBy.field, filterText: term });
            });
    }
}

export module Filtering {
    export interface IFilterField {
        field: string;
        label: string;
    }
}
