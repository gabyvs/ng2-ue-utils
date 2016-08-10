import { Observable } from 'rxjs/Rx';

import { IResourcePermissionsResponse, IRole, IRoleCollection, RolePermissions } from 'rbac-abacus';
import { IClientObserver, ClientObserver, ClientMethod, IClientEvent } from './clientObserver';
import { ApiRoutes } from '../router/api-routes';
import { Client } from './client';

interface IUserInfo {
    user_id: string;
    user_name: string;
    given_name: string;
    family_name: string;
    email: string;
    name: string;
}

export abstract class ObservableClient implements IClientObserver {
    protected spy: ClientObserver;

    constructor (protected client: Client, protected router: ApiRoutes) {
        this.spy = new ClientObserver();
    }

    public abstract getList <T>():  Observable<T[]>;

    private userInfo = (): Observable<IUserInfo> => this.get<IUserInfo>(this.router.userInfo());

    private userRoles = (): Observable<IRole[]> => {
        const org = this.router.orgName;
        return this.userInfo()
            .flatMap((info: IUserInfo) => this.get<IRoleCollection>(this.router.userRoles(info.email)))
            .map((col: IRoleCollection) => col.role.filter(r => r.organization === org));
    };

    public spyCall = <T>(method: ClientMethod, obs: Observable<T>): Observable<T> => {
        return this.spy.observeOn(method, obs);
    };

    public put = <T, U> (url: string, entity: U): Observable<T> => this.spyCall(
        'put',
        this.client.put<T, U>(url, entity)
    );

    public get = <T> (url: string): Observable<T> => this.spyCall(
        'get',
        this.client.get<T>(url)
    );

    public delete = <T> (url: string): Observable<T> => this.spyCall(
        'delete',
        this.client.delete<T>(url)
    );

    public post = <T, U> (url: string, entity: U): Observable<T> => this.spyCall(
        'post',
        this.client.post<T, U>(url, entity)
    );

    public updateEntity = <T, U>(identifier: string, entity: U): Observable<T> =>
        this.put<T, U>(this.router.entity(identifier), entity);

    public deleteEntity = <T>(identifier: string): Observable<T> =>
        this.delete<T>(this.router.entity(identifier));

    public createEntity = <T, U>(entity: U): Observable<T> =>
        this.post<T, U>(this.router.new(), entity);

    public getEntity = <T>(identifier: string): Observable<T> =>
        this.get<T>(this.router.entity(identifier));

    public getListObject = <T>(): Observable<T> =>
        this.get<T>(this.router.list());

    public permissions = (): Observable<RolePermissions> => {
        return this.userRoles()
            .flatMap((roles: IRole[]) => {
                if (roles.length < 1) {
                    throw Error('User is not part of this organization.');
                }
                const obs = roles.map(r => this.get<IResourcePermissionsResponse>(this.router.orgRole(r.name)));
                return Observable.combineLatest<IResourcePermissionsResponse[]>(obs);
            })
            .map(permArray => permArray.map(p => new RolePermissions(p)))
            .map(permArray =>
                permArray.reduce((prev, perm) => prev.merge(perm), new RolePermissions())
            ) as Observable<RolePermissions>;
    };

    public observe = (): Observable<IClientEvent> => this.spy.observe();
}
