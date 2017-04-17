import { Location }         from '@angular/common';
import { SpyLocation }      from '@angular/common/testing';
import { TestBed }          from '@angular/core/testing';

import { APP_CONFIG }       from './app-config';
import { mockAppConfig }    from './app-config.mock';
import { ContextService }   from './context';
import { ContextHelper }    from './context-helper';
import { GTMService }       from './gtm';
import { Client }           from '../client/client';
import { ClientMock }       from '../client/client.mock';
import {
    WindowMock,
    WindowRef }             from '../window-ref';

declare const beforeEach, describe, expect, it, spyOn;
const sessionContext: ContextHelper.ISessionContext = { email: 'test@test.com', uuid: 'a-uuid-here' };
const jsString = JSON.stringify(sessionContext);
const cookieValue = `session_context=${btoa(jsString)}`;

describe('Context Service', () => {
    let service: ContextService;
    let client;
    let loc;
    let window;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers:      [
                ContextService,
                GTMService,
                { provide: Location, useClass: SpyLocation} ,
                { provide: WindowRef, useClass: WindowMock },
                { provide: Client, useClass: ClientMock },
                { provide: APP_CONFIG, useValue: mockAppConfig }
            ]
        });

        service = TestBed.get(ContextService);
        client = TestBed.get(Client);
        loc = TestBed.get(Location);
        window = TestBed.get(WindowRef);
    });

    it('Populates the org name', () => {
        const orgName = 'fromPath';
        loc.path = () => { return `/organizations/${orgName}/${mockAppConfig.appBasePath}`; };
        const context = service.getContext();
        expect(context.orgName).toBe(orgName);
    });

    it('Calls get context only the first name the organization name is required', () => {
        spyOn(service, 'getContext').and.returnValue({ orgName: 'abc'});
        let theSpy = service.getContext as any;
        const o = service.orgName;
        expect(o).toBeDefined();
        expect(theSpy).toHaveBeenCalled();
        const o2 = service.orgName;
        expect(o2).toBeDefined();
        expect(theSpy.calls.count()).toBe(1);
    });

    it('Gets the org from local storage', () => {
        const orgName = 'fromLocal';
        spyOn(loc, 'go').and.callThrough();
        let theSpy = loc.go as any;
        window.setLocal('organization', orgName);
        const context = service.getContext();
        expect(context.orgName).toBe(orgName);
        expect(loc.go).toHaveBeenCalled();
        expect(theSpy.calls.count()).toBe(1);
        expect(theSpy.calls.argsFor(0)[0]).toBe(`/organizations/${orgName}/${mockAppConfig.appBasePath}`);
    });

    it('Redirects to no-org page if organization was not in url nor in local storage', () => {
        const theSpy = spyOn(window, 'location').and.callThrough();
        const context = service.getContext();
        expect(context.orgName).toBeUndefined();
        expect(theSpy).toHaveBeenCalled();
        expect(theSpy.calls.count()).toBe(1);
        expect(theSpy.calls.argsFor(0)[0]).toBe(`/no-org`);
    });

    it('gets uuid from cookie', () => {
        window.cookieString = cookieValue;
        expect(service.uuid).toBe('a-uuid-here');
    });

    it('gets context from cookie', () => {
        window.cookieString = cookieValue;
        expect(service.sessionContext.email).toBeDefined();
        expect(service.sessionContext.email).toBe('test@test.com');
        expect(service.sessionContext.uuid).toBeDefined();
        expect(service.sessionContext.uuid).toBe('a-uuid-here');
    });
});
