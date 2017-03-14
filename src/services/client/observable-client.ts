import { Observable } from 'rxjs/Rx';

import { IResourcePermissionsResponse, IResourcePermissions, RolePermissions } from 'rbac-abacus';
import { ClientObserver } from './clientObserver';
import { ApiRoutes } from '../router/api-routes';
import { Client } from './client';
import { ObservableClientBase } from './observable-client-base';

/**
 * This abstract class is designed for use with the `Repository` and `ApiRoutes` implementations provided in this 
 * library.  The provided methods are intended for use with the Repository class and the injected router exposes 
 * common API routes which are injected with Apigee/Google Edge `organization` context. Therefore, if your SPA does 
 * not make use of these integrations, then it may be more appropriate for you to use the included ObservableClientBase
 * class which does not implement the router and is more generic.
 * 
 * OPTIONAL: When extending this class in your SPA, you may inject and pass in the ClientObserver spy from this
 * library to your `super` call to ObservableClientBase.  Doing this will make a stream of IClientEvent emissions 
 * available in your application through which you can track the progress of calls made through this client.
 *
 * ### Simple Example
 *
 * Extend ObservableClient in your SPA-specific client class
 * ```
 * import { Injectable } from '@angular/core';
 * import { Client, ObservableClient, ClientObserver } from 'ng2-ue-utils';
 * import { Observable } from 'rxjs/Rx';
 * import { SampleEntitiesApiRoutes } from './path/to/sampleEntitiesApiRoutes';
 * import { IApisResponse, IRawProxy } from './path/to/responseInterfaces';
 * 
 * @Injectable(
 * export class ProxyClient extends ObservableClient {
 *     constructor (client: Client, protected router: SampleEntitiesApiRoutes, spy: ClientObserver) {
 *         super(client, router, spy);
 *     }
 * 
 *     public getList (): Observable<IRawProxy[]> {
 *         return this.getListObject<IApisResponse>().map(response => response || []);
 *     }
 *     
 *     public getEnvironments(): Observable<string[]> {
 *         const route: string = this.router.environments();
 *         return this.get<string[]>(route);
 *     }
 * }
 * ```
 */

interface IUserInfo {
    user_id: string;
    user_name: string;
    given_name: string;
    family_name: string;
    email: string;
    name: string;
}

export abstract class ObservableClient extends ObservableClientBase {

    constructor (client: Client, protected router: ApiRoutes, spy?: ClientObserver) {
        super(client, spy);
    }

    public abstract getList <T>(...callParams: any[]):  Observable<T[]>;

    private userInfo = (): Observable<IUserInfo> => this.get<IUserInfo>(this.router.userInfo());

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
        return this.userInfo()
            .flatMap((info: IUserInfo) => this.get<IResourcePermissionsResponse>(this.router.permissions(info.email))
                .map((response: IResourcePermissionsResponse) => {
                    response.resourcePermission = response.resourcePermission
                        .filter((p: IResourcePermissions) => p.organization === this.router.orgName);
                    return response;
                }))
            .map((response: IResourcePermissionsResponse) => new RolePermissions(response));
    };
}
