import * as _ from 'lodash';
import { Storage, IDictionary, createFilter } from './storage';

export abstract class StorageUnique<T> extends Storage<T> {

    protected entities: IDictionary<T>;
    
    constructor () {
        super();
        this.entities = {};
        this.filtered = [];
        this.ordered = [];
        this._sortByOrder = 'asc';
    }

    protected abstract getId (t: T): string;
    
    public get count(): number {
        return _.keys(this.entities).length;
    }

    protected filterAndSort (): void {
        const filter = createFilter(this.filter, this.filterByField);
        this.filtered = this.filter ?
            _.filter(this.entities, (p: T) => this.matchType(filter, p)) as T[] :
            _.values(this.entities) as T[];
        this.sort();
    };

    public remove (identifier: string): void {
        delete this.entities[identifier];
        this.filterAndSort();
    };

    public append (entity: T): void {
        this.entities[this.getId(entity)] = entity;
        this.filterAndSort();
    };

    public bulkAppend (list: T[]): void {
        list.forEach(e => {
            this.entities[this.getId(e)] = e;
        });
        this.filterAndSort();
    };

}
