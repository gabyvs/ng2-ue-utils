import * as _ from 'lodash';
import { RolePermissions } from 'rbac-abacus';
import { PartialObserver } from 'rxjs/Observer';
import { Observer, Observable, Subject } from 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';

import { IClientEvent } from '../client/clientObserver';
import { ObservableClient } from '../client/observable-client';
import { Storage, SetOrder } from '../storage/storage';

export type RepositoryStatus = 'empty' | 'loading' | 'loaded' | 'error';

export interface IRangeSnapshot<T> {
    count: number;
    error?: any;
    filteredCount: number;
    from: number;
    to: number;
    range: T[];
    allowRead?: boolean;
    allowCreate?: boolean;
}

export abstract class Repository<T> extends Observable<IRangeSnapshot<T>> {
    private end: number;
    private latest: IRangeSnapshot<T>;
    private observers: Observer<IRangeSnapshot<T>>[];
    private start: number;
    private _status: RepositoryStatus;
    private _permissions: RolePermissions;
    public storage: Storage<T>;
    protected abstract buildEntity (raw: any, permissions?: RolePermissions): T;
    protected abstract getId (t: T): string;

    constructor(private client: ObservableClient, public basePath: string) {
        super(obs => {
            this.observers.push(obs);
            return () => {
                _.remove(this.observers, obs);
            };
        });
        this.observers = [];
        this.storage = new Storage<T>(this.getId, this.getValue);
        this.start = -1;
        this.end = 0;
        this.latest = {
            count: 0,
            filteredCount: 0,
            from: -1,
            range: [],
            to: 0
        };

        this._status = 'empty' as RepositoryStatus;
    }

    // this is the default implementation
    protected getValue = (t: T, prop: string): any => {
        return t[prop];
    };

    private loadFromClient = (): void => {
        this.client.getList()
            .subscribe(
                (rawEntities: any[]) => {
                    if (this.start < 0 && rawEntities.length > 0) {
                        this.start = 0;
                        this.end = 25;
                    }
                    const entities: T[] = rawEntities.map((r) => {
                        return this.buildEntity(r, this._permissions);
                    });
                    this.storage.bulkAppend(entities);
                    this.doNext();
                },
                error => {
                    this._status = 'error' as RepositoryStatus;
                    this.doNext(error);
                },
                () => {
                    this._status = 'loaded' as RepositoryStatus;
                    this.doNext();
                }
            );
    };

    private doNext = (error?: any): void => {
        if (error) {
            this.doError(error);
            return;
        }
        this.permissions().subscribe(
            permissions => {
                const range = this.storage.range(this.start, this.end);
                const ops = permissions ? permissions.allowsOperations(`/${this.basePath}`) : [];
                this.latest = {
                    allowCreate: ops.indexOf('put') >= 0,
                    allowRead: ops.indexOf('get') >= 0,
                    count: this.collectionCount,
                    filteredCount: this.filteredCount,
                    from: this.start,
                    range: range,
                    to: Math.max(this.start + range.length, 0)
                };
                this.doEmit();
            },
            err => this.doError(err)
        );
    };

    private doError = (error: any): void => {
        const latest = {
            allowCreate: undefined,
            allowRead: undefined,
            count: this.latest.count,
            error: error,
            filteredCount: this.latest.filteredCount,
            from: this.latest.from,
            range: this.latest.range,
            to: this.latest.to
        };
        this.permissions().subscribe(
            permissions => {
                const ops = permissions ? permissions.allowsOperations(`/${this.basePath}`) : [];
                latest.allowCreate = ops.indexOf('put') >= 0;
                latest.allowRead = ops.indexOf('get') >= 0;
                this.latest = latest;
            },
            err => this.latest = latest,
            () => {
                this.doEmit();
            }
        );
    };

    private doEmit = (): void => {
        this.observers.forEach(obs => {
            obs.next(this.latest);
        });
    };

    private load = (): void => {
        if (this._status !== 'empty' as RepositoryStatus) {
            return;
        }
        this._status = 'loading' as RepositoryStatus;
        this.permissions().subscribe(
            permissions => {
                this.loadFromClient();
            },
            error => {
                this._status = 'error' as RepositoryStatus;
                this.doNext(error);
            }
        );
    };

    private permissions = (): Observable<RolePermissions> => {
        if (!this._permissions) {
            return this.client.permissions().do( permissions => { this._permissions = permissions; });
        }
        return Observable.of<RolePermissions>(this._permissions);
    };

    public get status(): RepositoryStatus {
        return this._status;
    }

    public get filteredCount(): number {
        return this.storage.filteredCount;
    }

    public get collectionCount(): number {
        return this.storage.count;
    }

    public get filterString(): string {
        return this.storage.filter;
    }

    public get filterField(): string {
        return this.storage.filterByField;
    }

    public get sortByOrder(): SetOrder {
        return this.storage.sortByOrder;
    }

    public get sortByField(): string {
        return this.storage.sortByField;
    }

    public filterBy = (pattern?: string, field?: string): void => {
        if (this.filterString === pattern && this.filterField === (field || '*')) {
            return;
        }
        this.storage.filterBy(pattern, field);
        this.doNext();
    };

    public sortBy = (field: string, order: SetOrder): void => {
        if (this.sortByField === field && this.sortByOrder === order) {
            return;
        }
        this.storage.sortBy(field, order);
        this.doNext();
    };

    public delete = (identifier: string): Observable<T> => {
        const s = new Subject<T>();
        const encodedName = encodeURIComponent(identifier);
        this.client.deleteEntity(encodedName).subscribe(
            (e) => {
                s.next(this.buildEntity(e, this._permissions));
                this.storage.remove(identifier);
            },
            (error) => {
                s.error(error);
                this.doNext(error);
            },
            () => {
                s.complete();
                this.doNext();
            }
        );
        return s;
    };

    public create = (rawEntity): void => {
        this.client.createEntity(rawEntity)
            .subscribe(
                (e) => {
                    this.storage.append(this.buildEntity(e, this._permissions));
                },
                (error) => {
                    this.doNext(error);
                },
                () => {
                    this.doNext();
                }
            );
    };

    public setRange = (start: number, end: number): void => {
        if (start < 0) { start = 0; }
        if (end < 0) { end = 0; }
        this.start = start;
        this.end = end;
        this.doNext();
    };

    public subscribe (
        observerOrNext?: PartialObserver<IRangeSnapshot<T>> | ((value: IRangeSnapshot<T>) => void),
        error?: (error: any) => void,
        complete?: () => void
    ): Subscription {
        const s = super.subscribe(observerOrNext, error, complete);
        this.load();
        return s;
    };

    public observe = (): Observable<IClientEvent> => this.client.observe();
}
