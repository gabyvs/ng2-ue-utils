import { TestBed }                  from '@angular/core/testing';

import { ContextHelper }            from './context-helper';
import { WindowMock, WindowRef }    from '../window-ref';

declare const beforeEach, describe, expect, it;

describe('Context Helper', () => {

    let helper: ContextHelper;
    let window: WindowMock;
    const sessionContext: ContextHelper.ISessionContext = { email: 'test@test.com', uuid: 'a-uuid-here' };
    const jsString = JSON.stringify(sessionContext);
    const cookieValue = `session_context=${btoa(jsString)}`;

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

    it('Sets org name to local storage', () => {
        const theOrg = 'thisorg';
        helper.orgNameToLocal(theOrg);
        expect(window.getLocal('organization')).toBe(theOrg);
    });

    it('gets user email from cookie', () => {
        window.cookieString = cookieValue;
        expect(helper.getUser()).toBe('test@test.com');
    });

    it('gets uuid from cookie', () => {
        window.cookieString = cookieValue;
        expect(helper.getUuid()).toBe('a-uuid-here');
    });

    it('gets context from cookie', () => {
        window.cookieString = cookieValue;
        expect(helper.getSessionContext().email).toBeDefined();
        expect(helper.getSessionContext().email).toBe('test@test.com');
        expect(helper.getSessionContext().uuid).toBeDefined();
        expect(helper.getSessionContext().uuid).toBe('a-uuid-here');
    });
});
