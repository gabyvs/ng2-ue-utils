import { ISimplifiedError } from './client';

const defaultErrorMessages = {
    '400': 'Bad Request',
    '401': 'Unauthorized',
    '402': 'Payment Required',
    '403': 'Forbidden. You don\'t have permissions to access this resource.',
    '404': 'Not Found',
    '405': 'Method Not Allowed',
    '415': 'Unsupported Media Type',
    '500': 'Internal Server Error',
    '502': 'Bad Gateway',
    '503': 'Service Unavailable',
    '504': 'Gateway Timeout'
};

export interface IParseResult {
    simplifiedError?: ISimplifiedError;
    malformedError?: string;
}
export const parse = (error: any, path: string): IParseResult  => {
    let code: string;
    let message: string;
    let jsonError: any = {};
    let response: IParseResult = {};

    if (error) {
        try {
            jsonError = error.json();
            if (!jsonError.message && !jsonError.reason) {
                response.malformedError = JSON.stringify(jsonError);
            }
        } catch (e) { /* do nothing */ }
    }

    code = jsonError.code || (error && error.status && error.status.toString()) || 'Unknown Error';
    message = jsonError.message || jsonError.reason || defaultErrorMessages[code] || (error && error.statusText)
        || (path && 'Unknown error processing path: ' + path) || 'Unknown Error';

    response.simplifiedError = {
        code: code,
        message: message,
        originalError: error,
        path: path
    };

    return response;
};
