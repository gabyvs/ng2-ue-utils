import {
    async,
    beforeEach,
    beforeEachProviders,
    inject
} from '@angular/core/testing';
import {ComponentFixture, TestComponentBuilder} from '@angular/compiler/testing';
import {Pagination} from './pagination';

describe('Component: Pagination', () => {
    let fixture: ComponentFixture<Pagination>;
    let pagination;
    let element;

    beforeEachProviders(() => [
        TestComponentBuilder
    ]);

    beforeEach(async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb
            .createAsync(Pagination)
            .then((f: ComponentFixture<Pagination>) => {
                fixture = f;
                pagination = f.componentInstance;
                element = f.nativeElement;
            });
    })));

    it('should initialize element', () => {
        expect(pagination.pageSize).toBe(25);
        expect(pagination.settings).toBeUndefined();
        pagination.settings = { count: 7, filteredCount: 7, from: 0, to: 25 };
        fixture.detectChanges();
        expect(pagination.settings).toBeDefined();
    });

    it('should move forward', () => {
        spyOn(pagination.emitPaginate, 'emit');
        pagination.settings = { count: 27, filteredCount: 27, from: 0, to: 25 };
        fixture.detectChanges();
        pagination.forward();
        expect(pagination.emitPaginate.emit.calls.count()).toBe(1);
        expect(pagination.emitPaginate.emit.calls.argsFor(0)[0]).toEqual({ from: 25, to: 27 });
    });

    it('should move backward', () => {
        spyOn(pagination.emitPaginate, 'emit');
        pagination.settings = { count: 27, filteredCount: 27, from: 25, to: 27 };
        fixture.detectChanges();
        pagination.backward();
        expect(pagination.emitPaginate.emit.calls.count()).toBe(1);
        expect(pagination.emitPaginate.emit.calls.argsFor(0)[0]).toEqual({ from: 0, to: 25 });
    });
});
