import {
    ComponentFixture,
    TestBed
}                   from '@angular/core/testing';

import { Modal }    from './modal';

declare const beforeEach, describe, expect, it, jasmine, spyOn;

describe('Component: Modal', () => {
    let fixture: ComponentFixture<Modal>;
    let modal;
    let element;

    const initialize = () => {
        modal.title = 'Delete Developer';
        modal.submitLabel = 'Delete';
        modal.modalClass = 'myClass';
        fixture.detectChanges();
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations:   [ Modal ]
        });

        fixture = TestBed.createComponent(Modal);
        modal = fixture.componentInstance;
        element = fixture.nativeElement;
        initialize();
    });

    it('should initialize element', () => {
        expect(modal).toBeDefined();
        expect(modal.isOpened).toBe(false);
        expect(modal.backdropElement).toBeDefined();
        expect(modal.backdropElement.parentElement).toBeFalsy();
        expect(element.getElementsByClassName('myClass').length).toBe(1);
    });

    it('should open element', () => {
        modal.open();
        expect(modal.isOpened).toBe(true);
        expect(modal.backdropElement.parentElement).toBeTruthy();
    });

    it('should close on cancel emitting false', () => {
        spyOn(modal.emitSubmit, 'emit');
        modal.open();
        expect(modal.isOpened).toBe(true);
        modal.close(false);
        expect(modal.isOpened).toBe(false);
        expect(modal.backdropElement.parentElement).toBeFalsy();
        expect(modal.emitSubmit.emit).toHaveBeenCalled();
        expect(modal.emitSubmit.emit.calls.argsFor(0)[0]).toBe(false);
    });

    it('should close on confirm emitting true', () => {
        spyOn(modal.emitSubmit, 'emit');
        modal.open();
        expect(modal.isOpened).toBe(true);
        modal.close(true);
        expect(modal.isOpened).toBe(false);
        expect(modal.backdropElement.parentElement).toBeFalsy();
        expect(modal.emitSubmit.emit).toHaveBeenCalled();
        expect(modal.emitSubmit.emit.calls.argsFor(0)[0]).toBe(true);
    });
});
