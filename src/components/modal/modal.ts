import {Component, Input, OnInit, Output, EventEmitter, ElementRef, ViewChild} from '@angular/core';

/**
 * This simple modal presents users with some customizable content and a binary decision (submit/cancel).
 * 
 * @input This component takes the modal title, the submit button label, and a class name (for use in integration testing) as inputs.
 * Any html you place between the opening and closeing <modal> tags will be inserted into the modal body.
 * 
 * @output When the user closes the modal by clicking either `submit` or `cancel`, the `emitSubmit` event is emitted with a
 * with an argument, `true` for submit and `false` for cancel.
 * 
 * It may be helpful to declare a local var on the component in order to make it available to be opened elsewhere in
 * the page, as demonstrated below.
 *
 * ### Simple Example
 *
 * ```
 *  <modal #myModal
 *      title="Do my thing?"
 *      submitLabel="submitMyModal"
 *      (emitSubmit)="resolveModal($event)">
 *      <modal-content>
 *          <p>Are you sure you want to do my thing?</p>
 *      </modal-content>
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
    
    @Input() public modalClass: string = '';

    @Input() public title: string;

    @Input() public submitLabel: string;

    @Output() public emitSubmit = new EventEmitter();

    @ViewChild('modal') private modal: ElementRef;

    private combinedModalClass: string;
    private isOpened = false;
    private backdropElement: HTMLElement;

    public ngOnInit() {
        this.createBackDrop();
        this.combinedModalClass = this.modalClass ? 'modal-dialog ' + this.modalClass : 'modal-dialog';
    }

    public open() {
        this.isOpened = true;
        document.body.appendChild(this.backdropElement);
        setTimeout(() => this.modal.nativeElement.focus(), 0);
    }

    public close(...args: any[]) {
        this.isOpened = false;
        if (this.backdropElement.parentElement) {
            document.body.removeChild(this.backdropElement);
            this.emitSubmit.emit(args[0]);
        }
    }

    private createBackDrop() {
        this.backdropElement = document.createElement('div');
        this.backdropElement.classList.add('fade', 'in', 'modal-backdrop');
    }
}
