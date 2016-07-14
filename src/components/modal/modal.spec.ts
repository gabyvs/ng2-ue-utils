import {
    async,
    beforeEach,
    beforeEachProviders,
    inject
} from '@angular/core/testing';
import {ComponentFixture, TestComponentBuilder} from '@angular/compiler/testing';
import {Modal} from './modal';

describe('Component: Modal', () => {
    let fixture: ComponentFixture<Modal>;
    let modal;
    let element;

    let initialize = () => {
        modal.title = 'Delete Developer';
        modal.submitLabel = 'Delete';
        modal.modalClass = 'myClass';
        modal.ngOnInit();
        fixture.detectChanges();
    };

    beforeEachProviders(() => [
        TestComponentBuilder
    ]);

    beforeEach(async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb
            .createAsync(Modal)
            .then((f: ComponentFixture<Modal>) => {
                fixture = f;
                modal = f.componentInstance;
                element = f.nativeElement;
                initialize();
            });
    })));

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
