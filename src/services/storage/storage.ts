import * as _ from 'lodash';
import { BaseStorage, IDictionary } from './base-storage';
import { Dictionary } from 'lodash';

// `Dictionary<T>` tells the lodash method `_.some()` which kind of collection to expect, in this case an object, which 
// is described by the lodash interface `Dictionary`
export const createDictionaryFilter = <T>(pattern?: string, field?: string): (d: T) => boolean => {
    const fieldName = field === '*' ? undefined : field;
    if (!pattern && !fieldName) {
        return (d: T) => true;
    }
    if (!fieldName) {
        return <T extends Dictionary<{}>>(d: T) => {
            return _.some(d, prop =>
                _.isUndefined(prop) ? false : prop.toString().toLowerCase().indexOf(pattern.toLocaleLowerCase()) >= 0);
        };
    }
    return <T extends Dictionary<{}>>(d: T) => {
        const v = _.get(d, fieldName);
        return _.isUndefined(v) ? false : v.toString().toLowerCase().indexOf(pattern.toLocaleLowerCase()) >= 0;
    };
};

export abstract class Storage<T> extends BaseStorage<T> {

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
        const filter = createDictionaryFilter(this.filter, this.filterByField);
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
