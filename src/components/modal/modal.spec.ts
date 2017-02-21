import {
    ComponentFixture,
    TestBed
}                   from '@angular/core/testing';

import { Modal } from './modal';
import { ModalBase } from '../modal-base/modal-base';

declare const beforeEach, describe, expect, it, jasmine, spyOn;

describe('Component: Binary Choice Modal', () => {
    let fixture: ComponentFixture<Modal>;
    let modal;
    let baseModal;
    let element;

    const initialize = () => {
        modal.title = 'Delete Developer';
        modal.cancelLabel = 'Not right now';
        modal.submitLabel = 'Do it!';
        modal.modalClass = 'myClass myOtherClass';
        fixture.detectChanges();
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations:   [ Modal, ModalBase ]
        });

        fixture = TestBed.createComponent(Modal);
        modal = fixture.componentInstance;
        element = fixture.nativeElement;
        baseModal = modal.modal;
        initialize();
    });

    it('should initialize element', () => {
        let baseModalEl: HTMLElement = baseModal.modal.nativeElement;
        expect(modal).toBeDefined();
        expect(baseModal.isOpened).toBe(false);
        expect(baseModal.backdropElement).toBeDefined();
        expect(baseModal.backdropElement.parentElement).toBeFalsy();
        expect(baseModalEl.getElementsByClassName('myClass').length).toBe(1);
        expect(baseModalEl.getElementsByClassName('myOtherClass').length).toBe(1);
        baseModal.isOpened = true;
        fixture.detectChanges();
        baseModalEl = baseModal.modal.nativeElement;
        const title = baseModalEl.getElementsByClassName('modal-title')[0].children[0];
        const footerButtons = baseModalEl.getElementsByClassName('modal-footer')[0].children[0];
        expect(title.innerHTML).toBe('Delete Developer');
        expect(footerButtons.children[0].innerHTML).toBe('Not right now');
        expect(footerButtons.children[1].innerHTML).toBe('Do it!');
    });

    it('should open element', () => {
        modal.open();
        expect(baseModal.isOpened).toBe(true);
        expect(baseModal.backdropElement.parentElement).toBeTruthy();
    });

    it('should emit and close properly when user cancels', () => {
        const closeSpy = spyOn(modal.emitSubmit, 'emit');
        modal.open();
        expect(baseModal.isOpened).toBe(true);
        baseModal.close();
        expect(baseModal.isOpened).toBe(false);
        expect(baseModal.backdropElement.parentElement).toBeFalsy();
        expect(closeSpy).toHaveBeenCalled();
        expect(closeSpy).toHaveBeenCalledWith(false);
        expect(modal.submitted).toBe(false);
    });

    it('should emit and close properly when user submits', () => {
        const closeSpy = spyOn(modal.emitSubmit, 'emit');
        modal.open();
        expect(baseModal.isOpened).toBe(true);
        modal.modalSubmit();
        expect(modal.submitted).toBe(true);
        baseModal.close();
        expect(baseModal.isOpened).toBe(false);
        expect(baseModal.backdropElement.parentElement).toBeFalsy();
        expect(closeSpy).toHaveBeenCalled();
        expect(closeSpy).toHaveBeenCalledWith(true);
        expect(modal.submitted).toBe(false);
    });
});
