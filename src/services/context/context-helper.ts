import { Jwt } from './jwt';
import { WindowRef } from '../window-ref';

export class Cookie {
    constructor(public key: string, public value: string) {}
}

export class ContextHelper {
    constructor(private window: WindowRef, private appName: string) {}

    public orgNameFromPath (path: string): string {
        const parts: RegExpExecArray = /^\/(?:o|organizations)\/([^\/]+)\//.exec(path);
        if (parts && parts.length > 1) {
            return parts[1];
        }
    }

    public orgNameFromLocal (): string {
        let name = this.window.getLocal('organization');
        // Ensure it is undefined instead of null.
        if (!name && name !== undefined) {
            name = undefined;
        }
        return name;
    }

    public orgNameToLocal (name: string): void {
        this.window.setLocal('organization', name);
    }

    public updateGtmContext (orgName: string, uuid?: string, email?: string) {
        const context = {
            'organization.name': orgName,
            'webapp.name': this.appName,
            'event': 'Push Context'
        };
        if (/^[^@]+@apigee.com/.test(email || '')) {
            context['user.internal'] = 'internal';
        }
        if (uuid) {
            context['user.uuid'] = uuid;
        }
        if (email) {
            context['user.email'] = email;
        }
        this.window.gtmContext(context);
    }

    public cookies (): Cookie[] {
        const docCookie = this.window.cookies();
        if (docCookie) {
            return docCookie.split(';').map(c => {
                const pair = c.split('=');
                if (pair.length >= 2) {
                    return { key: pair[0].trim(), value: pair[1].trim() };
                }
                return { key: c, value: c };
            });
        }
        return [];
    }

    public cookie (key: string): string {
        const c = this.cookies().find(cc => cc.key === key);
        if (c) {
            return c.value;
        }
    }

    public accessToken = (): string =>  this.cookie('access_token');

    public jwt = (): Jwt => new Jwt(this.accessToken());

    public getUser = (): string => this.jwt().user;

    public getUuid = (): string => this.jwt().uuid;
}
