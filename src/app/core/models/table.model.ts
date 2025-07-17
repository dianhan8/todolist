import { BehaviorSubject } from "rxjs";

export class SelectOption {
    label = new BehaviorSubject<string>('All');
    color = new BehaviorSubject<string>('#000000');
    backgroundColor = new BehaviorSubject<string>('#ffffff');

    constructor(label: string = 'All', color: string = '#000000', backgroundColor: string = '#ffffff') {
        this.label.next(label);
        this.color.next(color);
        this.backgroundColor.next(backgroundColor);
    }
}

export class TableColumnSort {
    field: string;
    direction: 'asc' | 'desc';

    constructor(field: string, direction: 'asc' | 'desc') {
        this.field = field;
        this.direction = direction;
    }
}

export class TableColumnFilter {
    field: string;
    value: unknown;

    constructor(field: string, value: unknown) {
        this.field = field;
        this.value = value;
    }
}

export class TableSort {
    sort = new BehaviorSubject<TableColumnSort[]>([]);

    setSort(sort: TableColumnSort[]) {
        this.sort.next(sort);
    }

    addSort(field: string, direction: 'asc' | 'desc' = 'asc') {
        const sort = new TableColumnSort(field, direction);
        this.sort.next([...this.sort.value, sort]);
    }

    updateSort(field: string, direction: 'asc' | 'desc') {
        const currentSort = this.sort.value.map(s => s.field === field ? new TableColumnSort(field, direction) : s);
        this.sort.next(currentSort);
    }

    removeSort(field: string) {
        const currentSort = this.sort.value.filter(s => s.field !== field);
        this.sort.next(currentSort);
    }

    clearSort() {
        this.sort.next([]);
    }

    applySorting<T>(data: T[], columns: TableColumn[]): T[] {
        const sortValue = this.sort.value;

        if (sortValue.length === 0) {
            return data;
        }

        return [...data].sort((a, b) => {
            for (const sortItem of sortValue) {
                const column = columns.find(col => col.field === sortItem.field);
                if (!column) continue;

                const aValue = (a as any)[sortItem.field];
                const bValue = (b as any)[sortItem.field];

                let comparison = 0;

                if (column.type === TableColumnType.Number) {
                    comparison = Number(aValue) - Number(bValue);
                } else if (column.type === TableColumnType.Date) {
                    comparison = new Date(aValue).getTime() - new Date(bValue).getTime();
                } else {
                    comparison = String(aValue).localeCompare(String(bValue));
                }

                if (comparison !== 0) {
                    return sortItem.direction === 'asc' ? comparison : -comparison;
                }
            }
            return 0;
        });
    }
}

export class TableFilter {
    filter = new BehaviorSubject<TableColumnFilter[]>([]);

    setFilter(filter: TableColumnFilter[]) {
        this.filter.next(filter);
    }

    clearFilter() {
        this.filter.next([]);
    }

    addFilter(field: string, value: unknown) {
        const filter = new TableColumnFilter(field, value);
        this.filter.next([...this.filter.value, filter]);
    }

    removeFilter(field: string) {
        const currentFilter = this.filter.value.filter(f => f.field !== field);
        this.filter.next(currentFilter);
    }

    updateFilter(field: string, value: unknown) {
        const currentFilter = this.filter.value.map(f => f.field === field ? new TableColumnFilter(field, value) : f);
        this.filter.next(currentFilter);
    }

    applyFilter<T>(data: T[], columns: TableColumn[]): T[] {
        const filterValue = this.filter.value;

        if (filterValue.length === 0) {
            return data;
        }

        return data.filter(item => {
            return filterValue.every(f => {
                const column = columns?.find(col => col.field === f.field);
                const itemValue = (item as any)[f.field];

                if (!column) return true;
                if (f.value === null || f.value === undefined || f.value === '') return true;


                if (column.type === TableColumnType.Text) {
                    return String(itemValue).toLowerCase().includes(String(f.value).toLowerCase());
                } else if (column.type === TableColumnType.Number) {
                    return Number(itemValue) === Number(f.value);
                } else if (column.type === TableColumnType.Date) {
                    return new Date(itemValue).toDateString() === new Date(f.value as string).toDateString();
                } else if (column.type === TableColumnType.Person) {
                    return itemValue.some((person: string) => person.toLowerCase().includes(String(f.value).toLowerCase()));
                } else {
                    return itemValue === f.value;
                }
            });
        });
    }
}

export class TableModel<T> {
    private _data: T[] = [];

    columns: TableColumn[];
    data: T[];

    tableSort = new TableSort();
    sortableColumns: TableColumn[] = [];

    tableFilter = new TableFilter();
    filterableColumns: TableColumn[] = [];

    getColumnData(field: string): any[] {
        return this._data.map(item => (item as any)[field])

    }

    getColumn(field: string): any {
        return this.columns.find(column => column.field === field) as any;
    }

    setColumns(columns: TableColumn[]) {
        this.columns = columns;
        this.sortableColumns = columns;
        this.filterableColumns = columns
            .filter(column => column.type === TableColumnType.Person);
    }

    setData(data: T[]) {
        this.data = data;
        this._data = data;
    }

    addData(data: T) {
        this._data.push(data);
        this.data = this.tableSort.applySorting(this._data, this.columns);
        this.data = this.tableFilter.applyFilter(this._data, this.columns);
    }

    search(value: string, field: string) {
        const lowerCaseValue = value.toLowerCase();
        this.data = this._data.filter(item => {
            const fieldValue = (item as any)[field];
            return String(fieldValue).toLowerCase().includes(lowerCaseValue);
        });
    }

    constructor() {
        this.columns = [];
        this.data = [];
        this._data = [];

        this.tableSort.sort
            .subscribe(sort => {
                this.sortableColumns = this.columns
                    .filter(column => !sort.some(s => s.field === column.field));
            });

        this.tableSort.sort
            .subscribe(sort => {
                this.data = this.tableSort.applySorting(this._data, this.columns);
            });

        this.tableFilter.filter
            .subscribe(filter => {
                this.filterableColumns = this.columns
                    .filter(column => column.type === TableColumnType.Person)
                    .filter(column => !filter.some(f => f.field === column.field));
            });

        this.tableFilter.filter
            .subscribe(filter => {
                this.data = this.tableFilter.applyFilter(this._data, this.columns);
            });
    }
}

export enum TableColumnType {
    Text = 'text',
    Number = 'number',
    Select = 'select',
    Date = 'date',
    Person = 'person',
}

export class TableColumn {
    title: string;
    field: string;
    type: TableColumnType;
    enabled: boolean;

    constructor(title: string, field: string, type: TableColumnType = TableColumnType.Text, enabled: boolean = true) {
        this.title = title;
        this.field = field;
        this.type = type;
        this.enabled = enabled;
    }
}

export class TableColumnSelect extends TableColumn {
    options: SelectOption[];

    constructor(title: string, field: string, options: SelectOption[], enabled: boolean = true) {
        super(title, field, TableColumnType.Select, enabled);
        this.options = options;
    }
}

export class TableColumnPerson extends TableColumn {
    options: string[];

    constructor(title: string, field: string, options: string[], enabled: boolean = true) {
        super(title, field, TableColumnType.Person, enabled);
        this.options = options;
    }
}