import { TestBed }                      from '@angular/core/testing';
import {
    XHRBackend,
    Response,
    ResponseOptions,
    RequestMethod,
    Headers,
    HttpModule
}                                       from '@angular/http';
import { MockBackend, MockConnection }  from '@angular/http/testing';

import { Client }                       from './client';
import { WindowRef, WindowMock }        from '../window-ref';

declare const beforeEach, expect, it, describe;

const someUrl = '/organziations/abc/proxies';

const newResponse = (): Response =>
    new Response(
        new ResponseOptions()
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

describe('Client', () => {
    let client: Client;
    let backend: MockBackend;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ HttpModule ],
            providers: [
                Client,
                { provide: XHRBackend, useClass: MockBackend },
                { provide: WindowRef, useClass: WindowMock },
            ]
        });

        client = TestBed.get(Client);
        backend = TestBed.get(XHRBackend);
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
                done();
            }
        );
        connection.mockRespond(newResponse());
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
        connection.mockRespond(newResponse());
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
        connection.mockRespond(newResponse());
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
        connection.mockRespond(newResponse());
    });

    it('GET with empty error', (done) => {
        let connection: MockConnection;
        backend.connections.subscribe((cn: MockConnection) => connection = cn);
        client.get(someUrl).subscribe(
            next => {
                expect(next).toBeUndefined();
                done();
            },
            error => {
                expect(error).toBeDefined();
                expect(error).toBe('Forbidden. You don\'t have permissions to access this resource. Error code: 403');
                done();
            }
        );
        connection.mockRespond(newForbidden());
    });

});
