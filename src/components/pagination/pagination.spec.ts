import { addProviders, async, inject } from '@angular/core/testing';
import { ComponentFixture, TestComponentBuilder } from '@angular/compiler/testing';
import { Pagination } from './pagination';

declare const beforeEach, describe, expect, it, spyOn;

describe('Component: Pagination', () => {
    let fixture: ComponentFixture<Pagination>;
    let pagination;
    let element;

    beforeEach(() => {
        addProviders([
            TestComponentBuilder
        ]);
    });

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
        pagination.settings = { count: 7, filteredCount: 70, from: 0, to: 25 };
        fixture.detectChanges();
        expect(pagination.settings).toBeDefined();
        expect(element.getElementsByClassName('alm-pagination-text-empty').length).toBe(0);
        expect(element.getElementsByClassName('alm-pagination-text').length).toBe(2);
        expect(element.getElementsByClassName('alm-pagination-text')[0].innerText.trim()).toBe('1 - 25 of 70');
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

    it('Pagination text should display empty message if provided', () => {
        const text = 'No elements to show';
        pagination.settings = { count: 0, filteredCount: 0, from: 0, to: 0 };
        pagination.emptyMessage = text;
        fixture.detectChanges();
        expect(element.getElementsByClassName('alm-pagination-text-empty').length).toBe(1);
        expect(element.getElementsByClassName('alm-pagination-text').length).toBe(1);
        expect(element.getElementsByClassName('alm-pagination-text')[0].innerText.trim()).toBe(text);
        pagination.settings = { count: 0, filteredCount: 5, from: 0, to: 5 };
        fixture.detectChanges();
        expect(element.getElementsByClassName('alm-pagination-text-empty').length).toBe(0);
        expect(element.getElementsByClassName('alm-pagination-text').length).toBe(2);
        expect(element.getElementsByClassName('alm-pagination-text')[0].innerText.trim()).toBe('1 - 5 of 5');
    });
});
