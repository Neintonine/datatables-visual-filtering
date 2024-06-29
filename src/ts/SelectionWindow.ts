interface SelectionWindowHandle {
    window: HTMLDivElement,
    scrollableParent: HTMLElement,
    targetElement: HTMLElement
}

type SelectionWindowOutsideClickHandler = (event: MouseEvent) => void;
type SelectionWindowRepositionHandler = () => void;

export class SelectionWindow {
    private intersectionObserver: IntersectionObserver;
    private readonly outsideClickEventHandler: SelectionWindowOutsideClickHandler;
    private readonly repositionEventHandler: SelectionWindowRepositionHandler;

    private handle: SelectionWindowHandle|null;

    get window(): HTMLElement {
        return this.handle.window;
    }

    constructor() {
        this.intersectionObserver = new IntersectionObserver(
            (entries) => this.checkIntersections(entries),
        )

        this.outsideClickEventHandler = (event) => {
            const target = event.target as HTMLElement;
            const closestWindow = target.closest(".dtVisualFilter__selectionWindow");

            if (closestWindow !== null) {
                return;
            }

            this.close();
        };

        this.repositionEventHandler = () => {
            if (this.handle === null) {
                return;
            }

            this.positionWindow();
        }
    }

    open(targetElement: HTMLElement) {
        if (this.handle != null) {
            this.close();
        }

        const window = document.createElement("div");
        window.classList.add('dtVisualFilter__selectionWindow');

        document.body.appendChild(window);

        const scrollableParent = this.getScrollElement(targetElement);

        this.handle = {
            window,
            scrollableParent,
            targetElement
        };

        document.addEventListener("click", this.outsideClickEventHandler);
        scrollableParent.addEventListener("scroll", this.repositionEventHandler);
        window.addEventListener("scroll", this.repositionEventHandler);

        this.intersectionObserver.observe(targetElement);

        this.positionWindow();
    }

    close() {
        if (this.handle === null) {
            return;
        }

        this.intersectionObserver.unobserve(this.handle.targetElement);
        this.handle.window.remove();

        this.handle = null;
    }

    private checkIntersections(entries: IntersectionObserverEntry[]) {
        if (entries.length > 1) {
            console.warn('More than one intersections registered.');
        }

        const entry = entries[0];

        this.handle.window.style.display = entry.isIntersecting ? '' :  'none';
    }

    private getScrollElement(targetElement: HTMLElement): HTMLElement {
        if (targetElement == null) {
            return null;
        }

        if (targetElement.scrollHeight > targetElement.clientHeight) {
            return targetElement;
        }

        return this.getScrollElement(targetElement.parentElement);
    }

    private positionWindow() {
        if (this.handle === null) {
            return;
        }

        const { top, left, right: iconRight } = this.getCoordinates(this.handle.targetElement);
        const windowWidth = this.handle.window.clientWidth;
        const right = left + windowWidth;
        let xPosition = left;

        if (this.checkWindowVisibility(right)) {
            xPosition = iconRight - windowWidth;
        }

        this.handle.window.style.left = `calc(${ xPosition }px)`;
        this.handle.window.style.top = `calc(${ top }px + 2em)`;
    }

    private getCoordinates(element: HTMLElement): {top: number; left: number, right: number } {
        const box = element.getBoundingClientRect();

        const body = document.body;
        const docEl = document.documentElement;


        const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
        const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

        const clientTop = docEl.clientTop || body.clientTop || 0;
        const clientLeft = docEl.clientLeft || body.clientLeft || 0;

        const top = box.top + scrollTop - clientTop;
        const left = box.left + scrollLeft - clientLeft;
        const right = box.right + scrollLeft - clientLeft;

        return { top: Math.round(top), left: Math.round(left), right: Math.round(right) };
    }

    private checkWindowVisibility(right: number) {
        const bodyRect = document.body.getBoundingClientRect();

        return bodyRect.right < right;
    }
}