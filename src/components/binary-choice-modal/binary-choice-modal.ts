import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Modal } from '../modal/modal';

/**
 * This is a binary choice modal implementation built around the Modal included in this library.  You can pass in its
 * content and receive a boolean event, `modalResult`, to know whether the user submitted or cancelled the modal action.
 *
 * @input titleText: string
 *   This is the modal title text
 *   
 * @input bodyText: string
 *   This is the modal body text
 *   
 * @input cancelText: string *OPTIONAL
 *   This is the modal 'cancel' button's text
 *   Defaults to 'Cancel'
 *   
 * @input submitText: string *OPTIONAL
 *   This is the modal 'cancel' button's text
 *   Defaults to 'Submit'
 *   
 * @input modalClass: string *OPTIONAL
 *   This string is a space-separated list of css classnames to be applied to the modal
 *   Defaults to empty string
 *
 * @output modalResult: boolean
 *   This boolean event indicates whether the user submitted by clicking on the 'submit' button, or cancelled by closing
 *   the modal by any other means (any click which was not on the 'submit' button, 'esc' keyup).
 *
 * ### Simple Example
 *
 * ```
 *  <binary-choice-modal #myBinaryChoiceModal
 *      titleText="Do something?"
 *      bodyText="Do it or don't do it?"
 *      cancelText="Don't do it"
 *      confirmText="Do it"
 *      (modalResult)="binaryChoiceModalHandler($event)">
 *  </binary-choice-modal>
 * ```
 *
 */

declare const require: any;

@Component({
    selector: 'binary-choice-modal',
    template: require('./binary-choice-modal.html')
})
export class BinaryChoiceModal {
    
    private submitted: boolean = false;
    @ViewChild(Modal) private modal: Modal;
    
    @Output() public modalResult: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() public titleText: string = '';
    @Input() public bodyText: string = '';
    @Input() public cancelText: string = 'Cancel';
    @Input() public confirmText: string = 'Submit';
    @Input() public modalClass: string = '';

    public modalSubmit(): void {
        this.submitted = true;
    }
    
    public emitResult(): void {
        this.modalResult.emit(this.submitted);
        this.submitted = false;
    }
    
    public open(): void {
        this.modal.open();
    }
}
