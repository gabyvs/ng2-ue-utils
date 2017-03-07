import { TestBed }                  from '@angular/core/testing';

import { ContextHelper }            from './context-helper';
import { WindowMock, WindowRef }    from '../window-ref';

declare const beforeEach, describe, expect, it;

describe('Context Helper', () => {

    let helper: ContextHelper;
    let window: WindowMock;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers:      [ { provide: WindowRef, useClass: WindowMock } ]
        });

        window = TestBed.get(WindowRef);
        helper = new ContextHelper(window);
    });

    it('Extracts org name from path', () => {
        expect(helper.orgNameFromPath('/organizations/abc/some/thing')).toBe('abc');
    });

    it('Extracts org name from local', () => {
        window.setLocal('organization', 'abc');
        expect(helper.orgNameFromLocal()).toBe('abc');
    });
});
