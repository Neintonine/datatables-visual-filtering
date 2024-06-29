import {HTMLSelection, IconSettings} from "./VisualFiltering";
import {VisualFilter} from "./VisualFilter";

type ClickEventHandler = (event: MouseEvent, targetElement: HTMLElement) => void;
type Events = {
    click: ClickEventHandler;
}

export class IconHandler {
    private filter: VisualFilter;
    private settings: IconSettings;

    private events: Events;

    constructor(
        filter: VisualFilter,
        settings: IconSettings,
        events: Events
    ) {
        this.filter = filter;
        this.settings = settings;
        this.events = events;
    }

    apply() {
        this.filter.validColumns.forEach((column, index) => {
            const colHeader = this.filter.tableAPI.column(index).header();

            const wrapper = document.createElement('div');
            wrapper.dataset.index = index + '';
            wrapper.classList.add('dtVisualFilter__iconWrapper');

            wrapper.addEventListener('click', (event) => {
                event.stopPropagation();
                this.events.click(event, wrapper);
            });

            this.renderColumn().forEach((elem) => wrapper.appendChild(elem));

            colHeader.appendChild(wrapper);
            colHeader.classList.add('dtVisualFilter__hasIcon');
        })
    }

    setValue(columnIndex: number, value: number): void {
        const header = this.filter.tableAPI.column(columnIndex).header();
        const iconElement = header.querySelector(`.dtVisualFilter__iconWrapper`);

        iconElement.innerHTML = '';

        this.renderColumn(value).forEach((elem) => iconElement.append(elem));
    }

    private renderColumn(currentValue: number|null = null): HTMLElement[] {
        if (!currentValue) {
            return [this.renderHTMLSelection(this.settings.unselectedIcon)];
        }

        const icon = this.renderHTMLSelection(this.settings.selectedIcon);
        const numbering = this.settings.numbering(currentValue);

        return [icon, numbering];
    }

    private renderHTMLSelection(selection: HTMLSelection): HTMLElement {
        if (selection instanceof HTMLElement) {
            return selection;
        }

        if (typeof selection === 'function') {
            return selection();
        }

        const doc = new DOMParser().parseFromString(selection, "text/xml");
        return <HTMLElement>doc.firstChild;
    }
}