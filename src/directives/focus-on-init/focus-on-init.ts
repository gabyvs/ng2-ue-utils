import {Directive, ElementRef, OnInit} from '@angular/core';

@Directive({
    selector: '[focusOnInit]'
})
export class FocusOnInit implements OnInit {

    constructor(private elementRef: ElementRef) {}

    public ngOnInit() {
        this.elementRef.nativeElement.focus();
    }
}
