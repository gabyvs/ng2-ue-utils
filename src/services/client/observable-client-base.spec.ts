import { TestBed }                                  from '@angular/core/testing';

import { Client }                                   from './client';
import { ClientMock }                               from './client.mock';
import { ClientObserver }                           from './clientObserver';
import { ObservableClientBase }                     from './observable-client-base';

declare const beforeEach, describe, expect, it, spyOn;

describe('Observable Client Base', () => {
    
    let client, clientObserver;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers:      [
                ClientObserver,
                { provide: Client, useClass: ClientMock }
            ]
        });
        
        client = TestBed.get(Client);
        clientObserver = TestBed.get(ClientObserver);
    });

    it('wraps GET calls in `spyCall`, and `spyCall` uses client observer when provided', done => {
        const obsClientBase = new ObservableClientBase(client);
        const obsClientBasePlusClientObserver = new ObservableClientBase(client, clientObserver);
        const spyCallSpy = spyOn(obsClientBase, 'spyCall').and.callThrough();
        const observeOnSpy = spyOn(clientObserver, 'observeOn').and.callThrough();
        const response = 'response';
        const path = 'somePath';
        let counter = 0;
        client.on(`${path}1`, response);
        client.on(`${path}2`, response);

        obsClientBase.get(`${path}1`).subscribe(
            resp => {
                counter += 1;
                expect(resp).toBe(response);
                expect(spyCallSpy).toHaveBeenCalled();
                const mostRecentCallArgs: any[] = spyCallSpy.calls.mostRecent().args;
                expect(mostRecentCallArgs[0]).toBe('get');
                mostRecentCallArgs[1].subscribe(r => expect(resp).toBe(r));
                expect(observeOnSpy).not.toHaveBeenCalled();
            },
            error => {
                expect('should not err').toBeUndefined();
            },
            () => {
                counter += 1;
                obsClientBasePlusClientObserver.get(`${path}2`).subscribe(
                    resp => {
                        counter += 1;
                        expect(resp).toBe(response);
                        expect(spyCallSpy).toHaveBeenCalled();
                        const mostRecentCallArgs: any[] = spyCallSpy.calls.mostRecent().args;
                        expect(mostRecentCallArgs[0]).toBe('get');
                        mostRecentCallArgs[1].subscribe(r => expect(resp).toBe(r));
                        expect(observeOnSpy).toHaveBeenCalled();
                    },
                    error => {
                        expect('should not err').toBeUndefined();
                    },
                    () => {
                        expect(counter).toBe(3);
                        done();
                    }
                );
            }
        );
    });

    it('wraps PUT calls in `spyCall`, and `spyCall` uses client observer when provided', done => {
        const obsClientBase = new ObservableClientBase(client);
        const obsClientBasePlusClientObserver = new ObservableClientBase(client, clientObserver);
        const spyCallSpy = spyOn(obsClientBase, 'spyCall').and.callThrough();
        const observeOnSpy = spyOn(clientObserver, 'observeOn').and.callThrough();
        const response = 'response';
        const path = 'somePath';
        let counter = 0;
        client.on(`${path}1`, response);
        client.on(`${path}2`, response);
        
        obsClientBase.put(`${path}1`, {}).subscribe(
            resp => {
                counter += 1;
                expect(resp).toBe(response);
                expect(spyCallSpy).toHaveBeenCalled();
                const mostRecentCallArgs: any[] = spyCallSpy.calls.mostRecent().args;
                expect(mostRecentCallArgs[0]).toBe('put');
                mostRecentCallArgs[1].subscribe(r => expect(resp).toBe(r));
                expect(observeOnSpy).not.toHaveBeenCalled();
            },
            error => {
                expect('should not err').toBeUndefined();
            },
            () => {
                counter += 1;
                obsClientBasePlusClientObserver.put(`${path}2`, {}).subscribe(
                    resp => {
                        counter += 1;
                        expect(resp).toBe(response);
                        expect(spyCallSpy).toHaveBeenCalled();
                        const mostRecentCallArgs: any[] = spyCallSpy.calls.mostRecent().args;
                        expect(mostRecentCallArgs[0]).toBe('put');
                        mostRecentCallArgs[1].subscribe(r => expect(resp).toBe(r));
                        expect(observeOnSpy).toHaveBeenCalled();
                        done();
                    },
                    error => {
                        expect('should not err').toBeUndefined();
                    },
                    () => {
                        expect(counter).toBe(3);
                        done();
                    }
                );
            }
        );
    });
    
    it('wraps POST calls in `spyCall`, and `spyCall` uses client observer when provided', done => {
        const obsClientBase = new ObservableClientBase(client);
        const obsClientBasePlusClientObserver = new ObservableClientBase(client, clientObserver);
        const spyCallSpy = spyOn(obsClientBase, 'spyCall').and.callThrough();
        const observeOnSpy = spyOn(clientObserver, 'observeOn').and.callThrough();
        const response = 'response';
        const path = 'somePath';
        let counter = 0;
        client.on(`${path}1`, response);
        client.on(`${path}2`, response);

        obsClientBase.post(`${path}1`, {}).subscribe(
            resp => {
                counter += 1;
                expect(resp).toBe(response);
                expect(spyCallSpy).toHaveBeenCalled();
                const mostRecentCallArgs: any[] = spyCallSpy.calls.mostRecent().args;
                expect(mostRecentCallArgs[0]).toBe('post');
                mostRecentCallArgs[1].subscribe(r => expect(resp).toBe(r));
                expect(observeOnSpy).not.toHaveBeenCalled();
            },
            error => {
                expect('should not err').toBeUndefined();
            },
            () => {
                counter += 1;
                obsClientBasePlusClientObserver.post(`${path}2`, {}).subscribe(
                    resp => {
                        counter += 1;
                        expect(resp).toBe(response);
                        expect(spyCallSpy).toHaveBeenCalled();
                        const mostRecentCallArgs: any[] = spyCallSpy.calls.mostRecent().args;
                        expect(mostRecentCallArgs[0]).toBe('post');
                        mostRecentCallArgs[1].subscribe(r => expect(resp).toBe(r));
                        expect(observeOnSpy).toHaveBeenCalled();
                        done();
                    },
                    error => {
                        expect('should not err').toBeUndefined();
                    },
                    () => {
                        expect(counter).toBe(3);
                        done();
                    }
                );
            }
        );
    });
    
    it('wraps DELETE calls in `spyCall`, and `spyCall` uses client observer when provided', done => {
        const obsClientBase = new ObservableClientBase(client);
        const obsClientBasePlusClientObserver = new ObservableClientBase(client, clientObserver);
        const spyCallSpy = spyOn(obsClientBase, 'spyCall').and.callThrough();
        const observeOnSpy = spyOn(clientObserver, 'observeOn').and.callThrough();
        const response = 'response';
        const path = 'somePath';
        let counter = 0;
        client.on(`${path}1`, response);
        client.on(`${path}2`, response);
        
        obsClientBase.delete(`${path}1`).subscribe(
            resp => {
                counter += 1;
                expect(resp).toBe(response);
                expect(spyCallSpy).toHaveBeenCalled();
                const mostRecentCallArgs: any[] = spyCallSpy.calls.mostRecent().args;
                expect(mostRecentCallArgs[0]).toBe('delete');
                mostRecentCallArgs[1].subscribe(r => expect(resp).toBe(r));
                expect(observeOnSpy).not.toHaveBeenCalled();
            },
            error => {
                expect('should not err').toBeUndefined();
            },
            () => {
                counter += 1;
                obsClientBasePlusClientObserver.delete(`${path}2`).subscribe(
                    resp => {
                        counter += 1;
                        expect(resp).toBe(response);
                        expect(spyCallSpy).toHaveBeenCalled();
                        const mostRecentCallArgs: any[] = spyCallSpy.calls.mostRecent().args;
                        expect(mostRecentCallArgs[0]).toBe('delete');
                        mostRecentCallArgs[1].subscribe(r => expect(resp).toBe(r));
                        expect(observeOnSpy).toHaveBeenCalled();
                        done();
                    },
                    error => {
                        expect('should not err').toBeUndefined();
                    },
                    () => {
                        expect(counter).toBe(3);
                        done();
                    }
                );
            }
        );
    });
});
