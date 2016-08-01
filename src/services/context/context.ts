import { Inject, Injectable, OpaqueToken } from '@angular/core';
import { Location } from '@angular/common';
import 'rxjs/Rx';

import { ContextHelper } from './context-helper';
import { Client } from '../client/client';
import { WindowRef } from '../window-ref';

export const GTM_APP_NAME = new OpaqueToken('GTMAppName');
export const APP_BASEPATH = new OpaqueToken('AppBasepath');

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

@Injectable()
export class ContextService {
    private _orgName: string;
    private helper: ContextHelper;

    constructor(
        private location: Location,
        private client: Client,
        @Inject(APP_BASEPATH) private basepath,
        window: WindowRef,
        @Inject(GTM_APP_NAME) appName) {
        this.helper = new ContextHelper(window, appName);
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
            this.helper.updateGtmContext(orgFromUrl, userId, userName);
            return new Context(orgFromUrl);
        }

        // If no org is the URL, try to get it from Local Storage
        const orgFromLocalStorage = this.helper.orgNameFromLocal();
        if (orgFromLocalStorage) {
            // Redirect to the org:
            const newPath = `/organizations/${orgFromLocalStorage}/${this.basepath}`;
            this.helper.updateGtmContext(orgFromLocalStorage, userId, userName);
            this.location.go(newPath);
            return new Context(orgFromLocalStorage);
        }

        if (userName) {
            // do something to get the list of orgs
            //this.http.get('/users/_me/userroles');
            this.client.get<any>(`/users/${userName}/userroles`).subscribe(
                roles => {
                    if (roles && roles.role && roles.role[0] && roles.role[0].organization) {
                        const oName = roles.role[0].organization;
                        const newPath = `/organizations/${oName}/${this.basepath}`;
                        this.helper.updateGtmContext(oName);
                        this.location.go(newPath);
                        return;
                    }
                    // TODO: send this as an AX event instead of to the console once angulartics is here
                    console.log('User has no organizations associated.', roles.role);
                },
                error => {
                    // TODO: send this as an AX event instead of to the console once angulartics is here
                    console.log('Error on loading user roles:', error);
                }
            );
            // If no org can be used, redirect to NoOrg page.
            return new EmptyContext();
        }

        // Was not possible to retrieve neither the user nor the org.
        // Redirect to Login page. Use HTTP client to force redirection.
        // add headers for SSO, seems not doing so is causing a redirection issue.
        this.client.get('/userinfo').subscribe(() => {
            console.log('Client call to force redirection.');
        });

        return new EmptyContext();
    }

    public get orgName(): string {
        if (this._orgName) {
            return this._orgName;
        }
        this._orgName = this.getContext().orgName;
        return this._orgName;
    }
}
