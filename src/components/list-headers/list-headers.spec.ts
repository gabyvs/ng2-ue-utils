import { ComponentFixture, TestComponentBuilder } from '@angular/compiler/testing';
import { addProviders, async, inject } from '@angular/core/testing';

import { ListHeaders } from './list-headers';

describe('Component: ListHeaders', () => {
    let fixture: ComponentFixture<ListHeaders>;
    let listHeaders;
    let element;

    let initialize = () => {
        listHeaders.headers = [
            { label: 'display name',    property: 'displayName',    styles: { width: '23%' } },
            { label: 'description',     property: 'description',    sortOnInit: 'desc',    styles: { width: '54%' } },
            { label: 'modified',        property: 'lastModifiedAt', styles: { width: '23%' } }
        ];
        listHeaders.ngOnInit();
        fixture.detectChanges();
    };

    beforeEach(() => {
        addProviders([
            TestComponentBuilder
        ]);
    });

    beforeEach(async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb
            .createAsync(ListHeaders)
            .then((f: ComponentFixture<ListHeaders>) => {
                fixture = f;
                listHeaders = f.componentInstance;
                element = f.nativeElement;
                initialize();
            });
    })));

    it('should render headers', () => {
        expect(element.querySelectorAll('div').length).toBe(3);
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
