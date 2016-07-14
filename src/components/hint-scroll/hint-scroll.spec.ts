import { addProviders, async, beforeEach, inject } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing/component_fixture';
import { TestComponentBuilder } from '@angular/core/testing/test_component_builder';

import { HintScroll } from './hint-scroll';

describe('Component: HintScroll', () => {
    let fixture: ComponentFixture<HintScroll>;
    let hintScroll;
    let element;

    let initialize = () => {
        fixture.detectChanges();
    };

    beforeEach(() => {
        addProviders([
            TestComponentBuilder
        ]);
    });

    beforeEach(async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb
            .createAsync(HintScroll)
            .then((f: ComponentFixture<HintScroll>) => {
                fixture = f;
                hintScroll = f.componentInstance;
                element = f.nativeElement;
                initialize();
            });
    })));

    it('should initialize element', () => {
        expect(hintScroll).toBeDefined();
    });
});
