import { ValueStorage, createValuesFilter } from './value-storage';
import { sortableValue } from './base-storage';

declare const beforeEach, describe, expect, it;

class SomeType {
    public shouldMatch: boolean;

    constructor(public value?: number, public name?: string) {
        if (!value) { this.value = 1; }
        if (!name) { this.name = `name${this.value}`; }
    }

    public match = (filter: (d: SomeType) => boolean): boolean => {
        return this.shouldMatch;
    };
}

class SomeRawType {
    constructor(public value?: number, public name?: string) {
        if (!value) { this.value = 1; }
    }
}

class SomeTypeStorage extends ValueStorage<SomeType> {

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

class SomeOtherTypeStorage extends ValueStorage<SomeType> {

    constructor() {
        super();
    }

    protected matchType (matchFunction: (someType: SomeType) => boolean, someType: SomeType): boolean {
        return someType.match(matchFunction);
    }

    protected getValue (t: SomeType, prop: string): any {
        return t[prop];
    };

}

describe('StorageNonUnique', () => {
    let s;

    const initArray = (num: number): SomeType[] => {
        let rs: SomeType[] = [];
        for (let i = 1; i <= num; i += 1) {
            rs.push(new SomeType(i));
        }
        return rs;
    };

    beforeEach(() => {
        s = new SomeTypeStorage();
    });

    it('Sets are empty when created', () => {
        expect(s.count).toBe(0);
        expect(s.filteredCount).toBe(0);
        expect(s.sortByOrder).toBe('asc');
        expect(s.sortByField).toBeUndefined();
        expect(s.filter).toBe('');
        expect(s.filterByField).toBe('*');
    });

    it('Adds an entity', () => {
        const e = new SomeType();
        s.append(e);
        expect(s.count).toBe(1);
        expect(s.filteredCount).toBe(1);
        const r = s.range();
        expect(r.length).toBe(1);
        expect(r[0]).toBe(e);
    });

    it('Add the same entity should iterate the count', () => {
        const someType = new SomeType();
        s.append(someType);
        s.append(someType);
        expect(s.count).toBe(2);
        expect(s.filteredCount).toBe(2);
        const r = s.range();
        expect(r.length).toBe(2);
        expect(r[0]).toBe(someType);
        expect(r[1]).toBe(someType);
    });

    it('Add products with same name should iterate the count and keep both entities', () => {
        const p1 = new SomeType(1);
        const p2 = new SomeType(1);
        p2.name = p1.name;
        s.append(p1);
        s.append(p2);
        expect(s.count).toBe(2);
        expect(s.filteredCount).toBe(2);
        const r = s.range();
        expect(r.length).toBe(2);
        expect(r[0]).toBe(p1);
        expect(r[1]).toBe(p2);
    });

    it('Add bulk to prevent sorting and filtering on each append operation', () => {
        s.bulkAppend(initArray(6));
        let r = s.range();
        expect(s.count).toBe(6);
        expect(r[0].name).toBe('name1');
    });

    it('Sorting by default field', () => {
        s.bulkAppend(initArray(6));
        const range = s.range();
        expect(range[0].name).toBe('name1');
        expect(range[1].name).toBe('name2');
        expect(range[2].name).toBe('name3');
        expect(range[3].name).toBe('name4');
        expect(range[4].name).toBe('name5');
        expect(range[5].name).toBe('name6');
    });

    it('Order by should change sorting', () => {
        s.bulkAppend(initArray(6));
        let range = s.range();
        expect(range[0].name).toBe('name1');
        expect(range[5].name).toBe('name6');
        s.sortBy('name', 'desc');
        range = s.range();
        expect(range[0].name).toBe('name6');
        expect(range[5].name).toBe('name1');
    });

    it('Sort by should change sorting', () => {
        const rs: SomeType[] = [];
        for (let i = 1; i <= 6; i += 1) {
            rs.push(new SomeType(10 - i));
        }
        s.bulkAppend(rs);
        let range = s.range();
        // not sorted initially
        expect(range[1].name).toBe('name8');
        expect(range[4].name).toBe('name5');
        s.sortBy('name', 'asc');
        range = s.range();
        // sorted by name inverts them
        expect(range[1].name).toBe('name5');
        expect(range[4].name).toBe('name8');
        s.sortBy('name', 'desc');
        range = s.range();
        // sorted by name inverts them
        expect(range[1].name).toBe('name8');
        expect(range[4].name).toBe('name5');
    });

    it('Order twice the same way should not change sorting', () => {
        s.bulkAppend(initArray(6));
        s.sortBy(undefined, 'desc');
        const range1 = s.range();
        s.sortBy(undefined, 'desc');
        const range2 = s.range();
        expect(range1).toEqual(range2);
    });

    it('Sorting by numeric fields should not fail.', () => {
        s.bulkAppend(initArray(6));
        s.sortBy('value', 'desc');
        let range = s.range();
        expect(range[0].value).toBe(6);
        expect(range[1].value).toBe(5);
        expect(range[2].value).toBe(4);
        expect(range[3].value).toBe(3);
        expect(range[4].value).toBe(2);
        expect(range[5].value).toBe(1);
        s.sortBy('value', 'asc');
        range = s.range();
        expect(range[0].value).toBe(1);
        expect(range[1].value).toBe(2);
        expect(range[2].value).toBe(3);
        expect(range[3].value).toBe(4);
        expect(range[4].value).toBe(5);
        expect(range[5].value).toBe(6);
    });

    it('Filter by all fields (default)', () => {
        const rs: SomeType[] = [];
        rs.push(new SomeType(1, 'name1'));
        rs.push(new SomeType(2, 'name1'));
        rs.push(new SomeType(3, 'name2'));
        rs.push(new SomeType(4, 'odd'));
        rs.push(new SomeType(5, 'name2'));
        rs.push(new SomeType(6, 'name1'));
        s.bulkAppend(rs);
        let range = s.range();
        expect(range.length).toBe(6);
        expect(s.count).toBe(6);
        expect(s.filteredCount).toBe(6);
        s.filterBy('nam');
        range = s.range();
        expect(range.length).toBe(5);
        expect(s.count).toBe(6);
        expect(s.filteredCount).toBe(5);
        expect(range[0].name).toBe('name1');
        expect(range[2].name).toBe('name2');
        // Setting the filter twice should not change results
        s.filterBy('name');
        const r2 = s.range();
        expect(range).toEqual(r2);
    });

    it('Filter by specific field', () => {
        const rs: SomeType[] = [];
        rs.push(new SomeType(1, 'name1'));
        rs.push(new SomeType(2, 'name1'));
        rs.push(new SomeType(3, 'name2'));
        rs.push(new SomeType(4, 'odd'));
        rs.push(new SomeType(5, 'name2'));
        rs.push(new SomeType(6, 'name1'));
        s.bulkAppend(rs);

        // Set an field that will not match
        s.filterBy('somethingdifferent', 'name');
        let r = s.range();
        expect(s.count).toBe(6);
        expect(s.filteredCount).toBe(0);
        expect(r.length).toBe(0);

        // set a field that will match
        s.filterBy('name1', 'name');
        r = s.range();
        expect(s.filteredCount).toBe(3);
        expect(r.length).toBe(3);
        expect(r[0].name).toBe('name1');

        // set a field that doesn't exists
        s.filterBy('customValue', 'someOtherField');
        r = s.range();
        expect(s.filteredCount).toBe(0);
        expect(r.length).toBe(0);

        s.filterBy('nam');
        r = s.range();
        expect(s.filteredCount).toBe(5);
        expect(r.length).toBe(5);
        expect(r[0].name).toBe('name1');
        // remove all filters
        s.filterBy();
        r = s.range();
        expect(s.filteredCount).toBe(6);
        expect(r.length).toBe(6);
    });

    it('Slices ranges of elements', () => {
        s.bulkAppend(initArray(65));
        let r = s.range();
        expect(s.count).toBe(65);
        expect(s.filteredCount).toBe(65);
        expect(r.length).toBe(25);
        expect(r[0].name).toBe('name1');
        r = s.range(25, 65);
        expect(s.count).toBe(65);
        expect(s.filteredCount).toBe(65);
        expect(r.length).toBe(40);
        expect(r[0].name).toBe('name26');
        r = s.range();
        expect(s.count).toBe(65);
        expect(s.filteredCount).toBe(65);
        expect(r.length).toBe(25);
        expect(r[0].name).toBe('name1');
        r = s.range(45, 25);
        expect(s.count).toBe(65);
        expect(s.filteredCount).toBe(65);
        expect(r.length).toBe(0);
    });

    it('Index of first element with field equal to a value', () => {
        s.bulkAppend(initArray(10));
        expect(s.count).toBe(10);
        expect(s.indexOf('name', 'name4')).toBe(3);
    });

    it('Provides a custom match type function', () => {
        s = new SomeOtherTypeStorage();
        const theTypes = initArray(10);
        theTypes[0].shouldMatch = true;
        theTypes[1].shouldMatch = true;
        theTypes[2].shouldMatch = true;
        s.bulkAppend(theTypes);

        s.filterBy('whatever', 'anything here');
        let r = s.range();
        expect(s.count).toBe(10);
        expect(s.filteredCount).toBe(3);
        expect(r.length).toBe(3);
    });

    it('Index of works with custom matchers', () => {
        s = new SomeOtherTypeStorage();
        const theTypes = initArray(10);
        theTypes[0].shouldMatch = true;
        s.bulkAppend(theTypes);
        expect(s.indexOf('name', 'name4')).toBe(0);
    });

});

describe('Filters', () => {

    it('Create Filter with no parameters', () => {
        const f = createValuesFilter<number>();
        expect(f(Math.floor(Math.random() * 100))).toBe(true);
    });

    it('Create Filter with pattern', () => {
        const f = createValuesFilter<{ a?; some?; }>('some');
        expect(f({a: 'some'})).toBe(true);
        expect(f({a: 'another-some-thing'})).toBe(true);
        expect(f({some: 'som'})).toBe(false);
        expect(f({})).toBe(false);
    });

    it('Create Filter with pattern & field', () => {
        const f = createValuesFilter<{ a?; some?; b?; }>('some', 'b');
        expect(f({a: 'some'})).toBe(false);
        expect(f({b: 'some'})).toBe(true);
    });

    it('Filters are case insensitive', () => {
        const f = createValuesFilter<{ a?; some?; }>('some');
        expect(f({a: 'soMe'})).toBe(true);
        expect(f({a: 'another-someE-thing'})).toBe(true);
    });

    it('Use filter with Product', () => {
        const fr = createValuesFilter<SomeType>(new SomeType().name);
        const p = new SomeType();
        expect(fr(p)).toBe(true);
    });

});

describe('sortableValue', () => {
    it('Value from a lower case string should be the same string', () => {
        const s = 'string';
        expect(sortableValue(s)).toBe(s);
    });

    it('Value from a mixed case string should be the lowercase string', () => {
        const s = 'StriNg';
        expect(sortableValue(s)).toBe(s.toLowerCase());
    });

    it('Value from a number should be the same number', () => {
        const s = Math.floor(Math.random() * 100);
        expect(sortableValue(s)).toBe(s);
    });

    it('Value from an object should be the object string representation', () => {
        const s = {};
        expect(sortableValue(s)).toBe(s.toString().toLowerCase());
    });
});
