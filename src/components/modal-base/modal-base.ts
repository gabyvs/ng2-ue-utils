import { Component, OnInit, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';

/**
 * This simple modal emits an event when the modal closes. Its content is defined by consumers in one transclude element, as
 * demonstrated in the sample below and the demo application.
 *
 * If you would like a modal which emits the result of the user's action (submit/cancel), you may be interested in
 * the Modal included in this library.
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
 * <ue-modal-base #myBaseModal (emitClose)="baseModalClose()">
 *      <div class="modal-header">
 *          <button type="button" class="close" data-dismiss="modal" aria-label="Close" (click)="myBaseModal.close()">
 *              <span aria-hidden="true">&times;</span>
 *          </button>
 *          <h4 class="modal-title">Do a thing?</h4>
 *      </div>
 *      <div class="modal-body">
 *      <p>Are you sure you want to do this thing?  This thing cannot be undone.  Oh, the shame...</p>
 *      <p>You could potentially
 *          <a href="https://github.com/gabyvs/ng2-ue-utils" target="_blank"> go to github</a>
 *          or copy this link: <span class="alink">https://github.com/gabyvs/ng2-ue-utils</span></p>
 *      </div>
 *      <div class="modal-footer">
 *          <button (click)="myBaseModal.close()" class="btn btn-default">Not at all, dude</button>
 *          <button (click)="baseModalSubmit(myBaseModal)" class="btn btn-primary">Yeah, totally!</button>
 *      </div>
 *  </ue-modal-base>
 *
 *  <div class="elsewhereOnThePage">
 *      <button (click)="myBaseModal.open()">Open modal</button>
 *  </div>
 * ```
 */

declare const require: any;
@Component({
    selector: 'ue-modal-base',
    template: require('./modal-base.html')
})
export class ModalBase implements OnInit {

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

    /* tslint:disable:no-unused-variable */
    private prevent(event) {
        event.stopPropagation();
    }
    /* tslint:enable:no-unused-variable */

    public open(): void {
        this.isOpened = true;
        document.body.appendChild(this.backdropElement);
        document.body.classList.add('modal-open');
        setTimeout(() => this.modal.nativeElement.focus());
    }

    public close() {
        if (!this.isOpened) { return; }
        this.isOpened = false;
        const backdropAttached: boolean = !!this.backdropElement.parentElement;
        if (backdropAttached) { document.body.removeChild(this.backdropElement); }
        document.body.classList.remove('modal-open');
        this.emitClose.emit();
    }

    private createBackDrop() {
        this.backdropElement = document.createElement('div');
        this.backdropElement.classList.add('fade', 'in', 'modal-backdrop');
    }
}
