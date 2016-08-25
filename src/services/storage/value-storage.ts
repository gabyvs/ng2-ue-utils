import * as _ from 'lodash';
import { BaseStorage } from './base-storage';
import { List } from "~lodash/index";

// `List<T>` tells the lodash method `_.some()` which kind of collection to expect, in this case an array, which is
// described by the lodash interface `List`
export const createValuesFilter = <T>(pattern?: string, field?: string): (d: T) => boolean => {
    const fieldName = field === '*' ? undefined : field;
    if (!pattern && !fieldName) {
        return (d: T) => true;
    }
    if (!fieldName) {
        return <T extends List<T>>(d: T) => {
            return _.some(d, prop =>
                _.isUndefined(prop) ? false : prop.toString().toLowerCase().indexOf(pattern.toLocaleLowerCase()) >= 0);
        };
    }
    return <T extends List<T>>(d: T) => {
        const v = _.get(d, fieldName);
        return v ? v.toString().toLowerCase().indexOf(pattern.toLocaleLowerCase()) >= 0 : false;
    };
};

export abstract class ValueStorage<T> extends BaseStorage<T> {

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
        const filter = createValuesFilter(this.filter, this.filterByField);
        this.filtered = this.filter ? _.filter(this.entities, (p: T) => this.matchType(filter, p)) : this.entities;
        this.sort();
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
