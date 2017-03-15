import { ContextService } from '../context/context';

export class ApiRoutes {
    constructor (private context: ContextService, public apiBasePath: string) {};

    public get orgName(): string {
        return this.context.orgName;
    }

    public orgUrl = (path?: string): string => `/organizations/${this.orgName}${ path ? path : ''}`;

    public entity = (identifier: string): string => this.orgUrl(`/${this.apiBasePath}/${identifier}`);

    public list = (): string => this.orgUrl(`/${this.apiBasePath}`);

    public new = (): string => this.orgUrl(`/${this.apiBasePath}`);

    public userInfo = (): string => '/userinfo';

    public userRoles = (user: string): string => `/users/${user}/userroles`;

    public orgRole = (role: string): string => this.orgUrl(`/userroles/${role}/permissions`);
    
    public permissions = (email: string) => `/users/${email}/permissions`;
}
