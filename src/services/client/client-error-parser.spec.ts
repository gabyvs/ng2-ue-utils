import { parse } from './client-error-parser';

declare const expect, it, describe;

describe('Error Parser', () => {
    const path = '/some/path';
    const createError = (props: any): any => {
        let error: any = {
            json: function () {
                return 'string' === typeof this._body ? JSON.parse(this._body) :
                    (this._body instanceof ArrayBuffer ? JSON.parse(this.text()) : this._body);
            }
        };
        return Object.assign(error, props);
    };

    it('Parses when empty error and empty path', () => {
        const result = parse(undefined, undefined);
        expect(result).toBeDefined();
        expect(result.simplifiedError.code).toBe('Unknown Error');
        expect(result.simplifiedError.message).toBe('Unknown Error');
        expect(result.malformedError).toBeUndefined();
    });

    it('Parses when error has a body with a code and message', () => {
        const error = createError({
            _body: '{ "code" : "Some error code", "message": "Some error message"}',
            status: 500,
            statusText: 'Server Error'
        });
        const result = parse(error, path);
        expect(result).toBeDefined();
        expect(result.simplifiedError.code).toBe('Some error code');
        expect(result.simplifiedError.message).toBe('Some error message');
        expect(result.malformedError).toBeUndefined();
    });

    it('Parses when error has a body without a code with error status', () => {
        const error = createError({
            _body: '{ "context" : []}',
            status: 500,
            statusText: 'Server Error'
        });
        const result = parse(error, path);
        expect(result).toBeDefined();
        expect(result.simplifiedError.code).toBe('500');
        expect(result.simplifiedError.message).toBe('Internal Server Error');
        expect(result.malformedError).toBeDefined();
    });

    it('Parses when error status is not on our list', () => {
        const error = createError({
            _body: '{ "context" : []}',
            status: 514,
            statusText: 'Server Error'
        });
        const result = parse(error, path);
        expect(result).toBeDefined();
        expect(result.simplifiedError.code).toBe('514');
        expect(result.simplifiedError.message).toBe('Server Error');
        expect(result.malformedError).toBeDefined();
    });

    it('Parses when error has a body with reason', () => {
        const error = createError({
            _body: '{ "context" : [], "reason": "Some error reason"}',
            status: 514,
            statusText: 'Server Error'
        });
        const result = parse(error, path);
        expect(result).toBeDefined();
        expect(result.simplifiedError.code).toBe('514');
        expect(result.simplifiedError.message).toBe('Some error reason');
        expect(result.malformedError).toBeUndefined();
    });
});
