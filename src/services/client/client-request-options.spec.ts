import { ClientRequestOptions } from './client-request-options';

declare const expect, it, describe;

describe('ClientRequestOptions', () => {

    it('Building options with empty object', () => {
        const opts = new ClientRequestOptions();

        expect(opts.headers).toBeDefined();
        expect(opts.headers.get('Accept')).toBe('application/json');
        expect(opts.headers.get('Content-Type')).toBe('application/json');
    });
});
