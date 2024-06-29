import {VisualFilter} from "./VisualFilter";

type HTMLElementCallable = () => HTMLElement;
type HTMLSelection = HTMLElement|string|HTMLElementCallable;

type DatasetProviderFactory = (columnIndex: number) => DatasetProvider;
type FilterEngineFactory = (filter: VisualFilter, columnIndex: number) => FilterEngine;

export interface IconSettings {
    unselectedIcon: HTMLSelection;
    selectedIcon: HTMLSelection;
    numbering: (amount: number) => HTMLElement;
}

export interface DatasetSettings {
    defaultProvider?: DatasetProvider;
}

export interface ColumnSettings {
    datasetProvider?: DatasetProvider;
    renderer?: DatasetRenderer;
    filterEngineFactory?: FilterEngineFactory;
}

export interface Settings {
    icons?: IconSettings;
    factories?: SettingsFactories;
    renderer?: DatasetRenderer;
}

export interface SettingsFactories {
    datasetProvider?: DatasetProviderFactory;
    filterEngine?: FilterEngineFactory;
}

export interface DatasetProvider {
    getEntries(filter: VisualFilter): Promise<Set<string>>;
}

export interface DatasetRenderer {
    renderHeader?(filter: VisualFilter, columnIndex: number): HTMLElement
    renderWait?(): HTMLElement
    renderData(filter: VisualFilter, columnIndex: number): Promise<HTMLElement>;
}

export interface FilterEngine {
    addFilter(value: string): void;
    removeFilter(value: string): void;
    getFilterValues(): Set<string>;
}

export interface FakeDTColumn {
    idx: number;
    filter?: ColumnSettings|boolean;
    name: string;
    nTh: HTMLTableCellElement;
    sTitle: string;
    mRender?: any;
    render(value: any, type: string): string;
}

export interface AjaxDatasetProviderSettings {
    request: RequestInit&{ url: string };
    lazyLoading?: boolean,
    keepResult?: boolean,
    requestedDataKey?: string|null
}
