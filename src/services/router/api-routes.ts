import { Inject, Injectable } from '@angular/core';

import { ContextService, APP_BASEPATH } from '../context/context';

@Injectable()
export class ApiRoutes {
    constructor (private context: ContextService, @Inject(APP_BASEPATH) public basePath) {};

    public get orgName(): string {
        return this.context.orgName;
    }

    public orgUrl = (path?: string): string => `/organizations/${this.orgName}${ path ? path : ''}`;

    public entity = (identifier: string): string => this.orgUrl(`/${this.basePath}/${identifier}`);

    public list = (): string => this.orgUrl(`/${this.basePath}`);

    public new = (): string => this.orgUrl(`/${this.basePath}`);

    public userInfo = (): string => '/userinfo';

    public userRoles = (user: string): string => `/users/${user}/userroles`;

    public orgRole = (role: string): string => this.orgUrl(`/userroles/${role}/permissions`);
}
