import { ClientRequestOptions } from './client-request-options';
import { mockAppConfig }        from '../context/app-config.mock';

declare const expect, it, describe;

describe('ClientRequestOptions', () => {

    it('Building options with empty object', () => {
        const opts = new ClientRequestOptions();

        expect(opts.headers).toBeDefined();
        expect(opts.headers.get('Accept')).toBe('application/json');
        expect(opts.headers.get('Content-Type')).toBe('application/json');
        expect(opts.headers.get('X-Requested-With')).toBe('XMLHttpRequest');
        expect(opts.headers.get('X-Apigee-App-Id')).toBeFalsy();
        expect(opts.headers.get('X-Apigee-App-Version')).toBeFalsy();
    });

    it('Building options with spa name', () => {
        const opts = new ClientRequestOptions(undefined, mockAppConfig);

        expect(opts.headers).toBeDefined();
        expect(opts.headers.get('Accept')).toBe('application/json');
        expect(opts.headers.get('Content-Type')).toBe('application/json');
        expect(opts.headers.get('X-Requested-With')).toBe('XMLHttpRequest');
        expect(opts.headers.get('X-Apigee-App-Id')).toBe(mockAppConfig.gtmAppName);
        expect(opts.headers.get('X-Apigee-App-Version')).toBe(mockAppConfig.appVersion);
    });
});
