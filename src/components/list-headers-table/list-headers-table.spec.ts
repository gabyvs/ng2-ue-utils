import {
    ComponentFixture,
    TestBed
}                       from '@angular/core/testing';

import { ListHeadersTable }  from './list-headers-table';

declare const beforeEach, describe, expect, it;

describe('Component: ListHeadersTable', () => {
    let fixture: ComponentFixture<ListHeadersTable>;
    let listHeaders;
    let element;

    const initialize = () => {
        listHeaders.headers = [
            { label: 'display name',    property: 'displayName',    styles: { width: '23%' } },
            { label: 'description',     property: 'description',    sortOnInit: 'desc',    styles: { width: '54%' } },
            { label: 'modified',        property: 'lastModifiedAt', styles: { width: '23%' } }
        ];
        fixture.detectChanges();
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations:   [ ListHeadersTable ]
        });

        fixture = TestBed.createComponent(ListHeadersTable);
        listHeaders = fixture.componentInstance;
        element = fixture.nativeElement;
        initialize();
    });

    it('should render headers', () => {
        expect(element.querySelectorAll('th').length).toBe(3);
    });

    it('should emit on sorting', (done) => {
        expect(listHeaders.sortedBy).toBe('description');
        expect(listHeaders.ascOrder).toBe(false);
        listHeaders.emitSort.subscribe((x) => {
            expect(x.order).toBe('asc');
            expect(x.sortBy).toBe('description');
            done();
        });
        listHeaders.sort('description');
    });

    it('should sort descending if same category is chosen', (done) => {
        let subscription1: any = listHeaders.emitSort.subscribe((x) => {
            expect(x.order).toBe('asc');
            expect(x.sortBy).toBe('displayName');
            done();
        });
        listHeaders.sort('displayName');
        subscription1.unsubscribe();
        listHeaders.emitSort.subscribe((x) => {
            expect(x.order).toBe('desc');
            expect(x.sortBy).toBe('displayName');
            done();
        });
    });
});
