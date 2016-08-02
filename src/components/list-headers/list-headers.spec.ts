import { ComponentFixture, TestComponentBuilder } from '@angular/compiler/testing';
import { addProviders, async, inject } from '@angular/core/testing';

import { ListHeaders } from './list-headers';

describe('Component: ListHeaders', () => {
    let fixture: ComponentFixture<ListHeaders>;
    let listHeaders;
    let element;

    let initialize = () => {
        listHeaders.headers = [
            { label: 'name', property: 'fullName' },
            { property: 'email' },
            { property: 'userName' },
            { label: 'actions'}
        ];
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
        expect(element.querySelectorAll('div').length).toBe(4);
    });

    it('should emit on sorting', (done) => {
        listHeaders.emitSort.subscribe((x) => {
            expect(x.order).toBe('asc');
            expect(x.sortBy).toBe('email');
            done();
        });
        listHeaders.sort('email');
    });
    
    it('should sort descending if same category is chosen', (done) => {
        let subscription1: any = listHeaders.emitSort.subscribe((x) => {
            expect(x.order).toBe('asc');
            expect(x.sortBy).toBe('fullName');
            done();
        });
        listHeaders.sort('fullName');
        subscription1.unsubscribe();
        listHeaders.emitSort.subscribe((x) => {
            expect(x.order).toBe('desc');
            expect(x.sortBy).toBe('fullName');
            done();
        });
    });
});
