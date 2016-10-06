import * as _ from 'lodash';
import { Dictionary } from 'lodash';

export type SetOrder = 'asc' | 'desc';

export interface IDictionary<T> {
    [index: string]: T;
}

// TODO: make this more legible
export const matcher = <T>(fieldName: string, value: any): (d: T) => boolean => {
    return <T extends Dictionary<{}>>(d: T) => {
        const v = _.get(d, fieldName);
        return v ? v === value : false;
    };
};

export const sortableValue = (d: string | number | {}): string | number => {
    if (_.isString(d)) {
        return (d as string).toLowerCase();
    }
    if (_.isNumber(d)) {
        return d as number;
    }
    return d.toString().toLowerCase();
};

export abstract class BaseStorage <T> {

    protected entities: IDictionary<T> | T[];
    protected filtered: T[];
    protected ordered: T[];

    protected filterString: string;
    protected filterField: string;
    protected _sortByField: string;
    protected _sortByOrder: SetOrder;
    public count: number;
    
    protected abstract getValue (t: T, prop: string): any;
    protected abstract matchType (matchFunction: (d: T) => boolean, t: T): boolean;
    public abstract append (entity: T): void;
    public abstract bulkAppend (list: T[]): void;
    protected abstract filterAndSort (): void;

    public get sortByField(): string {
        return this._sortByField;
    }
    public get sortByOrder(): SetOrder {
        return this._sortByOrder || 'asc';
    }

    public get filter(): string {
        return this.filterString || '';
    }
    public get filterByField(): string {
        return this.filterField || '*';
    }
    public get filteredCount(): number {
        return this.filtered.length;
    }
    
    protected sort (): void {
        if (this.sortByField) {
            this.ordered = _.orderBy(this.filtered, (p: T) => sortableValue(this.getValue(p, this.sortByField)), this.sortByOrder);
        } else {
            this.ordered = this.filtered;
        }
    };

    public sortBy (field: string, order: SetOrder): void {
        if (this._sortByField === field && this._sortByOrder === order) {
            return;
        }
        this._sortByField = field;
        this._sortByOrder = order;
        this.sort();
    };

    public filterBy (filter?: string, field?: string): void {
        if (this.filterString === filter && this.filterField === field) {
            return;
        }
        this.filterString = filter;
        this.filterField = field;
        this.filterAndSort();
    };

    public range (start: number = 0, end: number = 25): T[] {
        return this.ordered.slice(start, end);
    };

    public indexOf (fieldName: string, value: any): number {
        const m = matcher<T>(fieldName, value);
        return _.findIndex(this.ordered, (t: T) => this.matchType(m, t));
    };

}
