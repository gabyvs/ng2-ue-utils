import {
    ComponentFixture,
    TestBed
}                       from '@angular/core/testing';

import { Filtering }    from './filtering';

declare const beforeEach, describe, expect, it, jasmine, spyOn;

describe('Component: Filtering', () => {
    let fixture: ComponentFixture<Filtering>;
    let filtering;
    let element;

    const initialize = () => {
        filtering.filterFields =  [
            { field: 'fullName',  label: 'Name' },
            { field: 'email',     label: 'Email' },
            { field: 'userName',  label: 'Username' }
        ];
        fixture.detectChanges();
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations:   [ Filtering ]
        });

        fixture = TestBed.createComponent(Filtering);
        filtering = fixture.componentInstance;
        element = fixture.nativeElement;
        initialize();
    });

    it('should initialize element', () => {
        expect(filtering.filteredBy).toBeDefined();
        expect(filtering.filteredBy.label).toBe('All');
        expect(filtering.filteredBy.field).toBe('');
    });

    it('should filter by another property', () => {
        jasmine.clock().uninstall();
        jasmine.clock().install();
        spyOn(filtering.emitFilter, 'emit');
        filtering.filterBy(filtering.filterFields[1]);
        expect(filtering.emitFilter.emit.calls.count()).toBe(0);
        filtering.filter('atext');
        jasmine.clock().tick(601);
        expect(filtering.emitFilter.emit.calls.count()).toBe(1);
        expect(filtering.emitFilter.emit).toHaveBeenCalledWith({filterBy: 'email', filterText: 'atext'});
        filtering.filterBy(filtering.allField, 'atext');
        expect(filtering.emitFilter.emit.calls.count()).toBe(2);
        expect(filtering.emitFilter.emit).toHaveBeenCalledWith({filterBy: '', filterText: 'atext'});
        jasmine.clock().uninstall();
    });
});
