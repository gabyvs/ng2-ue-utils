import { addProviders, async, beforeEach, inject } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing/component_fixture';
import { TestComponentBuilder } from '@angular/core/testing/test_component_builder';
import { Filtering } from './filtering';

describe('Component: Filtering', () => {
    let fixture: ComponentFixture<Filtering>;
    let filtering;
    let element;

    beforeEach(() => {
        addProviders([
            TestComponentBuilder
        ]);
    });

    beforeEach(async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb
            .createAsync(Filtering)
            .then((f: ComponentFixture<Filtering>) => {
                fixture = f;
                filtering = f.componentInstance;
                element = f.nativeElement;
                filtering.filterFields =  [
                    { field: 'fullName',  label: 'Name' },
                    { field: 'email',     label: 'Email' },
                    { field: 'userName',  label: 'Username' }
                ];
            });
    })));

    it('should initialize element', () => {
        expect(filtering.filteredBy).toBeDefined();
        expect(filtering.filteredBy.label).toBe('All');
        expect(filtering.filteredBy.field).toBe('');
    });

    it('should filter by another property', () => {
        jasmine.clock().uninstall();
        jasmine.clock().install();
        spyOn(filtering.emitFilter, 'emit');
        filtering.ngOnInit();
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
