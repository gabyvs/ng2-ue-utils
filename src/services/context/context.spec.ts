import { Location } from '@angular/common';
import { SpyLocation } from '@angular/common/testing';
import { addProviders, inject } from '@angular/core/testing';
import { HTTP_PROVIDERS, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { Client } from '../client/client';
import { ClientMock } from '../client/client.mock';
import { ContextService, GTM_APP_NAME, APP_BASEPATH } from './context';
import { WindowMock, WindowRef } from '../window-ref';

declare const beforeEach, describe, expect, it, spyOn;
const appName = 'someappfortest';

describe('Context Service', () => {
    let service: ContextService;
    let client;
    let loc;
    let window;

    beforeEach(() => {
        addProviders([
            HTTP_PROVIDERS,
            ContextService,
            { provide: XHRBackend, useClass: MockBackend} ,
            { provide: Location, useClass: SpyLocation} ,
            { provide: WindowRef, useClass: WindowMock },
            { provide: Client, useClass: ClientMock },
            { provide: GTM_APP_NAME, useValue: appName },
            { provide: APP_BASEPATH, useValue: appName }
        ]);
    });

    beforeEach(inject([ContextService, Client, Location, WindowRef], (s, c, l, w) => {
        service = s;
        client = c;
        loc = l;
        window = w;
    }));

    it('Populates the org name', () => {
        const orgName = 'fromPath';
        loc.path = () => { return `/organizations/${orgName}/products`; };
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
        expect(theSpy.calls.argsFor(0)[0]).toBe(`/organizations/${orgName}/${appName}`);
    });

    it('Gets the org from the user orgs', () => {
        const orgName = 'orgFromRoles';
        const user = 'user@apigee.com';
        const btoaString = `{"email":"${user}"}`;
        const btoaVal = btoa(btoaString);
        window.cookieString = `access_token=.${btoaVal}.`;
        spyOn(loc, 'go');
        spyOn(client, 'get').and.callThrough();
        let theSpy = client.get as any;
        let theLocSpy = loc.go as any;
        client.on(`/users/${user}/userroles`, { role: [{ organization: orgName}]});
        const context = service.getContext();
        expect(context.orgName).toBeUndefined();
        expect(theSpy.calls.count()).toBe(1);
        expect(theSpy.calls.argsFor(0)[0]).toBe(`/users/${user}/userroles`);
        expect(loc.go).toHaveBeenCalled();
        expect(theLocSpy.calls.count()).toBe(1);
        expect(theLocSpy.calls.argsFor(0)[0]).toBe(`/organizations/orgFromRoles/${appName}`);
    });

    // org page does not exist yet, but we should redirect to it
    it('Should not redirect if the user does not have any roles at any org', () => {
        const user = 'user@apigee.com';
        const btoaString = `{"email":"${user}"}`;
        const btoaVal = btoa(btoaString);
        window.cookieString = `access_token=.${btoaVal}.`;
        spyOn(loc, 'go');
        spyOn(client, 'get').and.callThrough();
        let theSpy = client.get as any;
        client.on(`/users/${user}/userroles`, {}); // empty roles
        const context = service.getContext();
        expect(context.orgName).toBeUndefined();
        expect(loc.go).not.toHaveBeenCalled();
        expect(theSpy.calls.count()).toBe(1);
        expect(theSpy.calls.argsFor(0)[0]).toBe(`/users/${user}/userroles`);
    });

    it('Uses http to force redirection', () => {
        spyOn(client, 'get').and.callThrough();
        let theSpy = client.get as any;
        const context = service.getContext();
        expect(context.orgName).toBeUndefined();
        expect(theSpy.calls.count()).toBe(1);
        expect(theSpy.calls.argsFor(0)[0]).toBe('/userinfo');
    });

});
