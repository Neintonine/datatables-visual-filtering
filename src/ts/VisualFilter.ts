import {Api} from "datatables.net";
import {DatasetProvider, FakeDTColumn, FilterEngine, Settings} from "./VisualFiltering";
import {IconHandler} from "./IconHandler";
import {SelectionWindow} from "./SelectionWindow";
import {RenderEngine} from "./RenderEngine";
import {Renderer} from "./Renderer";
import {DatasetHandler} from "./DatasetHandler";
import {TableDatasetProvider} from "./dataset-providers/TableDatasetProvider";
import {FilterEngineHandler} from "./FilterEngineHandler";
import {DTFilterEngine} from "./DTFilterEngine";
import {ConstantDatasetProvider} from "./dataset-providers/ConstantDatasetProvider";
import {RequestDatasetProvider} from "./dataset-providers/RequestDatasetProvider";

import {Bootstrap5Renderer} from "./Bootstrap5Renderer";

export class VisualFilter {
    static DefaultSettings: Settings = {
        icons: {
            unselectedIcon: `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-funnel" viewBox="0 0 16 16">
  <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2z"/>
</svg>`,
            selectedIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-funnel-fill" viewBox="0 0 16 16">
  <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5z"/>
</svg>`,
            numbering(value): HTMLElement {
                const element = document.createElement("span");
                element.innerText = value.toString();
                element.classList.add('dtVisualFilter__iconNumbering');

                return element;
            },
        },
        renderer: new Renderer(),
        factories: {
            datasetProvider(columnIndex): DatasetProvider {
                return new TableDatasetProvider(columnIndex);
            },
            filterEngine(filter: VisualFilter, columnIndex: number): FilterEngine {
                return new DTFilterEngine(filter, columnIndex);
            }
        }
    };

    static FilterEngines = {
        DTFilterEngine
    };
    static Renderers = {
        DefaultRenderer: Renderer,
        Bootstrap5: Bootstrap5Renderer
    };
    static DatasetProviders = {
        Table: TableDatasetProvider,
        Constant: ConstantDatasetProvider,
        Request: RequestDatasetProvider
    }

    readonly tableAPI: Api;
    private settings: Settings;

    readonly iconHandler: IconHandler;
    readonly selectionWindow: SelectionWindow;
    readonly renderEngine: RenderEngine;
    readonly datasetHandler: DatasetHandler;
    readonly filterEngines: FilterEngineHandler;

    readonly validColumns: Map<number, FakeDTColumn>;

    constructor(
        tableAPI: Api,
        settings: Settings = {}
    ) {
        this.tableAPI = tableAPI;
        this.settings = { ...VisualFilter.DefaultSettings, ...settings };

        this.validColumns = new Map<number, FakeDTColumn>(
            tableAPI.settings()[0].aoColumns
                .filter((column: FakeDTColumn) => column.filter)
                .map((column: FakeDTColumn) => [column.idx, column])
        );

        this.selectionWindow = new SelectionWindow();
        this.renderEngine = new RenderEngine(this, this.settings.renderer);

        this.iconHandler = new IconHandler(this, this.settings.icons, {
            click: (event: MouseEvent, targetElement: HTMLElement) => {
                const target = targetElement;
                this.selectionWindow.open(target);

                console.log(target);
                const columnIndex = parseInt(target.dataset.index);
                this.renderEngine.render(columnIndex);
            }
        });
        this.iconHandler.apply();

        this.datasetHandler = new DatasetHandler(this, this.settings.factories.datasetProvider);
        this.filterEngines = new FilterEngineHandler(this, this.settings.factories.filterEngine);
    }
}

// @ts-ignore
window.DataTable ??= {}
// @ts-ignore
window.DataTable.VisualFilter = VisualFilter;