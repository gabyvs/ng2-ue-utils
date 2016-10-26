import { Component }    from '@angular/core';
import {
    ComponentFixture,
    TestBed
}                       from '@angular/core/testing';

import { FocusOnInit }  from './focus-on-init';

declare const beforeEach, describe, expect, it, jasmine, spyOn;

@Component({
    selector: 'container',
    template: `<input #input focusOnInit />`
})
export class Container {}

describe('Directive: focus on init', () => {
    let fixture: ComponentFixture<Container>;
    let container;
    let element;
    let input;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations:   [ Container, FocusOnInit ]
        }).compileComponents();

        fixture = TestBed.createComponent(Container);
        container = fixture.componentInstance;
        element = fixture.nativeElement;
    });

    it('Should focus element', () => {
        input = fixture.nativeElement.querySelector('input');
        spyOn(input, 'focus');
        expect(input.focus).not.toHaveBeenCalled();
        fixture.detectChanges();
        expect(input.focus).toHaveBeenCalled();
    });
});
