import {
    ComponentFixture,
    TestBed
}                   from '@angular/core/testing';

import { BinaryChoiceModal } from './binary-choice-modal';
import { Modal } from '../modal/modal';

declare const beforeEach, describe, expect, it, jasmine, spyOn;

describe('Component: Binary Choice Modal', () => {
    let fixture: ComponentFixture<BinaryChoiceModal>;
    let binaryChoiceModal;
    let baseModal;
    let element;

    const initialize = () => {
        binaryChoiceModal.titleText = 'Delete Developer';
        binaryChoiceModal.bodyText = 'Do you want to delete a developer?';
        binaryChoiceModal.cancelText = 'Not right now';
        binaryChoiceModal.submitText = 'Do it!';
        binaryChoiceModal.modalClass = 'myClass myOtherClass';
        fixture.detectChanges();
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations:   [ BinaryChoiceModal, Modal ]
        });

        fixture = TestBed.createComponent(BinaryChoiceModal);
        binaryChoiceModal = fixture.componentInstance;
        element = fixture.nativeElement;
        baseModal = binaryChoiceModal.modal;
        initialize();
    });

    it('should initialize element', () => {
        expect(binaryChoiceModal).toBeDefined();
        expect(baseModal.isOpened).toBe(false);
        expect(baseModal.backdropElement).toBeDefined();
        expect(baseModal.backdropElement.parentElement).toBeFalsy();
        expect(baseModal.modal.nativeElement.getElementsByClassName('myClass').length).toBe(1);
        expect(baseModal.modal.nativeElement.getElementsByClassName('myOtherClass').length).toBe(1);
    });

    it('should open element', () => {
        binaryChoiceModal.open();
        expect(baseModal.isOpened).toBe(true);
        expect(baseModal.backdropElement.parentElement).toBeTruthy();
    });

    it('should emit and close properly when user cancels', () => {
        const closeSpy = spyOn(binaryChoiceModal.modalResult, 'emit');
        binaryChoiceModal.open();
        expect(baseModal.isOpened).toBe(true);
        baseModal.close();
        expect(baseModal.isOpened).toBe(false);
        expect(baseModal.backdropElement.parentElement).toBeFalsy();
        expect(closeSpy).toHaveBeenCalled();
        expect(closeSpy).toHaveBeenCalledWith(false);
        expect(binaryChoiceModal.submitted).toBe(false);
    });

    it('should emit and close properly when user submits', () => {
        const closeSpy = spyOn(binaryChoiceModal.modalResult, 'emit');
        binaryChoiceModal.open();
        expect(baseModal.isOpened).toBe(true);
        binaryChoiceModal.modalSubmit();
        expect(binaryChoiceModal.submitted).toBe(true);
        baseModal.close();
        expect(baseModal.isOpened).toBe(false);
        expect(baseModal.backdropElement.parentElement).toBeFalsy();
        expect(closeSpy).toHaveBeenCalled();
        expect(closeSpy).toHaveBeenCalledWith(true);
        expect(binaryChoiceModal.submitted).toBe(false);
    });
});
