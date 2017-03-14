import { Location }         from '@angular/common';
import { SpyLocation }      from '@angular/common/testing';
import { TestBed }          from '@angular/core/testing';
import * as _               from 'lodash';
import { RolePermissions }  from 'rbac-abacus';
import { Observable }       from 'rxjs/Rx';

import {
    IRangeSnapshot,
    Repository }            from './repository';
import { Storage }          from './storage';
import { ValueStorage }     from './value-storage';
import { Client }           from '../client/client';
import { ClientMock }       from '../client/client.mock';
import { ObservableClient } from '../client/observable-client';
import {
    APP_CONFIG,
    IAppConfig }            from '../context/app-config';
import { ContextService }   from '../context/context';
import { ApiRoutes }        from '../router/api-routes';
import {
    WindowRef,
    WindowMock }            from '../window-ref';
import {GTMService} from '../context/gtm';

declare const beforeEach, describe, expect, it;

class SomeType {
    public combined: string;

    constructor(public value?: number, public name?: string) {
        if (!value) { this.value = 1; }
        if (!name) { this.name = `name${this.value}`; }
        this.combined = this.name + this.value;
    }
}

class SomeRawType {
    constructor(public value?: number, public name?: string) {
        if (!value) { this.value = 1; }
    }
}

class SomeTypeStorage extends Storage<SomeType> {

    constructor() {
        super();
    }

    protected matchType (matchFunction: (someType: SomeType) => boolean, someType: SomeType) {
        return matchFunction(someType);
    }

    protected getId (t: SomeType): string {
        return t.value.toString();
    }

    protected getValue (t: SomeType, prop: string): any {
        return t[prop];
    };

}

class SomeTypeValueStorage extends ValueStorage<SomeType> {

    constructor() {
        super();
    }

    protected matchType (matchFunction: (someType: SomeType) => boolean, someType: SomeType) {
        return matchFunction(someType);
    }

    protected getValue (t: SomeType, prop: string): any {
        return t[prop];
    };

}

class SomeTypeRepository extends Repository<SomeType> {
    public theProtectedClient: ObservableClient;
    constructor(theClient: ObservableClient, theBasePath: string, theStorage: SomeTypeStorage) {
        super(theClient, theBasePath, theStorage);
        this.theProtectedClient = this.client; // testing purposes
    }

    protected buildEntity (raw: SomeRawType, permissions: RolePermissions) {
        return new SomeType(raw.value, raw.name);
    }

}

class SomeObservableClient extends ObservableClient {

    constructor(theClient: Client, theRoutes: ApiRoutes) {
        super(theClient, theRoutes);
    }

    public getList <T>(): Observable<T[]> {
        return this.getListObject().map((response: any) => {
            if (response && _.isArray(response.sometype)) {
                return response.sometype;
            } else {
                return [];
            }
        });
    }
}
// TODO: this test is wrong! it should use mocks of repository.
describe('EntityRepository', () => {

    const apiBasePath = 'apiproducts';
    const appBasePath = 'products';
    const appName = 'ProductsSPA';
    let appConfig: IAppConfig = {
        apiBasePath: apiBasePath,
        appBasePath: appBasePath,
        gtmAppName: appName
    };
    let repository: SomeTypeRepository;
    let client;

    const initArray = (num: number): SomeType[] => {
        let rs: SomeType[] = [];
        for (let i = 1; i <= num; i += 1) {
            rs.push(new SomeType(i));
        }
        return rs;
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers:      [
                ContextService,
                GTMService,
                { provide: Location, useClass: SpyLocation} ,
                { provide: WindowRef, useClass: WindowMock },
                { provide: Client, useClass: ClientMock },
                { provide: APP_CONFIG, useValue: appConfig }
            ]
        });

        const service = TestBed.get(ContextService);
        const a = TestBed.get(APP_CONFIG);
        const loc = TestBed.get(Location);
        const router = new ApiRoutes(service, a.apiBasePath);
        client = TestBed.get(Client);

        loc.go(`/organizations/abc/${appBasePath}`);
        const o = new SomeObservableClient(client, router);
        repository = new SomeTypeRepository(o, a.apiBasePath, new SomeTypeStorage());
    });

    it('Subscription will emit latest data.', done => {
        client.on(`/organizations/abc/${apiBasePath}`, { sometype: []});

        let flag = 0;

        const firstCall =  (state: IRangeSnapshot<SomeType>) => {
            expect(state.count).toBe(0);
            expect(state.filteredCount).toBe(0);
            expect(state.from).toBe(-1);
            expect(state.to).toBe(0);
            expect(state.range).toBeDefined();
            expect(state.range.length).toBe(0);
            expect(state.error).toBeUndefined();
            expect(state.allowCreate).toBe(true);
            expect(state.allowRead).toBe(true);
            flag++;
        };

        const secondCall =  (state: IRangeSnapshot<SomeType>) => {
            expect(state.count).toBe(0);
            expect(state.filteredCount).toBe(0);
            expect(state.from).toBe(-1);
            expect(state.to).toBe(0);
            expect(state.range).toBeDefined();
            expect(state.range.length).toBe(0);
            expect(flag).toBe(1);
            expect(state.error).toBeUndefined();
            expect(state.allowCreate).toBe(true);
            expect(state.allowRead).toBe(true);
            done();
        };

        repository.subscribe(
                    (state: IRangeSnapshot<SomeType>) => {
                        if (flag === 0) {
                            firstCall(state);
                        } else {
                            secondCall(state);
                        }
                    },
                    (error) => {
                        expect(error).toBeUndefined();
                        done();
                    },
                    () => {
                        expect('should not complete').toBeUndefined();
                        done();
                    });
    });

    it('Service instance should not be initialized at beginning', () => {
        expect(repository.status).toBe('empty');
    });

    it('Fetching should change status, and complete loading should be updated once it finishes', done => {
        client.on(`/organizations/abc/${apiBasePath}`, { sometype: initArray(6) });
        let counts = [6, 6];
        let status = ['loading', 'loaded'];
        repository.subscribe(
            (state: IRangeSnapshot<SomeType>) => {
                expect(state.error).toBeUndefined();
                expect(counts.indexOf(state.count)).toBe(0);
                expect(status.indexOf(repository.status)).toBe(0);
                counts = counts.slice(1);
                status = status.slice(1);
                if (counts.length === 0) {
                    done();
                }
            },
            (error) => {
                expect(error).toBeUndefined();
                done();
            },
            () => {
                expect('should not complete').toBeUndefined();
                done();
            }
        );
    });

    it('Fetching should load entities', done => {
        client.on(`/organizations/abc/${apiBasePath}`, { sometype: initArray(6) });

        let counts = [6, 6];
        let tos = [6, 6];
        repository.subscribe(
            (state: IRangeSnapshot<SomeType>) => {
                expect(counts.indexOf(state.count)).toBe(0);
                expect(state.error).toBeUndefined();
                expect(tos.indexOf(state.to)).toBe(0);
                expect(state.allowCreate).toBe(true);
                expect(state.allowRead).toBe(true);
                counts = counts.slice(1);
                tos = tos.slice(1);
                if (counts.length === 0) {
                    done();
                }
            },
            (error) => {
                expect(error).toBeUndefined();
                done();
            },
            () => {
                expect('should not complete').toBeUndefined();
                done();
            }
        );
    });

    it('Does not load entities and updates permissions if the user does not have permissions', (done) => {
        const errorMessage = 'Forbidden. You don\'t have permissions to access this resource. Error code: 403';
        client.on('/users/dimitri@apigee.com/permissions', {
            resourcePermission: [ { organization: 'abc', path: '/', permissions: []} ]
        });
        client.on(`/organizations/abc/${apiBasePath}`, errorMessage, true);

        repository.subscribe(
            (state: IRangeSnapshot<SomeType>) => {
                expect(state.error).toBe(errorMessage);
                expect(state.allowCreate).toBe(false);
                expect(state.allowRead).toBe(false);
                expect(state.count).toBe(0);
                expect(state.filteredCount).toBe(0);
                expect(state.from).toBe(-1);
                expect(state.to).toBe(0);
                expect(state.range).toBeDefined();
                expect(state.range.length).toBe(0);
                done();
            },
            (error) => {
                expect(error).toBeUndefined();
                done();
            },
            () => {
                expect('should not complete').toBeUndefined();
                done();
            }
        );
    });

    it('Delete entity.', done => {
        const types = [];
        types.push(new SomeRawType(1, 'name1'));
        types.push(new SomeRawType(2, 'name2'));
        types.push(new SomeRawType(3, 'name3'));
        types.push(new SomeRawType(4, 'other4'));
        types.push(new SomeRawType(5, 'other5'));
        types.push(new SomeRawType(6, 'other6'));
        client.on(`/organizations/abc/${apiBasePath}`, { sometype: types});
        client.on(`/organizations/abc/${apiBasePath}/1`, types[0]);
        client.on(`/organizations/abc/${apiBasePath}/2`, types[1]);
        client.on(`/organizations/abc/${apiBasePath}/3`, types[2]);
        let counter = -1;

        repository.subscribe(
            (state: IRangeSnapshot<SomeType>) => {
                expect(state.error).toBeUndefined();
                counter += 1;
                switch (counter) {
                    case 0:
                        // First emission
                        expect(state.count).toBe(6);
                        expect(state.filteredCount).toBe(6);
                        break;
                    case 1:
                        // All developers are loaded
                        expect(state.count).toBe(6);
                        expect(state.filteredCount).toBe(6);
                        repository.delete('1');
                        break;
                    case 2:
                        // Expecting that the developer with regular name is deleted
                        expect(state.count).toBe(5);
                        expect(state.filteredCount).toBe(5);
                        repository.delete('2');
                        break;
                    case 3:
                        // Expecting that the developer with spaces in the name is deleted
                        expect(state.count).toBe(4);
                        expect(state.filteredCount).toBe(4);
                        repository.delete('3');
                        break;
                    case 4:
                        // Expecting that the developer with percentage in the name is deleted
                        expect(state.count).toBe(3);
                        expect(state.filteredCount).toBe(3);
                        repository.filterBy('name');
                        break;
                    case 5:
                        // Expecting that any of the deleted devs are there anymore
                        expect(state.count).toBe(3);
                        expect(state.filteredCount).toBe(0);
                        done();
                        break;
                    default:
                        expect('Should not enter default case').toBeUndefined();
                        done();
                }

            },
            (error) => {
                expect(error).toBeUndefined();
                done();
            },
            () => {
                expect('should not complete').toBeUndefined();
                done();
            }
        );
    });

    it('Sorts entity', done => {
        client.on(`/organizations/abc/${apiBasePath}`, { sometype: initArray(6) });
        let counter = -1;
        repository.subscribe(
            (state: IRangeSnapshot<SomeType>) => {
                counter += 1;
                expect(state.error).toBeUndefined();
                switch (counter) {
                    case 0:
                        // First emission.
                        expect(repository.sortByField).toBe(undefined);
                        expect(repository.sortByOrder).toBe('asc');
                        break;
                    case 1:
                        // Should receive products unsorted, ascending order. Then order descending.
                        expect(repository.sortByField).toBe(undefined);
                        expect(repository.sortByOrder).toBe('asc');
                        repository.sortBy(undefined, 'desc');
                        break;
                    case 2:
                        // Should receive products unsorted, descending order. Then sort by modified date.
                        expect(repository.sortByField).toBeUndefined();
                        expect(repository.sortByOrder).toBe('desc');
                        repository.sortBy('name', undefined);
                        break;
                    case 3:
                        // Should receive products sorted by modification date, ascending order
                        expect(repository.sortByField).toBe('name');
                        expect(repository.sortByOrder).toBe('asc');
                        done();
                        break;
                    default:
                        expect('Should not enter default case').toBeUndefined();
                        done();
                        break;
                }

            },
            (error) => {
                expect(error).toBeUndefined();
                done();
            },
            () => {
                expect('should not complete').toBeUndefined();
                done();
            }
        );
    });

    it('Filter entities.', done => {
        const types: SomeType[] = [];
        types.push(new SomeType(1, 'name1'));
        types.push(new SomeType(2, 'name1'));
        types.push(new SomeType(3, 'name2'));
        types.push(new SomeType(4, 'odd'));
        types.push(new SomeType(5, 'name2'));
        types.push(new SomeType(6, 'name1'));
        client.on(`/organizations/abc/${apiBasePath}`, { sometype: types });
        let counter = -1;
        repository.subscribe(
            (state: IRangeSnapshot<SomeType>) => {
                counter += 1;
                expect(state.error).toBeUndefined();
                switch (counter) {
                    case 0:
                        // First emission.
                        expect(repository.filterField).toBe('*');
                        expect(repository.filterString).toBe('');
                        expect(state.count).toBe(6);
                        expect(state.filteredCount).toBe(6);
                        break;
                    case 1:
                        // Should receive all entities with unaltered filters.
                        expect(repository.filterField).toBe('*');
                        expect(repository.filterString).toBe('');
                        expect(state.count).toBe(6);
                        expect(state.filteredCount).toBe(6);
                        repository.filterBy('name');
                        break;
                    case 2:
                        // Should receive entities filtered by 'name' string on all fields.
                        expect(repository.filterField).toBe('*');
                        expect(repository.filterString).toBe('name');
                        expect(state.count).toBe(6);
                        expect(state.filteredCount).toBe(5);
                        repository.filterBy('name2', 'name');
                        break;
                    case 3:
                        // Should receive entities filtered by 'name2' string only on name field
                        expect(repository.filterField).toBe('name');
                        expect(repository.filterString).toBe('name2');
                        expect(state.count).toBe(6);
                        expect(state.filteredCount).toBe(2);
                        repository.filterBy();
                        break;
                    case 4:
                        // Should remove all filters
                        expect(repository.filterField).toBe('*');
                        expect(repository.filterString).toBe('');
                        expect(state.count).toBe(6);
                        expect(state.filteredCount).toBe(6);
                        done();
                        break;
                    default:
                        expect('Should not enter default case').toBeUndefined();
                        done();
                        break;
                }
            },
            (error) => {
                expect(error).toBeUndefined();
                done();
            },
            () => {
                expect('should not complete').toBeUndefined();
                done();
            }
        );
    });

    it('Getting a range of entities.', done => {
        client.on(`/organizations/abc/${apiBasePath}`, { sometype: initArray(65) });
        let counter = -1;

        repository.subscribe(
            (state: IRangeSnapshot<SomeType>) => {
                counter += 1;
                expect(state.error).toBeUndefined();
                switch (counter) {
                    case 0:
                        // First emission.
                        expect(state.count).toBe(65);
                        expect(state.filteredCount).toBe(65);
                        expect(state.range.length).toBe(25);
                        expect(state.from).toBe(0);
                        expect(state.to).toBe(25);
                        expect(state.range[0].name).toBe('name1');
                        expect(state.range[24].name).toBe('name25');
                        break;
                    case 1:
                        // Should receive all products
                        expect(state.count).toBe(65);
                        expect(state.filteredCount).toBe(65);
                        expect(state.range.length).toBe(25);
                        expect(state.from).toBe(0);
                        expect(state.to).toBe(25);
                        expect(state.range[0].name).toBe('name1');
                        expect(state.range[24].name).toBe('name25');
                        repository.setRange(25, 50);
                        break;
                    case 2:
                        // Should receive products from 25 to 50
                        expect(state.count).toBe(65);
                        expect(state.filteredCount).toBe(65);
                        expect(state.range.length).toBe(25);
                        expect(state.from).toBe(25);
                        expect(state.to).toBe(50);
                        expect(state.range[0].name).toBe('name26');
                        expect(state.range[24].name).toBe('name50');
                        repository.setRange(50, 75);
                        break;
                    case 3:
                        // Should receive products from 51 to 65
                        expect(state.count).toBe(65);
                        expect(state.filteredCount).toBe(65);
                        expect(state.range.length).toBe(15);
                        expect(state.from).toBe(50);
                        expect(state.to).toBe(65);
                        expect(state.range[0].name).toBe('name51');
                        expect(state.range[14].name).toBe('name65');
                        repository.setRange(-5, 25);
                        break;
                    case 4:
                        // Should remove all filters
                        expect(state.count).toBe(65);
                        expect(state.filteredCount).toBe(65);
                        expect(state.range.length).toBe(25);
                        expect(state.from).toBe(0);
                        expect(state.to).toBe(25);
                        done();
                        break;
                    default:
                        expect('Should not enter default case').toBeUndefined();
                        done();
                        break;
                }
            },
            (error) => {
                expect(error).toBeUndefined();
                done();
            },
            () => {
                expect('should not complete').toBeUndefined();
                done();
            }
        );
    });

    it('Subclasses can access client', () => {
        const cl = repository.theProtectedClient;
        expect(cl).toBeDefined();
        expect(cl.createEntity).toBeDefined();
    });
});
