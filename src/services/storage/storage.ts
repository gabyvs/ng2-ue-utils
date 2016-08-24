import * as _ from 'lodash';
import { Dictionary } from 'lodash';

export type SetOrder = 'asc' | 'desc';

interface IDictionary<T> {
    [index: string]: T;
}

// TODO: make this more legible
export const matcher = <T>(fieldName: string, value: any): (d: T) => boolean => {
    return <T extends Dictionary<{}>>(d: T) => {
        const v = _.get(d, fieldName);
        return v ? v === value : false;
    };
};

// TODO: make this more legible
export const createFilter = <T>(pattern?: string, field?: string): (d: T) => boolean => {
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
        return v ? v.toString().toLowerCase().indexOf(pattern.toLocaleLowerCase()) >= 0 : false;
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

export abstract class Storage<T> {
    protected entities: IDictionary<T>;
    protected filtered: T[];
    protected ordered: T[];

    protected filterString: string;
    protected filterField: string;
    protected _sortByField: string;
    protected _sortByOrder: SetOrder;

    protected abstract getId (t: T): string;
    protected abstract getValue (t: T, prop: string): any;
    protected abstract matchType (matchFunction: (d: T) => boolean, t: T): boolean;

    constructor () {
        this.entities = {} as IDictionary<T>;
        this.filtered = [];
        this.ordered = [];
        this._sortByOrder = 'asc';
    }

    private sort = (): void => {
        if (this.sortByField) {
            this.ordered = _.orderBy(this.filtered, (p: T) => sortableValue(this.getValue(p, this.sortByField)), this.sortByOrder);
        } else {
            this.ordered = this.filtered;
        }
    };

    private filterAndSort = (): void => {
        const filter = createFilter(this.filter, this.filterByField);
        this.filtered = this.filter ?
            _.filter(this.entities, (p: T) => this.matchType(filter, p)) as T[] :
            _.values(this.entities) as T[];
        this.sort();
    };

    public get count(): number {
        return _.keys(this.entities).length;
    }
    public get filteredCount(): number {
        return this.filtered.length;
    }
    public get sortByOrder(): SetOrder {
        return this._sortByOrder || 'asc';
    }

    public get sortByField(): string {
        return this._sortByField;
    }

    public sortBy = (field: string, order: SetOrder): void => {
        if (this._sortByField === field && this._sortByOrder === order) {
            return;
        }
        this._sortByField = field;
        this._sortByOrder = order;
        this.sort();
    };

    public get filter(): string {
        return this.filterString || '';
    }
    public get filterByField(): string {
        return this.filterField || '*';
    }

    public filterBy = (filter?: string, field?: string) => {
        if (this.filterString === filter && this.filterField === field) {
            return;
        }
        this.filterString = filter;
        this.filterField = field;
        this.filterAndSort();
    };

    public remove = (identifier: string): void => {
        delete this.entities[identifier];
        this.filterAndSort();
    };

    public append = (entity: T): void => {
        this.entities[this.getId(entity)] = entity;
        this.filterAndSort();
    };

    public bulkAppend = (list: T[]): void => {
        list.forEach(e => {
            this.entities[this.getId(e)] = e;
        });
        this.filterAndSort();
    };

    public range = (start: number = 0, end: number = 25): T[] => {
        return this.ordered.slice(start, end);
    };

    public indexOf = (fieldName: string, value: any): number => {
        const m = matcher<T>(fieldName, value);
        return _.findIndex(this.ordered, (t: T) => this.matchType(m, t));
    };

}
