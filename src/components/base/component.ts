export abstract class Component<T> {
	protected constructor(protected readonly container: HTMLElement) {
    }
    // Переключить класс
    toggleClass(element: HTMLElement, className: string, force?: boolean) {
		element.classList.toggle(className, force);
	}
    //Установить текст для элемента
	protected setText(element: HTMLElement, value: unknown) {
		if (element) {
			element.textContent = String(value);
		}
	}
    //Установить картинку для элемента
    protected setImage(element: HTMLImageElement, src: string, alt?: string) {
		if (element) {
            element.src = src;
            if (alt) {
                element.alt = alt;
            }
        }
    }
    // Скрыть элемент
    protected setHidden(element: HTMLElement) {
		    element.style.display = 'none';
	}
    // Показать элемент
	protected setVisible(element: HTMLElement) {
		element.style.removeProperty('display');
	}
	// Сменить статус блокировки
	setDisabled(element: HTMLElement, state: boolean) {
		if (element) {
			if (state) {
                element.setAttribute('disabled', 'disabled');}
			else {
                element.removeAttribute('disabled');}
		}
	}
    //Обновить свойства класса и вернуть корневой элемент
    render(data?: Partial<T>): HTMLElement {
		Object.assign(this as object, data ?? {});
		return this.container;
	}
}