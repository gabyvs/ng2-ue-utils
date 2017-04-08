import { ClientRequestOptions } from './client-request-options';

declare const expect, it, describe;

describe('ClientRequestOptions', () => {

    it('Building options with empty object', () => {
        const opts = new ClientRequestOptions();

        expect(opts.headers).toBeDefined();
        expect(opts.headers.get('Accept')).toBe('application/json');
        expect(opts.headers.get('Content-Type')).toBe('application/json');
        expect(opts.headers.get('X-Requested-With')).toBe('XMLHttpRequest');
        expect(opts.headers.get('X-Apigee-App-Id')).toBeFalsy();
    });

    it('Building options with spa name', () => {
        const spaName = 'randomSPAName';
        const opts = new ClientRequestOptions(undefined, spaName);

        expect(opts.headers).toBeDefined();
        expect(opts.headers.get('Accept')).toBe('application/json');
        expect(opts.headers.get('Content-Type')).toBe('application/json');
        expect(opts.headers.get('X-Requested-With')).toBe('XMLHttpRequest');
        expect(opts.headers.get('X-Apigee-App-Id')).toBe(spaName);
    });
});
