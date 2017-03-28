import { TestBed }      from '@angular/core/testing';
import {
    XHRBackend,
    Response,
    ResponseOptions,
    RequestMethod,
    Headers,
    HttpModule }        from '@angular/http';
import {
    MockBackend,
    MockConnection }    from '@angular/http/testing';

import { Client }       from './client';
import {
    APP_CONFIG,
    IAppConfig }        from '../context/app-config';
import {
    GTMService,
    IGAEvent,
    IGATimingEvent }    from '../context/gtm';
import {
    WindowRef,
    WindowMock }        from '../window-ref';

declare const beforeEach, expect, it, describe;

const someUrl = '/organziations/abc/proxies';
const apiBasePath = 'apiproducts';
const appBasePath = 'products';
const appName = 'ProductsSPA';
const appConfig: IAppConfig = {
    apiBasePath: apiBasePath,
    appBasePath: appBasePath,
    gtmAppName: appName
};

const emptyResponse: Response = new Response(
    new ResponseOptions({
        body: '',
        headers: new Headers(),
        status: 200,
        statusText: '',
        type: 3,
        url: someUrl
    })
);

const newForbidden = (): Response =>
    new Response(
        new ResponseOptions({
            body: '',
            headers: new Headers(),
            status: 403,
            statusText: '',
            type: 3,
            url: someUrl
        })
    );

const newMalFormedError = (): Response =>  new Response(
    new ResponseOptions({
        body: '{ "context" : []}',
        status: 500,
        statusText: 'Server Error'
    })
);

describe('Client', () => {
    let client: Client;
    let backend: MockBackend;
    let window: WindowMock;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ HttpModule ],
            providers: [
                Client,
                GTMService,
                { provide: XHRBackend, useClass: MockBackend },
                { provide: APP_CONFIG, useValue: appConfig },
                { provide: WindowRef, useClass: WindowMock },
            ]
        });

        client = TestBed.get(Client);
        backend = TestBed.get(XHRBackend);
        window = TestBed.get(WindowRef);
    });

    it('Injection with Angular', () => {
        expect(client).toBeDefined();
    });

    it('GET translates URL correctly', (done) => {
        let connection: MockConnection;
        backend.connections.subscribe((cn: MockConnection) => connection = cn);
        client.get(someUrl).subscribe(
            next => {
                expect(connection.request.url).toBe(someUrl);
                expect(connection.request.method).toBe(RequestMethod.Get);
                expect(window.dataLayer.length).toBe(1);
                const theEvent: IGATimingEvent = window.dataLayer[0];
                expect(theEvent.event).toBe('timing');
                expect(theEvent.timingVar).toBe(200);
                expect(theEvent.timingCategory).toBe('Edge_APICall');
                expect(theEvent.timingLabel).toBe(someUrl);
                expect(theEvent.timingValue).toBeDefined();
                expect(theEvent.timingValue >= 0).toBeTruthy();
                done();
            }
        );
        connection.mockRespond(emptyResponse);
    });
    
    it('Empty string response bodies do not break the client', (done) => {
        let connection: MockConnection;
        backend.connections.subscribe((cn: MockConnection) => connection = cn);
        client.get(someUrl).subscribe(
            response => {
                expect(connection.request.url).toBe(someUrl);
                expect(connection.request.method).toBe(RequestMethod.Get);
                expect(response).toBeUndefined();
                done();
            }
        );
        connection.mockRespond(emptyResponse);
    });

    it('PUT translates URL correctly', (done) => {
        let connection: MockConnection;
        backend.connections.subscribe((cn: MockConnection) => connection = cn);
        client.put(someUrl, {}).subscribe(
            next => {
                expect(connection.request.url).toBe(someUrl);
                expect(connection.request.method).toBe(RequestMethod.Put);
                done();
            }
        );
        connection.mockRespond(emptyResponse);
    });

    it('POST translates URL correctly', (done) => {
        let connection: MockConnection;
        backend.connections.subscribe((cn: MockConnection) => connection = cn);
        client.post(someUrl, {}).subscribe(
            next => {
                expect(connection.request.url).toBe(someUrl);
                expect(connection.request.method).toBe(RequestMethod.Post);
                done();
            }
        );
        connection.mockRespond(emptyResponse);
    });

    it('DELETE translates URL correctly', (done) => {
        let connection: MockConnection;
        backend.connections.subscribe((cn: MockConnection) => connection = cn);
        client.delete(someUrl).subscribe(
            next => {
                expect(connection.request.url).toBe(someUrl);
                expect(connection.request.method).toBe(RequestMethod.Delete);
                done();
            }
        );
        connection.mockRespond(emptyResponse);
    });

    it('GET with empty error', (done) => {
        let connection: MockConnection;
        backend.connections.subscribe((cn: MockConnection) => connection = cn);
        client.get(someUrl).subscribe(
            next => {
                expect('Should not enter success case').toBeUndefined();
                done();
            },
            error => {
                expect(error).toBeDefined();
                expect(error.message).toBeDefined();
                expect(error.message).toBe('Forbidden. You don\'t have permissions to access this resource.');
                expect(error.code).toBe('403');
                done();
            }
        );
        connection.mockRespond(newForbidden());
    });

    it('GET with malformed error', (done) => {
        let connection: MockConnection;
        backend.connections.subscribe((cn: MockConnection) => connection = cn);
        client.get(someUrl).subscribe(
            next => {
                expect('Should not enter success case').toBeUndefined();
                done();
            },
            error => {
                expect(error).toBeDefined();
                expect(error.message).toBeDefined();
                expect(error.message).toBe('Internal Server Error');
                expect(error.code).toBe('500');
                const theMalFormedError: IGAEvent = window.dataLayer[0];
                expect(theMalFormedError.event).toBe('Edge_malFormedError');
                expect(theMalFormedError.target).toBe('ProductsSPA');
                expect(theMalFormedError.action).toBe(someUrl);
                expect(theMalFormedError['target-properties']).toBe('{"context":[]}');
                done();
            }
        );
        const err: any = newMalFormedError();
        err.name = 'error name';
        connection.mockError(err);
    });

});
