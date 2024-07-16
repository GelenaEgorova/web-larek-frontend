import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { EventEmitter } from './components/base/events';
import { AppState } from './components/specific/appData';
import { Basket } from './components/specific/basket';
import { ContactsForm } from './components/specific/formWithContact';
import { Modal } from './components/general/modal';
import { OrderForm } from './components/specific/formWithAdress';
import { Page } from './components/specific/page';
import { Product } from './components/specific/product';
import { SiteApi } from './components/specific/siteApi';
import { SuccessfulForm } from './components/specific/successfulForm';
import {IProduct, IShoppingInfo, IFormError, ISuccessfulOrder} from './types';

const api = new SiteApi(CDN_URL, API_URL);
const events = new EventEmitter();

const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения
const appState = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const contacts = new ContactsForm(cloneTemplate(contactsTemplate), events);
const order = new OrderForm(cloneTemplate(orderTemplate), events);
const success = new SuccessfulForm(cloneTemplate(successTemplate), events);

// Получаем товары с сервера
api.getProductList()
	.then((result) => {
		appState.setProductList(result);
	})
	.catch((err) => {
		console.error(err);
	});

// Изменились элементы каталога
events.on('items:changed', () => {
	page.catalog = appState.catalog.map((item) => {
		const product = new Product('card',cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return product.render({
			title: item.title,
			price: item.price,
			image: item.image,
			category: item.category,
		});
	});
});

// Открыть товар
events.on('card:select', (item: IProduct) => {
	const card: Product = new Product(`card`,cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			if (!appState.isInBasket(item)) {
				appState.addToBasket(item);
			} else {
				appState.deleteFromBasket(item);
			}
			card.inBasket = appState.isInBasket(item);
		},
	});
	card.inBasket = appState.isInBasket(item);
	modal.render({
		content: card.render({
			title: item.title,
			image: item.image,
			description: item.description,
			price: item.price,
		}),
	});
});

// Добавить товар в корзину
events.on('card:add', (item: IProduct) => {
	appState.addToBasket(item);
});

// Удалить товар из корзины
events.on('card:remove', (item: IProduct) => {
	appState.deleteFromBasket(item);
});

//Открыть корзину
events.on('basket:open', () => {
	appState
	modal.render({ 
        content: basket.render({list: basket.list, total: basket.total}) });
});

//Изменить данные корзины
events.on('basket:changed', () => {
	page.counter = appState.getNumberBasket();
	const items = appState.basket.map((item, index) => {
		const card = new Product('card', cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				events.emit('card:remove', item);
			},
		});
		return card.render({
			index: index + 1,
			title: item.title,
			price: item.price,
		});
	});

	basket.render({list: items,total: appState.getTotalBasket(),
	});
});

// Открыть форму ввода адреса и выбора способа оплаты
events.on('order:open', () => {
	modal.render({
        content: order.render({
            valid: appState.setOrderErrors(),
            errors: [],
        }),
    })
});

// Отправить форму заказа 
events.on('order:submit', () => {
	modal.render({
        content: contacts.render({
            valid: appState.setContactsErrors(),
            errors: [],
        }),
    })
});

// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: IFormError) => {
	const { payment, address, email, phone } = errors;
    order.valid = !payment && !address;
    contacts.valid = !email && !phone;
    order.errors = Object.values({payment, address}).filter(i => !!i).join('; ');
    contacts.errors = Object.values({email, phone}).filter(i => !!i).join('; ');
});

// Открыть форму ввода контактных данных
events.on('contacts:submit', () => {
	api
	.postOrder({
		...appState.order,
		total: appState.getTotalBasket(),
		items: appState.getBasketId(),
	})
		.then((result) => {
			order.resetForm();
			contacts.resetForm();
			events.emit('order:complete',result)
			appState.cleanBasket();
			page.counter = appState.getNumberBasket();
		})
		.catch(console.error);
})

// Отправить форму с контактными данными
events.on('order:complete', (res:ISuccessfulOrder) => {modal.render({content: success.render({total: res.total})})});

// Открыть форму успешного оформления заказа
events.on('success:finish', () => modal.close());

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});

// Разблокируем прокрутку страницы
events.on('modal:close', () => {
	page.locked = false;
});

// Изменилось одно из полей
events.on(
	/^(order|contacts)\..*:change/, (data: { field: keyof IShoppingInfo; value: string }) => {
		appState.setField(data.field, data.value);
	}
);

