import { Component } from '../base/component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';

interface ISuccessfulFormInfo {
    total: number;
}

export class SuccessfulForm extends Component<ISuccessfulFormInfo> {
	protected _closeButton: HTMLButtonElement;
	protected _description: HTMLElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);

        this._description = ensureElement<HTMLButtonElement>(
			'.order-success__description',
			this.container
		);

		this._closeButton = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			this.container
		);

        this._closeButton.addEventListener('click', () => events.emit('success:finish'));
	}

	set total(value: number) {
		this.setText(this._description,`Списано ${value} синапсов `) ;
	}
}
