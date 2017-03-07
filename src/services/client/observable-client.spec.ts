import { Location }         from '@angular/common';
import { SpyLocation }      from '@angular/common/testing';
import { TestBed }          from '@angular/core/testing';
import * as _               from 'lodash';
import { Observable }       from 'rxjs/Rx';

import { Client }           from './client';
import { ClientMock }       from './client.mock';
import { ObservableClient } from './observable-client';
import {
    APP_CONFIG,
    IAppConfig }            from '../context/app-config';
import { ContextService }   from '../context/context';
import { GTMService }       from '../context/gtm';
import { ApiRoutes }        from '../router/api-routes';
import {
    WindowMock,
    WindowRef }             from '../window-ref';

declare const beforeEach, describe, expect, it;

const apiBasePath = 'apiproducts';
class SomeObservableClient extends ObservableClient {

    constructor(theClient: Client, theRoutes: ApiRoutes) {
        super(theClient, theRoutes);
    }

    public getList <T>(): Observable<T[]> {
        return this.getListObject().map((response: any) => {
            if (response && _.isArray(response.sometype)) {
                return response.sometype;
            } else {
                return [];
            }
        });
    }

    public myCustomGetter = <T>(count: number = 25, key?: string): Observable<T[]> => {
        const theKey = key ? `&expand=true&startKey=${key}` : '';
        let theUrl = `/organizations/abc/${apiBasePath}?count=${count}${theKey}`;
        return this.client.get<T>(theUrl).map((response: any) => {
            if (response && _.isArray(response.sometype)) {
                return response.sometype;
            } else {
                return [];
            }
        });
    };
}

describe('Observable Client', () => {

    const appBasePath = 'products';
    const appName = 'ProductsSPA';
    let appConfig: IAppConfig = {
        apiBasePath: apiBasePath,
        appBasePath: appBasePath,
        gtmAppName: appName
    };
    let someObservableClient: SomeObservableClient;
    let client;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers:      [
                { provide: Location, useClass: SpyLocation} ,
                { provide: WindowRef, useClass: WindowMock },
                { provide: Client, useClass: ClientMock },
                { provide: APP_CONFIG, useValue: appConfig },
                ContextService,
                GTMService
            ]
        });

        const service = TestBed.get(ContextService);
        const a = TestBed.get(APP_CONFIG);
        const loc = TestBed.get(Location);
        const router = new ApiRoutes(service, a.apiBasePath);
        client = TestBed.get(Client);

        loc.go(`/organizations/abc/${appBasePath}`);
        someObservableClient = new SomeObservableClient(client, router);
    });

    it('Loading Permissions for current user', done => {
        const rawRoles = {
            role: [
                { name: 'orgadmin', organization: 'abc' },
                { name: 'custom', organization: 'abc' },
                { name: 'orgadmin', organization: 'abcd' },
            ]
        };
        const root = { organization: 'abc', path: '/path', permissions: ['get', 'put', 'delete']};
        const custom = { organization: 'abc', path: '/custom', permissions: ['get', 'put', 'delete']};
        const orgAdmin = { resourcePermission: [root] };
        const customRole = { resourcePermission: [custom] };

        client.on('/users/dimitri@apigee.com/userroles', rawRoles);
        client.on('/organizations/abc/userroles/orgadmin/permissions', orgAdmin);
        client.on('/organizations/abc/userroles/custom/permissions', customRole);

        someObservableClient.permissions().subscribe(
            permissions => {
                expect(permissions.count).toBe(2);
                expect(permissions.allows('/path', ['get'])).toBe(true);
            },
            error => {
                expect(error).toBeUndefined();
                done();
            },
            () => { done(); }
        );
    });

    it('Deletes a single entity', (done) => {
        const name = 'prodToDelete';
        client.on(`/organizations/abc/${apiBasePath}/${name}`, { name: name });
        someObservableClient.deleteEntity(name).subscribe(
            (product: any) => {
                expect(product.name).toBe(name);
                done();
            },
            (error) => {
                expect(error).toBeUndefined();
                done();
            });
    });

    it('Updates a single entity', (done) => {
        const name = 'prodToUpdate';
        const entity = {  data: 'data', name: name };
        const updatedEntity = {  data: 'updated', name: name };
        client.on(`/organizations/abc/${apiBasePath}/${name}`, updatedEntity);

        someObservableClient.updateEntity(name, entity).subscribe(
            (product: any) => {
                expect(product.data).toBe(updatedEntity.data);
                done();
            },
            (error) => {
                expect(error).toBeUndefined();
                done();
            });
    });

    it('Creates a single entity', (done) => {
        const name = 'prodToCreate';
        const entity = {  data: 'data', name: name };
        const createdEntity = { createdAt: new Date(), data: 'data', name: name };
        client.on(`/organizations/abc/${apiBasePath}`, createdEntity);

        someObservableClient.createEntity(entity).subscribe(
            (product: any) => {
                expect(product.createdAt).toBeDefined();
                done();
            },
            (error) => {
                expect(error).toBeUndefined();
                done();
            });
    });

    it('Gets a single entity', (done) => {
        const name = 'prodToGet';
        const entity = {  data: 'data', name: name };
        client.on(`/organizations/abc/${apiBasePath}/${name}`, entity);

        someObservableClient.getEntity(name).subscribe(
            (product: any) => {
                expect(product.name).toBe(name);
                done();
            },
            (error) => {
                expect(error).toBeUndefined();
                done();
            });
    });

    it('Gets a list of entities', (done) => {
        const name = 'prodToGet';
        const entity = {  data: 'data', name: name };
        client.on(`/organizations/abc/${apiBasePath}`, { sometype: [ entity ]});

        someObservableClient.getList().subscribe(
            (list: any[]) => {
                expect(list[0].name).toBe(name);
                done();
            },
            (error) => {
                expect(error).toBeUndefined();
                done();
            });
    });

    it('Subclass can create a customized get method', (done) => {
        const name = 'prodToGet';
        const entity = {  data: 'data', name: name };
        client.on(`/organizations/abc/${apiBasePath}?count=25`, { sometype: [ entity ]});

        someObservableClient.myCustomGetter(25).subscribe(
            (list: any[]) => {
                expect(list[0].name).toBe(name);
                done();
            },
            (error) => {
                expect(error).toBeUndefined();
                done();
            });
    });

});
