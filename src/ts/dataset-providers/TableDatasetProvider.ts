import {DatasetProvider} from "../VisualFiltering";
import {VisualFilter} from "../VisualFilter";

export class TableDatasetProvider implements DatasetProvider {
    private foundData: Set<string>|null = null;

    private columnIndex: number;

    constructor(columnIndex: number) {
        this.columnIndex = columnIndex;
    }

    getEntries(filter: VisualFilter): Promise<Set<string>> {
        if (this.foundData != null) {
            return Promise.resolve(this.foundData);
        }

        const colMetadata = filter.validColumns.get(this.columnIndex);
        const colObject = filter.tableAPI.column(this.columnIndex);

        const value = new Set(Array.from(colObject.data()).map(a => {
            if (colMetadata.mRender) {
                return colMetadata.render(a, 'visual-filtering');
            }

            return a;
        }))
        console.log(value);

        this.foundData = value;

        return Promise.resolve(value);
    }
}