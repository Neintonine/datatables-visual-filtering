import {VisualFilter} from "./VisualFilter";
import {ColumnSettings, FilterEngine, FilterEngineFactory} from "./VisualFiltering";

export class FilterEngineHandler {
    private defaultFactory: FilterEngineFactory;
    private filter: VisualFilter;

    private filterEngines: Map<number, FilterEngine> = new Map();

    constructor(
        filter: VisualFilter,
        defaultFactory: FilterEngineFactory
    ) {
        this.filter = filter;
        this.defaultFactory = defaultFactory;
    }

    async addFilter(columnIndex: number, value: string) {
        const filter = this.getEngine(columnIndex);
        return filter.addFilter(value);
    }

    async removeFilter(columnIndex: number, value: string) {
        const filter = this.getEngine(columnIndex);
        return filter.removeFilter(value);
    }

    getEngine(columnIndex: number): FilterEngine {
        if (this.filterEngines.has(columnIndex)) {
            return this.filterEngines.get(columnIndex);
        }

        const filterEngine = this.createFilterEngine(columnIndex);
        this.filterEngines.set(columnIndex, filterEngine);
        return filterEngine;
    }

    private createFilterEngine(columnIndex: number): FilterEngine {
        const column = this.filter.validColumns.get(columnIndex).filter;

        let factory = this.defaultFactory;
        if (column) {
            factory = (<ColumnSettings>column).filterEngineFactory ?? this.defaultFactory;
        }

        return factory(this.filter, columnIndex);
    }
}