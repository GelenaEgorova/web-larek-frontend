import { Component } from '../base/component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';

interface IPage {
    counter: number;
    catalog: HTMLElement[];
}

export class Page extends Component<IPage> {
    protected _counter: HTMLElement;
	protected _catalog: HTMLElement;
    protected _basket: HTMLButtonElement;
    protected _wrapper: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._catalog = ensureElement<HTMLElement>('.gallery');
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
        
        this._counter = ensureElement<HTMLElement>(
			`.header__basket-counter`
		);
        
        this._basket = ensureElement<HTMLButtonElement>(
			`.header__basket`,
			container
		);

        this._basket.addEventListener(`click`, () => {
            this.events.emit(`basket:open`);
        });
    
    }

    set catalog(items: HTMLElement[]) {
		this._catalog.replaceChildren(...items);
	}

	set counter(value: number) {
		this.setText(this._counter, String(value));
	}

	set locked(value: boolean) {
		if (value) {
		this._wrapper.classList.add('page__wrapper_locked');
		} else {
		this._wrapper.classList.remove('page__wrapper_locked');
	}
	}



}