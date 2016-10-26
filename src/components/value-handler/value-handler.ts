import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

/**
 * This component transitions from a span to an input on click events, allowing the user to adjust it's value.  Once in
 * edit mode, a new value can be saved by pressing `enter` or `tab`, or the update can be cancelled on 'blur'. You
 * can optionally pass in validation logic.
 *
 * @input value: string
 * do we need this as an input?
 *
 * @input property: string
 * the label/name of the value represented by this component.
 *
 * @input optional: boolean
 * determines whether or not `value` is required when user attempts to update.
 *
 * @input original: string
 * original value of the component. `value` will reset to this on cancel (blur).
 *
 * @input validation: ValueHandler.ValidationRule
 * an object containing an input validator function and an invalid input message.
 *
 * @input place: string
 * specifies placement of the component tooltip, defaults to 'top'.
 *
 * @output emitChange:
 * emits event `emitChange` with payload: `{ property: this.property, subject: observer, value: value }`.  After
 * performing whatever write operation you need to make in your higher component, call `subject.next()` on success or
 * `subject.error()` on failure to set proper state on this component.
 *
 * ### Simple Example
 *
 * ```
 * <value-handler [property]="vhAttribute.name" [original]="vhAttribute.value"
 * (emitChange)="vhEditAttribute($event)"></value-handler>
 * ```
 */

declare const require: any;
const styles: any = require('!!css-loader!less-loader!./value-handler.less');

@Component({
    selector: 'value-handler',
    styles: [styles.toString()],
    template: `
        <span class="property" [tooltip]="value" (click)="startEditing()" tooltipPlacement="{{tooltipPlace}}"
            #propertySpan [tooltipEnable]="enableTooltip"
            *ngIf="!editing" [ngClass]="{ 'success': success, 'error': error }">{{value}}</span>
        <input class="form-control" #propertyInput focusOnInit
            type="text"
            *ngIf="editing"
            [disabled]="saving"
            [required]="required"
            (keyup)="validate(propertyInput.value)"
            (keyup.enter)="save(propertyInput.value)"
            (keydown.tab)="onTab(propertyInput.value, $event)"
            (keyup.esc)="cancel()"
            (blur)="cancel()"
            [ngClass]="{ 'error': error }"
            [ngModel]="value"/>
        <div *ngIf="invalid" class="alert alert-danger">{{ invalidMessage }}</div>
    `
})
export class ValueHandler implements AfterViewInit {
    private _original: string;
    private _validateFn: Function;

    private required: boolean = true;

    private enableTooltip: boolean = true;

    private invalidMessage: string = 'This value is required';

    private inputValueStream = new Subject<string>();

    private editing: boolean = false;
    private saving: boolean = false;
    private success: boolean = false;
    private error: boolean = false;
    private invalid: boolean = false;
    private tooltipPlace = 'top';

    @Input() private value: string;
    @Input() public property: string;

    @Input() public set optional (value: boolean) {
        if (value) {
            this.required = false;
        }
    }

    @Input() public set original(value: string) {
        this._original = value;
        if (!this.editing) {
            this.value = value;
        }
    }

    @Input() public set validation (validationRule: ValueHandler.IValidationRule) {
        this._validateFn = validationRule.fn;
        this.invalidMessage = validationRule.message;
    }

    @Input() public set place(place: string) {
        if (!place) { return; }
        this.tooltipPlace = place;
    }

    @Output() public emitChange = new EventEmitter();

    @ViewChild('propertyInput') private input: ElementRef;
    @ViewChild('propertySpan') private span: ElementRef;

    public validate (value: string) {
        this.inputValueStream.next(value);
    }

    public startEditing (): void {
        this.editing = true;
    }

    private onError () {
        this.saving = false;
        this.error = true;
        this.input.nativeElement.focus();
        setTimeout(() => {
            this.error = false;
            this.input.nativeElement.focus();
        }, 200);
    }

    private onSuccess () {
        this.saving = false;
        this.success = true;
        this.editing = false;
        setTimeout(() => {
            this.success = false;
            this.verifyTooltipVisibility();
        }, 200);
    }

    public save = (value: string) => {
        if (this.invalid) {
            return;
        }
        if (this.required && !value) {
            this.invalid = true;
            setTimeout(() => {
                this.invalid = false;
            }, 1500);
            return;
        }
        value = value.trim();
        if (value === this.value) {
            this.editing = false;
            return;
        }
        this.value = value;
        this.saving = true;
        let observer = new Subject<any>();
        let subscription = observer.subscribe(() => {
            this.onSuccess();
            subscription.unsubscribe();
        }, () => {
            this.onError();
            subscription.unsubscribe();
        });

        this.emitChange.emit({ property: this.property, subject: observer, value: value });
    }

    public onTab (value: string, event) {
        event.preventDefault();
        this.save(value);
    }

    public cancel () {
        this.invalid = false;
        if (!this.saving) {
            this.value = this._original;
            this.editing = false;
        }
    }

    private verifyTooltipVisibility () {
        if (!this.span) { return; }
        if (this.span.nativeElement.offsetWidth && this.span.nativeElement.scrollWidth) {
            this.enableTooltip = this.span.nativeElement.offsetWidth <= this.span.nativeElement.scrollWidth;
        } else {
            this.enableTooltip = true;
        }
    }

    public ngAfterViewInit () {
        setTimeout(() => {
            this.verifyTooltipVisibility();
        });
        this.inputValueStream
            .debounceTime(300)
            .distinctUntilChanged()
            .subscribe(term => {
                if (this._validateFn) {
                    this.invalid = this.error = !this._validateFn(term);
                }
            });
    }
}

export namespace ValueHandler {
    'use strict';

    export interface IValidationRule { fn: Function; message: string;  }
    export interface IEvent {
        property: string;
        subject: Subject<any>;
        value: string;
    }
}
