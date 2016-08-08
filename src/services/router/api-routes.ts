import { Inject, Injectable } from '@angular/core';

import { ContextService, APP_CONFIG, IAppConfig } from '../context/context';

@Injectable()
export class ApiRoutes {
    constructor (private context: ContextService, @Inject(APP_CONFIG) public appConfig: IAppConfig) {};

    public get orgName(): string {
        return this.context.orgName;
    }

    public orgUrl = (path?: string): string => `/organizations/${this.orgName}${ path ? path : ''}`;

    public entity = (identifier: string): string => this.orgUrl(`/${this.appConfig.apiBasePath}/${identifier}`);

    public list = (): string => this.orgUrl(`/${this.appConfig.apiBasePath}`);

    public new = (): string => this.orgUrl(`/${this.appConfig.apiBasePath}`);

    public userInfo = (): string => '/userinfo';

    public userRoles = (user: string): string => `/users/${user}/userroles`;

    public orgRole = (role: string): string => this.orgUrl(`/userroles/${role}/permissions`);
}
