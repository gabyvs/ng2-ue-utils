import * as _ from 'lodash';
import { Storage, createFilter } from './storage';

export abstract class StorageNonUnique<T> extends Storage<T> {

    protected entities: T[];
    
    constructor () {
        super();
        this.entities = [];
        this.filtered = [];
        this.ordered = [];
        this._sortByOrder = 'asc';
    }

    public get count(): number {
        return this.entities.length;
    }

    protected filterAndSort (): void {
        const filter = createFilter(this.filter, this.filterByField);
        this.filtered = this.filter ? _.filter(this.entities, (p: T) => this.matchType(filter, p)) : this.entities;
        this.sort();
    };

    public remove (identifier: number): void {
        delete this.entities.splice(identifier, 1);
        this.filterAndSort();
    };

    public append (entity: T): void {
        this.entities.push(entity);
        this.filterAndSort();
    };

    public bulkAppend (list: T[]): void {
        list.forEach(e => {
            this.entities.push(e);
        });
        this.filterAndSort();
    };
    
}
