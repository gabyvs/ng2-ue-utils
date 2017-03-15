import { Jwt } from './jwt';
import { WindowRef } from '../window-ref';

export class Cookie {
    constructor(public key: string, public value: string) {}
}

/**
 * This service is used to get the user context in which an SPA is being used.
 * Note: If your SPA is organization based, you might want to use Context service instead.
 *
 * You can use it in any of your components, and its dependencies must be provided in app.module as well.
 * So, your app.module.ts should look something like this
 *
 * ```
 * @NgModule({
 *   bootstrap:    [ MyMainComponent ],
 *   declarations: [
 *       MyMainComponent
 *   ],
 *   imports: [ Ng2UEUtilsModule ],
 *   providers: [
 *       WindowRef
 *   ]
 * })
 * export class AppModule {}
 * ```
 */
export class ContextHelper {
    constructor(private window: WindowRef) {}

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

    public getUser = (): string => {
        return this.getSessionContext().email;
    };

    public getUuid = (): string => {
        return this.getSessionContext().uuid;

    };

    public getSessionContext = (): ContextHelper.ISessionContext => {
        let cookieContext = this.sessionContext();
        if (cookieContext) {
            return JSON.parse(atob(cookieContext));
        } else if (this.accessToken()) {
            return {
                email: this.jwt().user,
                uuid: this.jwt().uuid
            };
        } else {
            return {
                email: '',
                uuid: ''
            };
        }
    };

    private sessionContext = (): string =>  this.cookie('session_context');

    private accessToken = (): string =>  this.cookie('access_token');

    private jwt = (): Jwt => new Jwt(this.accessToken());
}

export namespace ContextHelper {
    'use strict';

    export interface ISessionContext {
        uuid: string;
        email: string;
    }
}
