import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ModalBase } from '../modal-base/modal-base';

/**
 * This is a modal implementation built around the ModalBase component included in this library.  You can pass in its
 * content and receive a boolean event, `modalResult`, to know whether the user submitted or cancelled the modal action.
 * 
 * **IMPORTANT** The body of the modal is included via html transclude.
 *
 * @input title: string
 *   This is the modal title text
 *
 * @input cancelLabel: string *OPTIONAL
 *   This is the modal 'cancel' button's text
 *   Defaults to 'Cancel'
 *   
 * @input submitLabel: string *OPTIONAL
 *   This is the modal 'cancel' button's text
 *   Defaults to 'Submit'
 *   
 * @input modalClass: string *OPTIONAL
 *   This string is a space-separated list of css classnames to be applied to the modal
 *   Defaults to empty string
 *
 * @output emitSubmit: EventEmitter<boolean>
 *   This emitter emits a boolean which indicates whether the user submitted by clicking on the 'submit' button, or 
 *   cancelled by closing the modal by any other means (any click which was not on the 'submit' button, 'esc' keyup).
 *
 * ### Simple Example
 *
 * ```
 *  <modal
 *      title="Do something?"
 *      cancelLabel="Don't do it"
 *      submitLabel="Do it"
 *      (emitSubmit)="emitHandler($event)">
 *      
 *      ** Anything in here is transcluded into the modal body **
 *      <p>This is the modal body</p>
 *  </modal>
 * ```
 *
 */

declare const require: any;
const styles = require('!!css-loader!less-loader!./modal.less').toString();

@Component({
    selector: 'modal',
    styles: [ styles.toString() ],
    template: require('./modal.html')
})
export class Modal {
    
    private submitted: boolean = false;
    @ViewChild(ModalBase) private modal: ModalBase;
    
    @Output() public emitSubmit: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() public title: string = '';
    @Input() public cancelLabel: string = 'Cancel';
    @Input() public submitLabel: string = 'Submit';
    @Input() public modalClass: string = '';

    public modalSubmit(): void {
        this.submitted = true;
        this.close();
    }
    
    public emit(): void {
        this.emitSubmit.emit(this.submitted);
        this.submitted = false;
    }
    
    public open(): void {
        this.modal.open();
    }

    public close(): void {
        this.modal.close();
    }
}
