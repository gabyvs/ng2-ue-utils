
const splitParts = (token: string): string[] => token ? token.split('.') : [];

const ensureThreeParts = (arr: string[]): string[] => ['', '', ''].map((s, i) => arr[i] || s);

const tokenParts = (token: string): string[] => ensureThreeParts(splitParts(token));

export interface IJwtHeader {
    alg: string;
}

export interface IJwtPayload {
    email: string;
    user_id: string;
}

export class Jwt {
    private _header: IJwtHeader;
    private _payload: IJwtPayload;

    constructor (token: string) {
        const parts = tokenParts(token);
        this._header = parts[0] ? JSON.parse(atob(parts[0])) as IJwtHeader : { alg: '' };
        this._payload = parts[1] ? JSON.parse(atob(parts[1])) as IJwtPayload : { email: '', user_id: '' };
    }

    public get alg (): string {
        return this._header.alg;
    }

    public get user (): string {
        return this._payload.email;
    }

    public get uuid (): string {
        return this._payload.user_id;
    }
}
