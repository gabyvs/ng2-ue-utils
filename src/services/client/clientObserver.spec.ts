import { ClientObserver } from './clientObserver';

declare const expect, it, describe;

describe('Client Observer', () => {

    it('Starts increment stack', (done) => {
        const spy = new ClientObserver();
        const s = spy.clientEvents.subscribe(event => {
            expect(event.method).toBe('get');
            expect(event.event).toBe('start');
            expect(event.stackCount).toBe(1);
            s.unsubscribe();
            done();
        });
        spy.emitChange('start', 'get');
    });

    it('Next doesnt increment stack', (done) => {
        const spy = new ClientObserver();
        const s = spy.clientEvents.subscribe(event => {
            expect(event.method).toBe('get');
            expect(event.event).toBe('start');
            expect(event.stackCount).toBe(1);
            s.unsubscribe();
            done();
        });
        spy.emitChange('start', 'get');
    });

    it('Error don\'t decrements stack if it is empty', (done) => {
        const spy = new ClientObserver();
        const s = spy.clientEvents.subscribe(event => {
            expect(event.method).toBe('get');
            expect(event.event).toBe('error');
            expect(event.stackCount).toBe(0);
            s.unsubscribe();
            done();
        });
        spy.emitChange('error', 'get');
    });

    it('Complete don\'t decrements stack if it is empty', (done) => {
        const spy = new ClientObserver();
        const s = spy.clientEvents.subscribe(event => {
            expect(event.method).toBe('get');
            expect(event.event).toBe('complete');
            expect(event.stackCount).toBe(0);
            s.unsubscribe();
            done();
        });
        spy.emitChange('complete', 'get');
    });

    it('Combining events', (done) => {
        const spy = new ClientObserver();
        let responses = [
            { count: 1, event: 'start'},
            { count: 2, event: 'start'},
            { count: 2, event: 'next'},
            { count: 1, event: 'error'},
            { count: 0, event: 'complete'}
        ];
        const s = spy.clientEvents.subscribe(event => {
            const r = responses[0];
            expect(event.method).toBe('get');
            expect(event.event).toBe(r.event);
            expect(event.stackCount).toBe(r.count);
            responses = responses.slice(1);
            if (responses.length === 0) {
                s.unsubscribe();
                done();
            }
        });
        spy.emitChange('start', 'get');
        spy.emitChange('start', 'get');
        spy.emitChange('next', 'get');
        spy.emitChange('error', 'get');
        spy.emitChange('complete', 'get');
    });

    it('Returns url on the event', done => {
        const spy = new ClientObserver();
        const url = '/someurl/here';
        const s = spy.clientEvents.subscribe(event => {
            expect(event.method).toBe('get');
            expect(event.event).toBe('start');
            expect(event.path).toBe(url);
            expect(event.stackCount).toBe(1);
            s.unsubscribe();
            done();
        });
        spy.emitChange('start', 'get', url);
    });

});
