import {Renderer} from "./Renderer";

export class Bootstrap5Renderer extends Renderer {
    protected createSearchElement(): HTMLElement {
        const inputContainer = document.createElement('div');
        inputContainer.classList.add('form-floating');


        const searchLabel = document.createElement('label');
        searchLabel.htmlFor = 'dtVisualFilter__searchInput';
        searchLabel.innerText = "Search";

        const searchInput = document.createElement('input');
        searchInput.id = 'dtVisualFilter__searchInput';
        searchInput.placeholder = '';
        searchInput.classList.add('dtVisualFilter__searchInput', 'form-control');

        inputContainer.appendChild(searchInput);
        inputContainer.appendChild(searchLabel);

        return inputContainer;
    }

    protected createInputElement(datum: string, index: number, selected: boolean): HTMLElement {
        const div = document.createElement('div');
        div.classList.add('dtVisualFilter__filterInput', 'form-check');

        const inputId = `filterSelectInput_${index}`;
        const input = document.createElement('input');
        input.id = inputId;
        input.classList.add('form-check-input');
        input.setAttribute('type', 'checkbox');
        input.setAttribute('value', '');

        const label = document.createElement('label');
        label.setAttribute('for', inputId);
        label.classList.add('form-check-label');
        label.innerText = datum;

        div.appendChild(input);
        div.appendChild(label);

        return div;
    }
}