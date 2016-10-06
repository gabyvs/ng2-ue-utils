import { addProviders, async, inject } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing/component_fixture';
import { TestComponentBuilder } from '@angular/core/testing/test_component_builder';
import { ValueHandler } from './value-handler';

declare const beforeEach, describe, expect, it, jasmine, spyOn;

describe('Component: ValueHandler', () => {
    let fixture: ComponentFixture<ValueHandler>;
    let valueHandler;
    let element;

    let initialize = () => {
        valueHandler.original = 'Nikolai';
        valueHandler.property = 'firstName';
        fixture.detectChanges();
    };

    beforeEach(() => {
        addProviders([
            TestComponentBuilder
        ]);
    });

    beforeEach(async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb
            .createAsync(ValueHandler)
            .then((f: ComponentFixture<ValueHandler>) => {
                fixture = f;
                valueHandler = f.componentInstance;
                element = f.nativeElement;
                initialize();
            });
    })));

    it('should initialize element', () => {
        expect(valueHandler.editing).toBe(false);
        expect(valueHandler.value).toBe('Nikolai');
        const span = fixture.nativeElement.querySelector('span');
        const input = fixture.nativeElement.querySelector('input');
        expect(span).toBeTruthy();
        expect(input).toBeFalsy();
    });

    it('should show input on click', () => {
        let span = fixture.nativeElement.querySelector('span');
        span.click();
        expect(valueHandler.editing).toBe(true);
        fixture.detectChanges();
        span = fixture.nativeElement.querySelector('span');
        const input = fixture.nativeElement.querySelector('input');
        expect(span).toBeFalsy();
        expect(input).toBeTruthy();
        expect(input.value).toBe('Nikolai');
    });

    it('should set invalid if field is required and value is not provided', function () {
        jasmine.clock().uninstall();
        jasmine.clock().install();
        valueHandler.required = true;
        fixture.detectChanges();
        let span = fixture.nativeElement.querySelector('span');
        expect(valueHandler.invalid).toBe(false);
        span.click();
        spyOn(valueHandler.emitChange, 'emit').and.callThrough();
        spyOn(valueHandler, 'save').and.callThrough();
        valueHandler.save('');
        expect(valueHandler.save).toHaveBeenCalled();
        expect(valueHandler.invalid).toBe(true);
        expect(valueHandler.editing).toBe(true);
        expect(valueHandler.saving).toBe(false);
        expect(valueHandler.emitChange.emit.calls.any()).toEqual(false);
        jasmine.clock().tick(1501);
        expect(valueHandler.invalid).toBe(false);
        jasmine.clock().uninstall();
    });

    it('should not emit changes if the value did not change', () => {
        expect(valueHandler.editing).toBe(false);
        let span = fixture.nativeElement.querySelector('span');
        span.click();
        expect(valueHandler.editing).toBe(true);
        spyOn(valueHandler.emitChange, 'emit').and.callThrough();
        spyOn(valueHandler, 'save').and.callThrough();
        valueHandler.save('Nikolai');
        expect(valueHandler.save).toHaveBeenCalled();
        expect(valueHandler.editing).toBe(false);
        expect(valueHandler.emitChange.emit.calls.any()).toEqual(false);
    });

    it('should emit changes if the value changed', () => {
        expect(valueHandler.editing).toBe(false);
        let span = fixture.nativeElement.querySelector('span');
        span.click();
        expect(valueHandler.editing).toBe(true);
        expect(valueHandler.saving).toBe(false);
        spyOn(valueHandler.emitChange, 'emit').and.callThrough();
        spyOn(valueHandler, 'save').and.callThrough();
        valueHandler.save('Lucy');
        expect(valueHandler.save).toHaveBeenCalled();
        expect(valueHandler.editing).toBe(true);
        expect(valueHandler.saving).toBe(true);
        expect(valueHandler.emitChange.emit.calls.any()).toEqual(true);
    });

    it('Should create and return a new subject on each save', (done) => {
        let firstChange, secondChange;
        valueHandler.emitChange.subscribe((value) => {
            if (firstChange) {
                secondChange = value;
                expect(secondChange.subject).toBeDefined();
                expect(firstChange.subject).not.toBe(secondChange.subject);
                expect(firstChange.subject.observers.length).toBe(1);
                expect(secondChange.subject.observers.length).toBe(1);
                secondChange.subject.next({});
                expect(secondChange.subject.observers.length).toBe(0);
                expect(firstChange.subject.observers.length).toBe(1);
                firstChange.subject.next({});
                expect(firstChange.subject.observers.length).toBe(0);
                done();
            } else {
                firstChange = value;
                expect(firstChange.subject).toBeDefined();
            }
        });
        valueHandler.save('Name');
        valueHandler.save('Surname');
    });

    it('Should show success styles if saving successful', (done) => {
        jasmine.clock().uninstall();
        jasmine.clock().install();
        let span = fixture.nativeElement.querySelector('span');
        span.click();
        valueHandler.emitChange.subscribe((value) => {
            value.subject.next({});
            valueHandler.original = 'Lucy';
            fixture.detectChanges();
            expect(valueHandler.saving).toBe(false);
            expect(valueHandler.editing).toBe(false);
            expect(valueHandler.success).toBe(true);
            expect(valueHandler.value).toBe('Lucy');
            jasmine.clock().tick(201);
            expect(valueHandler.success).toBe(false);
            jasmine.clock().uninstall();
            done();
        });
        valueHandler.save('Lucy');
    });

    it('Should show error styles if saving not successful', (done) => {
        jasmine.clock().uninstall();
        jasmine.clock().install();
        let span = fixture.nativeElement.querySelector('span');
        span.click();
        fixture.detectChanges();
        valueHandler.emitChange.subscribe((value) => {
            value.subject.error({});
            expect(valueHandler.saving).toBe(false);
            expect(valueHandler.editing).toBe(true);
            expect(valueHandler.success).toBe(false);
            expect(valueHandler.error).toBe(true);
            expect(valueHandler.value).toBe('Lucy');
            jasmine.clock().tick(201);
            expect(valueHandler.error).toBe(false);
            jasmine.clock().uninstall();
            done();
        });
        valueHandler.save('Lucy');
    });
});
