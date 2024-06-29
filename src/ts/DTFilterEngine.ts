import {FilterEngine} from "./VisualFiltering";
import {VisualFilter} from "./VisualFilter";

export class DTFilterEngine implements FilterEngine {
    private selectedFilters: Set<string> = new Set<string>();

    constructor(
        private filter: VisualFilter,
        private columnIndex: number,
        private filterMethod: 'exact'|'includes' = 'includes'
    ) { }

    addFilter(value: string): void {
        if (!this.filter.datasetHandler.hasValue(this.columnIndex, value)) {
            throw new Error(`Can't add filter for column ${this.columnIndex}, since the value '${value}' is not available`);
        }

        if (this.selectedFilters.has(value)) {
            return;
        }

        this.selectedFilters.add(value);
        this.applyFilters();
    }


    getFilterValues(): Set<string> {
        return this.selectedFilters;
    }

    removeFilter(value: string): void {
        if (!this.filter.datasetHandler.hasValue(this.columnIndex, value)) {
            throw new Error(`Can't remove filter for column ${this.columnIndex}, since the value '${value}' is not available`);
        }

        if (!this.selectedFilters.has(value)) {
            return;
        }

        this.selectedFilters.delete(value);
        this.applyFilters();
    }

    private applyFilters(): void {
        const column = this.filter.tableAPI.column(this.columnIndex);

        this.filter.iconHandler.setValue(this.columnIndex, this.selectedFilters.size);

        const filters = Array.from(this.selectedFilters).map((filter: string) => {
            return filter.replaceAll('(', '\\(')
                .replaceAll(')', '\\)')
        });
        const regex = this.getFilterRegex(filters);

        column.search(regex, true, false, true);

        this.filter.tableAPI.draw();
    }

    private getFilterRegex(filters: string[]) {
        if (filters.length < 1) {
            return '';
        }

        if (this.filterMethod === 'exact') {
            const regexSelector = filters.join('|');
            return `^(${regexSelector})$`;
        }

        if (this.filterMethod === 'includes') {
            const regexFilters = filters.map(filter => filter + '(?!.)');
            return regexFilters.join('|');
        }

        return '';
    }
}