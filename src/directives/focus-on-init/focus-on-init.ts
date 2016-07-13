import {Directive, ElementRef, OnInit} from '@angular/core';

/**
 * A simple directive which provides focus to its host element upon execution of its `ngOnInit` lifecycle hook.
 *
 * ### Simple Example
 *
 * ```
 * <input type="text" focusOnInit>
 * ```
 *
 */

@Directive({
    selector: '[focusOnInit]'
})
export class FocusOnInit implements OnInit {

    constructor(private elementRef: ElementRef) {}

    public ngOnInit() {
        this.elementRef.nativeElement.focus();
    }
}
