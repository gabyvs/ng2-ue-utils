import { Jwt } from './jwt';
import { WindowRef } from '../window-ref';

export class Cookie {
    constructor(public key: string, public value: string) {}
}

/**
 * This service is used to get the user context in which an SPA is being used.
 * Note: If your SPA is organization based, you might want to use Context service instead.
 *
 * Ideally, it should be included as part of your providers in your app.component file so all the application has access to it.
 * Its dependencies must be provided in app.component as well.
 * So, your app.component.ts should look something like this
 *
 * ```
 * import { Location } from '@angular/common';
 * import { Component } from '@angular/core';
 * import { HTTP_PROVIDERS } from '@angular/http';
 * import { APP_CONFIG, ContextService, Client, IAppConfig, WindowRef } from 'ng2-ue-utils';
 *
 * import { MyMainComponent } from './route/to/myMainComponent';
 *
 * const appConfig: IAppConfig = {
 *   apiBasePath: 'myapibasepath',
 *   appBasePath: 'myappbasepath',
 *   gtmAppName: 'nameforgoogletagmanager'
 * };
 *
 * @Component({
 *   directives: [
 *       MyMainComponent
 *   ],
 *   providers: [
 *       ContextHelper,
 *       WindowRef,
 *       { provide: APP_CONFIG, useValue: appConfig }
 *   ],
 *   selector: 'app',
 *   template: '<myMainComponent-or-routerOutlet></myMainComponent-or-routerOutlet>'
 * })
 * export class AppComponent {}
 * ```
 *
 * The most common usage for this service is to set the context of the user for GTM.
 * To do that create it in the component or service constructor and use it as follows
 *
 * ```
 *  constructor (
 *      @Inject(APP_CONFIG) appConfig: IAppConfig,
 *      window: WindowRef) {
 *          this.helper = new ContextHelper(window, appConfig.gtmAppName);
 *      }
 *
 *  // to be called in a good place on your flow
 *  private setContext () {
 *      const userName = this.helper.getUser();
 *      const userId = this.helper.getUuid();
 *      this.helper.updateGtmContext('', userId, userName);
 *  }
 * ```
 *
 */
export class ContextHelper {
    constructor(private window: WindowRef, private gtmAppName: string) {}

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

    public updateGtmContext (orgName?: string, uuid?: string, email?: string) {
        const context = {
            'organization.name': orgName,
            'webapp.name': this.gtmAppName,
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
