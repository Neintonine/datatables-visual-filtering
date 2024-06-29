import {AjaxDatasetProviderSettings, DatasetProvider} from "../VisualFiltering";

export class RequestDatasetProvider implements DatasetProvider {
    static DefaultSettings: AjaxDatasetProviderSettings = {
        request: undefined,
        lazyLoading: true,
        keepResult: true,
        requestedDataKey: null
    }

    private settings: AjaxDatasetProviderSettings;
    private cachedData: Set<string>|null = null;

    constructor(
        settings: AjaxDatasetProviderSettings
    ) {
        if (!settings.request) {
            throw new Error("Can't create a request dataset provider without a request object");
        }

        if (!settings.request.url) {
            throw new Error("Can't create a request dataset provider without a valid request object: Needs a url parameter");
        }

        this.settings = { ...RequestDatasetProvider.DefaultSettings, ...settings };

        if (!this.settings.lazyLoading) {
            this.requestDataset();
        }
    }

    async getEntries(): Promise<Set<string>> {
        return this.requestDataset();
    }

    clearCache() {
        this.cachedData = null;
    }

    private async requestDataset(): Promise<Set<string>> {
        if (this.cachedData && this.settings.keepResult) {
            return Promise.resolve(this.cachedData);
        }

        const result = await fetch(this.settings.request.url, this.settings.request);
        const data = await result.json();

        const dataset = this.getDataset(data);

        if (this.settings.keepResult) {
            this.cachedData = dataset;
        }

        return dataset;
    }

    private getDataset(data: any): Set<string> {
        if (this.settings.requestedDataKey === null) {
            return new Set<string>(data);
        }

        if (!data.hasOwnProperty(this.settings.requestedDataKey)) {
            throw new Error(`Can't parse ajax response. Data key ${ this.settings.requestedDataKey } not found...`);
        }

        return new Set<string>(data[this.settings.requestedDataKey]);
    }
}