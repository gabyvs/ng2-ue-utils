import {
    ComponentFixture,
    TestBed
}                       from '@angular/core/testing';

import { HintScroll }   from './hint-scroll';

declare const beforeEach, describe, expect, it;

describe('Component: HintScroll', () => {
    let fixture: ComponentFixture<HintScroll>;
    let hintScroll;

    const initialize = () => {
        fixture.detectChanges();
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations:   [ HintScroll ]
        });

        fixture = TestBed.createComponent(HintScroll);
        hintScroll = fixture.componentInstance;
        initialize();
    });

    it('should initialize element', () => {
        expect(hintScroll).toBeDefined();
    });
});
