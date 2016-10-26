import { Location }                                 from '@angular/common';
import { SpyLocation }                              from '@angular/common/testing';
import { TestBed }                                  from '@angular/core/testing';

import { ApiRoutes }                                from './api-routes';
import { Client }                                   from '../client/client';
import { ClientMock }                               from '../client/client.mock';
import { ContextService, APP_CONFIG, IAppConfig }   from '../context/context';
import { WindowMock, WindowRef }                    from '../window-ref';

declare const beforeEach, describe, expect, it;

describe('Generated URLs', () => {

    const orgName = 'abc';
    const apiBasePath = 'apiproducts';
    const appBasePath = 'products';
    const appName = 'ProductsSPA';
    const appConfig: IAppConfig = {
        apiBasePath: apiBasePath,
        appBasePath: appBasePath,
        gtmAppName: appName
    };
    let router;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers:      [
                ContextService,
                { provide: Location, useClass: SpyLocation} ,
                { provide: WindowRef, useClass: WindowMock },
                { provide: Client, useClass: ClientMock },
                { provide: APP_CONFIG, useValue: appConfig }
            ]
        });

        const service = TestBed.get(ContextService);
        const a = TestBed.get(APP_CONFIG);
        const loc = TestBed.get(Location);
        loc.go(`/organizations/${orgName}/${appBasePath}`);
        router = new ApiRoutes(service, a.apiBasePath);
    });

    it('Gets org name', () => {
       expect(router.orgName).toBe(orgName);
    });

    it('Org URL', () => {
        expect(router.orgUrl())
            .toBe(`/organizations/${orgName}`);

        const path = '/somepath';
        expect(router.orgUrl(path))
            .toBe(`/organizations/${orgName}${path}`);
    });

    it('UserInfo', () => {
        expect(router.userInfo()).toBe(('/userinfo'));
    });

    it('User Roles', () => {
        expect(router.userRoles('user@apigee.com')).toBe('/users/user@apigee.com/userroles');
    });

    it('Organization Role', () => {
        expect(router.orgRole('r1')).toBe('/organizations/abc/userroles/r1/permissions');
    });

    it('Entity New URL', () => {
        expect(router.new())
            .toBe(`/organizations/abc/${apiBasePath}`);
    });

    it('Entity One URL', () => {
        expect(router.entity('id'))
            .toBe(`/organizations/abc/${apiBasePath}/id`);
    });

    it('List URL', () => {
        expect(router.list()).toBe(`/organizations/abc/${apiBasePath}`);
    });
});
