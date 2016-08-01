import { SpyLocation } from '@angular/common/testing';
import { Location } from '@angular/common';
import { addProviders, inject } from '@angular/core/testing';
import { HTTP_PROVIDERS, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Rx';

import { ObservableClient } from './observable-client';
import { ClientMock } from './client.mock';
import { ApiRoutes } from '../router/api-routes';
import { APP_BASEPATH, ContextService, GTM_APP_NAME } from '../context/context';
import { WindowMock, WindowRef } from '../window-ref';
import { Client } from './client';

declare const beforeEach, describe, expect, it;

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
}

describe('Generic Client', () => {

    const appName = 'products';
    const basePath = 'apiproducts';
    let someObservableClient: SomeObservableClient;
    let client: ClientMock;

    beforeEach(() => {
        addProviders([
            HTTP_PROVIDERS,
            ContextService,
            ApiRoutes,
            { provide: XHRBackend, useClass: MockBackend },
            { provide: Location, useClass: SpyLocation },
            { provide: WindowRef, useClass: WindowMock },
            { provide: Client, useClass: ClientMock },
            { provide: GTM_APP_NAME, useValue: appName },
            { provide: APP_BASEPATH, useValue: basePath }
        ]);
    });

    beforeEach(inject([Client, Location, ApiRoutes], (c, l, r) => {
        l.go('/organizations/abc/products'); // set the org on the URL
        someObservableClient = new SomeObservableClient(c, r);
        client = c;
    }));

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
        client.on(`/organizations/abc/${basePath}/${name}`, { name: name });
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
        client.on(`/organizations/abc/${basePath}/${name}`, updatedEntity);

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
        client.on(`/organizations/abc/${basePath}`, createdEntity);

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
        client.on(`/organizations/abc/${basePath}/${name}`, entity);

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
        client.on(`/organizations/abc/${basePath}`, { sometype: [ entity ]});

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

});
