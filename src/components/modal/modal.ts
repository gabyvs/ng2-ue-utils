import { Component, OnInit, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';

/**
 * This simple modal emits an event when the modal closes. It's content is defined by consumers in transcludes, as
 * demonstrated in the sample below and the demo application.  Notice the `modal-title`, `modal-body`, 
 * and `modal-footer` attributes.
 * 
 * If you would like a modal which emits the result of the user's action (submit/cancel), you may be interested in
 * the Binary Choice Modal included in this library.
 *
 * @input modalClass: string *OPTIONAL
 *   This string is a space-separated list of css classnames to be applied to the modal
 *
 * @output emitClose: boolean
 *   This event emits whenever the modal is closed by any means (any click and `esc` keyup).
 *   
 * It may be helpful to declare a local var on the component in order to make it available to be opened elsewhere in
 * the page, as demonstrated below.
 *
 * ### Simple Example
 *
 * ```
 *  <modal #myModal" (emitClose)="modalCloseHandler()">
 *        <span modal-title>Do a thing?</span>
 *        <p modal-body>Are you sure you want to do this thing?  This thing cannot be undone.  Oh, the shame...</p>
 *        <div modal-footer>
 *            <button>Not at all, dude</button>
 *            <button (click)="modalSubmitHandler(myModal)">Yeah, totally!</button>
 *        </div>
 *  </modal>
 *  <div class="elsewhereOnThePage">
 *      <button (click)="openModal(myModal)">Open modal</button>
 *  </div>
 * ```
 *
 */

declare const require: any;

@Component({
    selector: 'modal',
    styles: [require('!!css-loader!less-loader!./modal.less').toString()],
    template: require('./modal.html')
})
export class Modal implements OnInit {
    
    @ViewChild('modal') private modal: ElementRef;
    @Input() public modalClass: string = '';
    @Output() public emitClose: EventEmitter<any> = new EventEmitter<any>();

    private combinedModalClass: string;
    private isOpened = false;
    private backdropElement: HTMLElement;

    public ngOnInit() {
        this.createBackDrop();
        this.combinedModalClass = this.modalClass ? 'modal-dialog ' + this.modalClass : 'modal-dialog';
    }

    public open(): void {
        this.isOpened = true;
        document.body.appendChild(this.backdropElement);
        setTimeout(() => this.modal.nativeElement.focus());
    }

    public close() {
        this.isOpened = false;
        const backdropAttached: boolean = !!this.backdropElement.parentElement;
        if (backdropAttached) { document.body.removeChild(this.backdropElement); }
        this.emitClose.emit();
    }

    private createBackDrop() {
        this.backdropElement = document.createElement('div');
        this.backdropElement.classList.add('fade', 'in', 'modal-backdrop');
    }
}
