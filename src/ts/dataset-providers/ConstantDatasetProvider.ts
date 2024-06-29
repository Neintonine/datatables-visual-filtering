import {DatasetProvider} from "../VisualFiltering";
import {VisualFilter} from "../VisualFilter";

export class ConstantDatasetProvider implements DatasetProvider {
    private dataset: Set<string>;

    constructor(
        dataSet: Set<string>|string[]
    ) {
        if (Array.isArray(dataSet)) {
            dataSet = new Set(dataSet);
        }

        this.dataset = dataSet;
    }

    getEntries(filter: VisualFilter): Promise<Set<string>> {
        return Promise.resolve(this.dataset);
    }
}