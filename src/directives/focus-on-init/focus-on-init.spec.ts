import {Component} from '@angular/core';
import {
    beforeEach,
    beforeEachProviders,
    describe,
    expect,
    it,
    inject,
    async
} from '@angular/core/testing';
import {ComponentFixture, TestComponentBuilder} from '@angular/compiler/testing';
import {FocusOnInit} from './focus-on-init';

@Component({
    directives: [FocusOnInit],
    selector: 'container',
    template: `<input #input focusOnInit />`
})
export class Container {}

describe('Directive: focus on init', () => {
    let fixture: ComponentFixture<Container>;
    let container;
    let element;

    beforeEachProviders(() => [
        TestComponentBuilder
    ]);

    beforeEach(async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb
            .createAsync(Container)
            .then((f: ComponentFixture<Container>) => {
                fixture = f;
                container = f.componentInstance;
                element = f.nativeElement;
            });
    })));

    it('Should focus element', () => {
        let input = fixture.nativeElement.querySelector('input');
        spyOn(input, 'focus');
        expect(input.focus).not.toHaveBeenCalled();
        fixture.detectChanges();
        expect(input.focus).toHaveBeenCalled();
    });
});
