import {ColumnSettings, DatasetRenderer} from "./VisualFiltering";
import {VisualFilter} from "./VisualFilter";

export class RenderEngine {
    private filter: VisualFilter;
    private defaultRenderer: DatasetRenderer;

    constructor(
        filter: VisualFilter,
        defaultRenderer: DatasetRenderer,
    ) {
        this.filter = filter;
        this.defaultRenderer = defaultRenderer;
    }

    async render(columnIndex: number): Promise<void> {
        const renderer = this.getRenderer(columnIndex);
        const targetElement = this.filter.selectionWindow.window;

        const headerRenderFunction = renderer.renderHeader ?? this.defaultRenderer.renderHeader;
        const headerElement = headerRenderFunction(this.filter, columnIndex);
        targetElement.appendChild(headerElement);

        const waitRenderFunction = renderer.renderWait ?? this.defaultRenderer.renderWait;
        const waitElement = waitRenderFunction();
        targetElement.appendChild(waitElement);

        const dataElement = await renderer.renderData(this.filter, columnIndex);
        targetElement.removeChild(waitElement);
        targetElement.appendChild(dataElement);
    }

    getRenderer(columnIndex: number): DatasetRenderer {
        const columns = this.filter.validColumns;
        if (!columns.has(columnIndex)) {
            throw new Error(`Unable to render column: ${columnIndex}\nCouldn't find column`);
        }

        const filter = <ColumnSettings|true>this.filter.validColumns.get(columnIndex).filter;
        if (filter === true) {
            return this.defaultRenderer;
        }

        return filter.renderer ?? this.defaultRenderer;
    }
}