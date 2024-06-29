import {VisualFilter} from "./VisualFilter";
import {
    ColumnSettings,
    DatasetProvider,
    DatasetProviderFactory,
    FakeDTColumn
} from "./VisualFiltering";

export class DatasetHandler {
    private filter: VisualFilter;
    private defaultFactory: DatasetProviderFactory;

    private datasetProviders: Map<number, DatasetProvider>;

    constructor(filter: VisualFilter, factory: DatasetProviderFactory) {
        this.filter = filter;
        this.defaultFactory = factory;

        this.prepareDatasets();
    }

    async getEntries(columnIndex: number): Promise<Set<string>> {
        if (!this.datasetProviders.has(columnIndex)) {
            throw new Error(`Dataset provider not found: ${ columnIndex }`);
        }

        return this.datasetProviders.get(columnIndex).getEntries(this.filter);
    }

    async hasValue(columnIndex: number, value: string): Promise<boolean> {
        const data = await this.getEntries(columnIndex);

        return data.has(value);
    }

    private prepareDatasets() {
        this.datasetProviders = new Map<number, DatasetProvider>();
        this.filter.validColumns.forEach((column: FakeDTColumn) => {
            const provider: DatasetProvider = column.filter === true ? this.defaultFactory(column.idx) : (<ColumnSettings>column.filter).datasetProvider;

            this.datasetProviders.set(column.idx, provider);
        });
    }
}