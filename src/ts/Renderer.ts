import {DatasetRenderer} from "./VisualFiltering";
import {VisualFilter} from "./VisualFilter";
import {FilterEngineHandler} from "./FilterEngineHandler";

export class Renderer implements DatasetRenderer {
    renderHeader(filter: VisualFilter, columnIndex: number): HTMLElement {
        const header = document.createElement('h1');
        header.classList.add('dtVisualFilter__windowHeader');
        header.innerText = filter.validColumns.get(columnIndex).sTitle;
        return header;
    }

    renderWait(): HTMLElement {
        const spinnerContainer = document.createElement('div');
        spinnerContainer.classList.add('dtVisualFilter__spinnerContainer');

        const spinner = document.createElement('div');
        spinner.classList.add('lds-dual-ring');

        spinnerContainer.appendChild(spinner);

        return spinnerContainer;
    }

    async renderData(filter: VisualFilter, columnIndex: number): Promise<HTMLElement> {
        const values = await filter.datasetHandler.getEntries(columnIndex);
        const container = document.createElement('div');

        const inputContainer = this.createSearchElement();
        inputContainer.classList.add('dtVisualFilter__searchContainer');
        const inputElement = inputContainer.querySelector('input');
        inputElement.addEventListener('keyup', this.handleSearch(container, inputElement));

        container.appendChild(inputContainer);
        inputElement.focus();

        const engine = filter.filterEngines.getEngine(columnIndex);
        const currentFilters = engine.getFilterValues();
        let i = 0;
        for (let datum of values) {
            const div = this.createInputElement(datum, i, currentFilters.has(datum));
            div.setAttribute('data-dt-search-value', datum.toLowerCase());

            const input = div.querySelector('input');

            if (currentFilters.has(datum)) {
                input.setAttribute('checked', 'checked');
            }

            const listener = this.createClickListener(filter.filterEngines, columnIndex, datum);
            input.addEventListener('click', listener)

            container.appendChild(div);
            i++;
        }

        return container;
    }
    handleSearch(dataContainer: HTMLElement, searchInput: HTMLInputElement) {
        return () => {
            const divs = dataContainer.querySelectorAll('div[data-dt-search-value]');
            divs.forEach((elem) => elem.classList.remove('dtVisualFilter__hidden'));

            const search = searchInput.value.toLowerCase();
            if (search === '') {
                return;
            }

            const result = dataContainer.querySelectorAll(`div[data-dt-search-value]:not([data-dt-search-value*="${search}"])`);
            result.forEach(elem => elem.classList.add('dtVisualFilter__hidden'));
        }
    }

    protected createSearchElement(): HTMLElement {
        const inputContainer = document.createElement('div');

        const searchLabel = document.createElement('label');
        searchLabel.htmlFor = 'dtVisualFilter__searchInput';
        searchLabel.innerText = "Search";

        const br = document.createElement('br');

        const searchInput = document.createElement('input');
        searchInput.id = 'dtVisualFilter__searchInput';
        searchInput.classList.add('dtVisualFilter__searchInput');

        inputContainer.appendChild(searchLabel);
        inputContainer.appendChild(br);
        inputContainer.appendChild(searchInput);
        return inputContainer;
    }
    protected createInputElement(datum: string, index: number, selected: boolean): HTMLElement {
        const div = document.createElement('div');
        div.classList.add('dtVisualFilter__filterInput');

        const inputId = `filterSelectInput_${index}`;
        const input = document.createElement('input');
        input.id = inputId;
        input.classList.add();
        input.setAttribute('type', 'checkbox');
        input.setAttribute('value', '');

        const label = document.createElement('label');
        label.setAttribute('for', inputId);
        label.innerText = datum;

        div.appendChild(input);
        div.appendChild(label);

        return div;
    }
    createClickListener(filterEngines: FilterEngineHandler, columnIndex: number, datum: string) {
        return (e: any) => {
            if (e.target.checked) {
                filterEngines.addFilter(columnIndex, datum);
                return;
            }
            filterEngines.removeFilter(columnIndex, datum);
        }
    }
}