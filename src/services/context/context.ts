import {
    Inject,
    Injectable }            from '@angular/core';
import { Location }         from '@angular/common';
import 'rxjs/Rx';

import {
    APP_CONFIG,
    IAppConfig }            from './app-config';
import { ContextHelper }    from './context-helper';
import { GTMService }       from './gtm';
import { WindowRef }        from '../window-ref';

/**
 * This interface is the one that your app should be implementing to configure main paths to your API and basepath for your app URL
 * appBasePath will be used to build the main URL for your root component
 * apiBasePath will be used to build API calls
 * gtmAppName will be used to identify your google tag manager configuration
 *
 * ### Example: api products.
 * You want your api calls going to /organizations/organizationname/apiproducts
 * You want your SPA to have /products as your root URL
 * You want gtm to identify your app as productsSPA
 * You will need to create your appConfig in your app.component file (see example of that file below)
 *
 * const appConfig: IAppConfig = {
 *   apiBasePath: 'apiproducts',
 *   appBasePath: 'products',
 *   gtmAppName: 'productsSPA'
 * };
 *
 */
export interface IContext {
    orgName: string;
}

export class Context implements IContext {
    constructor (private _orgName) {}
    public get orgName (): string { return this._orgName; }
}

class EmptyContext implements IContext {
    public get orgName (): string { return undefined; }
}

/**
 * This service is used to get the organization and user context in which an SPA is being used.
 * Note: If your SPA is not organization based, you might want to use ContextHelper instead.
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
 *  @NgModule({
 *   bootstrap:    [ MyMainComponent ],
 *   declarations: [
 *       MyMainComponent
 *   ],
 *   imports: [ Ng2UEUtilsModule ],
 *   providers: [
 *       HTTP_PROVIDERS,
 *       Location,
 *       Client,
 *       ContextService,
 *       WindowRef,
 *       { provide: APP_CONFIG, useValue: appConfig }
 *   ]
 * })
 * export class AppModule {}
 * ```
 *
 * The most common usage for it is to get the organization name inside a component.
 * To do that inject it in the component constructor and do
 *
 * ```
 * const org: string = this.context.orgName;
 * ```
 *
 */

@Injectable()
export class ContextService {
    private _orgName: string;
    private helper: ContextHelper;

    constructor(
        private location: Location,
        private window: WindowRef,
        private gtmService: GTMService,
        @Inject(APP_CONFIG) private appConfig: IAppConfig) {
            this.helper = new ContextHelper(window);
    }

    public getContext (): IContext {
        // get org from location

        const path = this.location.path();
        const orgFromUrl = this.helper.orgNameFromPath(path);
        const userName = this.helper.getUser();
        const userId = this.helper.getUuid();

        if (orgFromUrl) {
            // Ensure Local Storage is in sync with current selection
            this.helper.orgNameToLocal(orgFromUrl);
            this.gtmService.updateGtmContext(orgFromUrl, userId, userName);
            return new Context(orgFromUrl);
        }

        // If no org is the URL, try to get it from Local Storage
        const orgFromLocalStorage = this.helper.orgNameFromLocal();
        if (orgFromLocalStorage) {
            // Redirect to the org:
            const newPath = `/organizations/${orgFromLocalStorage}/${this.appConfig.appBasePath}`;
            this.gtmService.updateGtmContext(orgFromLocalStorage, userId, userName);
            this.location.go(newPath);
            return new Context(orgFromLocalStorage);
        }

        // If no org in Local Storage, redirecto to no-org page (alm-static)
        this.window.location('/no-org');
        return new EmptyContext();
    }

    public get orgName(): string {
        if (this._orgName) {
            return this._orgName;
        }
        this._orgName = this.getContext().orgName;
        return this._orgName;
    }

    public get userEmail(): string {
        return this.helper.getUser();
    }

    public get uuid(): string {
        return this.helper.getUuid();
    }

    public get sessionContext(): ContextHelper.ISessionContext {
        return this.helper.getSessionContext();
    }
}
