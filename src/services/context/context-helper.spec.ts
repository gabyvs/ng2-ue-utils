import { addProviders, inject } from '@angular/core/testing';

import { ContextHelper } from './context-helper';
import { WindowMock, WindowRef } from '../window-ref';

describe('Context Helper', () => {

    const appName = 'someappfortest';
    let helper: ContextHelper;
    let window: WindowMock;

    beforeEach(() => {
        addProviders([
            { provide: WindowRef, useClass: WindowMock }
        ]);
    });

    beforeEach(inject([WindowRef], (w) => {
        window = w;
        helper = new ContextHelper(w, appName);
    }));

    it('Extract org name from path', () => {
        expect(helper.orgNameFromPath('/organizations/abc/some/thing')).toBe('abc');
    });

    it('Extract org name from local', () => {
        window.setLocal('organization', 'abc');
        expect(helper.orgNameFromLocal()).toBe('abc');
    });

    it('Set context for Google Tag Manager', () => {
        const org = 'apigeeui';
        const id = 'theid';
        const internalEmail = 'theemail@apigee.com';
        const externalEmail = 'theemail@test.com';
        helper.updateGtmContext(org, id, internalEmail);
        expect(window.gtmContexts).toBeDefined();
        expect(window.gtmContexts.length).toBe(1);
        expect(window.gtmContexts[0]['organization.name']).toBe(org);
        expect(window.gtmContexts[0]['webapp.name']).toBe(appName);
        expect(window.gtmContexts[0]['user.internal']).toBe('internal');
        expect(window.gtmContexts[0]['user.email']).toBe(internalEmail);
        expect(window.gtmContexts[0]['user.uuid']).toBe(id);
        helper.updateGtmContext(org, id, externalEmail);
        expect(window.gtmContexts.length).toBe(2);
        expect(window.gtmContexts[1]['organization.name']).toBe(org);
        expect(window.gtmContexts[1]['webapp.name']).toBe(appName);
        expect(window.gtmContexts[1]['user.internal']).toBeUndefined();
        expect(window.gtmContexts[1]['user.email']).toBe(externalEmail);
        expect(window.gtmContexts[1]['user.uuid']).toBe(id);
    });
});
