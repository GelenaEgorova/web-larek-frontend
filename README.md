# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## Данные и типы данных, используемые в приложении


Карточка товара
```
export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number
}
```
Массив карточек на главной странице
```
export interface IProductsList {
    products: IProduct[];
    preview: string | null;
}
```

Информация о товарах в корзине
```
export type IBasket = Pick<IProduct, 'title' | 'price'>;
```

Форма ввода данных об адресе и способе доставки
```
export interface IOrder {
    payment: string;
    address: string;
}
```

Форма ввода контактных данных покупателя
```

export interface IBuyerInfo {
    email: string;
    phone: string;
}
```

Проверка валидации форм

```
export interface IOrderData {
    CheckValidation(data: Record<keyof IOrder, string>): boolean;
}

export interface IBuyerInfoData {
    CheckValidation(data: Record<keyof IBuyerInfo, string>): boolean;
}

```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP: 
- слой представления, отвечает за отображение данных на странице 
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных

### Базовый код

#### Класс Api

```
export class Api {
    baseUrl: string;
    options: RequestInit;

    constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl;
        this.options = options;
    }
}
```

Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Конструктор:

- `constructor(baseUrl: string, options: RequestInit = {})` - принимает базовый URL и глобальные опции для всех запросов(опционально)

Поля: 
- `baseUrl: string` - базовый адрес сервера
- `options: RequestInit` - объект с заголовками запросов

Методы: 
- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове
- `handleResponse()` - обрабатывает ответ от сервера

#### Класс EventEmitter
```
export class EventEmitter implements IEvents {
    _events: Map<EventName, Set<Subscriber>>;

    constructor() {
        this._events = new Map<EventName, Set<Subscriber>>();
    }
}
```

Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий. 

Конструктор:
`constructor() {this._events = new Map<EventName, Set<Subscriber>>();}` - выполняет инициализацию объекта, создавая пустую структуру данных для хранения событий

Поля: 
- `events = new Map<EventName, Set<Subscriber>>()` - используется для хранения информации о событиях и их подписчиках

Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - установка обработчика на событие
- `off` - снятие обработчика с события
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие
- `onAll` - установка слушашателя на все события
- `offAll` - сброс всех обработчиков с события

#### Класс Component
```
class Component<T> {
	protected constructor(protected readonly container: HTMLElement) {
    }}
```

Представляет собой базовые поля и методы, необходимые для отрисовки компонентов на странице.

Конструктор:
- `constructor(protected readonly container: HTMLElement)` - конструктор принимает принимает DOM-элемент 

- `container: HTMLElement` - DOM-элемент контейнера

Методы:
- `toggleClass` - переключение класса
- `setDisable` - деактивация кнопок
- `setActive` - активация кнопок
- `setHidden` - скрытие элемента
- `setVisible` - отображение элемента 
- `setText` - установка текста 
- `setImage` - установка изображения
- `render` - Отображение данных.

### Слой данных

#### Класс AppState
```
class AppInfo {
    catalog: IProduct[] = [];
	basket: IProduct[] = [];
	order: IShoppingInfo = {
        payment: '',
        address: '',
		email: '',
		phone: '',
	};
	orderErrors: IFormError = {};
	formType: 'order' | 'contacts';
	preview: string | null;
}
```

Класс отвечает за хранение и логику работы с данными приложения\


В полях класса хранятся следующие данные:
- `catalog: IProduct[]` - массив карточек продуктов
- `preview: string | null` - просмотр подробной информации о продукте
- `basket: IProduct[]` -  товары, добавленные пользователем в корзину
- `order: IShoppingInfo` - информация о заказе
- `orderErrors: IFormError` - сообщение об ошибке при вводе данных в форме
- `formType: 'order' | 'contacts'` - тип формы

Методы: 
- `setProductList()` - вывод списка продуктов
- `addToBasket()` - добавление товара в корзину.
- `deleteFromBasket()` - удаление товара из корзины
- `isInBasket()` - получение списка товаров в корзине
- `getNumberBasket()` - вывод количества товаров в корзине
- `getTotalBasket()` - вывод итоговой стоимости товаров в корзине
- `cleanBasket()` - очищаение корзины
- `getTotalBasket()` - отображение суммы всех товаров в корзине
- `setField()` - ввод данных в поле заказа
- `setOrderErrors()` - проверка данных адреса и способа оплаты для заказа
- `setContactsErrors()` - проверка данных эмейла и номера телефона для заказа
- `clearErrors()` - очищение сообщений о ошибках форм

#### Класс Product

Класс отвечает за хранение и логику работы с данными карточки продукта. Класс наследуется от абстрактного класса Component.

Конструктор наследуется от абстрактного класса Component.

В полях класса хранятся следующие данные:
- `id: string` - уникальный номер товара
- `description: string` - описание товара
- `image: string` - изображение товара
- `title: string` - наименование товара
- `category: string` - категория, к которой относится товар
- `price: number` - стоимость товара

Методы:
- `getId()` - получение уникального номера
- `setId()` - установка уникального номера
- `setTitle()` - установка наименования товара
- `setPrice()` - установка стоимости товара
- `setDescription()` - установка описания товара
- `setCategory()` - установка категории товара
- `setImage()` - установка изображения товара
- `setinBasket()` - установка значения добавленности в корзину
- `setIndex()` - установка индекса


#### Класс Page

Реализует отобржение корзины с количеством товара в ней и массив карточек товаров. Класс наследуется от абстрактного класса Component.

Конструктор наследуется от абстрактного класса Component.

Поля класса:
- `counter: number` - счетчик элементов в корзине
- `catalog: HTMLElement` - массив карточек товаров
- `basket: HTMLElement` - корзина с выбранными товарами
- `wrapper: HTMLElement` - главная страница интернет-магазина

Методы класса:
- `counter()` - управление отображением количества товаров в корзие
- `catalog()` - управление массивом карточек
- `locked()` - управление блокировкой для прокрутки при открытии модального окна

#### Класс Modal
Реализует модальное окно, содержит методы `open` и `close` для управления отображением модального окна. Устанавливает слушатели на клавиатуру для закрытия модального окна по клику на оверлей или крестик. Класс наследуется от абстрактного класса Component

Конструктор: 
- `constructor(container: HTMLElement, events: IEvents)` -  наследуется от абстрактного класса Component

Поля класса:
- `container: HTMLElement` - переключает модального окна
- `events: IEvents` - брокер событий
- `content: HTMLElement` - контент, находящийся в модальном окне
- `closeButton: HTMLButtonElement`- кнопка закрытия модального окна

Методы класса: 
- `toggleModal()` - присваивает контен модальному окну
- `set content()` - присваивает контен модальному окну
- `set content()` - присваивает контен модальному окну
- `open()` - управляет отображением модального окна - показывает на странице
- `close()` - управляет отображением модального окна - скрывает со страницы
- `render()` - наследует и расширяет метод родительского класса. Возвращает заполненный данными корневой DOM-элемент

#### Класс Basket
Расширяет класс Component. Предназначен для реализации модального окна с формой, содержащей информацию о выбранных для оформления товарах. При сабмите инициирует событие подтверждения данных и переходу к оформлению заказа.

Конструктор: 
- `constructor(container: HTMLElement, events: IEvents)` -  наследуется от абстрактного класса Modal

Поля класса:
- `orderButton: HTMLButtonElement` - кнопка подтверждения
- `list: HTMLElement[]` - коллекция всех выбранных товаров
- `total: string` - сумма для оплаты

Методы: 
- `get list()` - получение списка выбранных товаров
- `set List()` - вывод списка выбранных товаров
- `set total()` - вывод общей стоимости товаров

#### Класс ModarlFoOrder
Реализует модальное окно для ввода данных для оформления заказа. Класс наследуется от абстрактного класса Component

Конструктор: 
- `constructor(container: HTMLElement, events: IEvents)` -  наследуется от абстрактного класса Component

Поля класса:
- `submitButton: HTMLButtonElement` - кнопка подтверждения
- `errors: Record<string, HTMLElement>` - объект хранящий все элементы для вывода ошибок под полями формы с привязкой к атрибуту name инпутов
- `inputs: NodeListOf<HTMLInputElement>` - коллекции всех полей ввода формы

Методы: 
- `setError()` - принимает объект с данными для отображения или скрытия ошибок под полями ввода
- `showInputError()`- отображает полученный текст ошибки под указанным полем ввода
- `hideInputError()` - скрывает текст ошибки под указанным полем ввода
- `clearModal()` - очищает поля формы и сбрасывает состояния кнопок при сабмите


#### Класс OrderForm
 Предназначен для реализации модального окна с формой, содержащей поле ввода адреса и способов оплаты заказа. При сабмите инициирует событие подтверждения данных для отправки и оплаты заказа. Предоставляет методы для отображения ошибок и управления активностью кнопки сохранения. Наследуется от класса Form

Конструктор: 
- `constructor(container: HTMLElement, events: IEvents)` - конструктор наследуется от абстрактного класса ModalForOrder

Поля класса:
- `PaymentButton: HTMLButtonElement` - кнопка выбора способа оплаты
- `address: HTMLInputElement` - элемент формы для ввода адреса


Методы: 
- `set address()` - устанавливает значение в поле адреса
- `set payment()` - переключает выбранную пользователем кнопку выбора способа оплаты


#### Класс ContactsForm
 Предназначен для реализации модального окна с формой, содержащей поля ввода телефона и эмейла. При сабмите инициирует событие подтверждения данных и переход на окно с уведомлением об успешном оформлении заказа. Наследуется от класса Form

Конструктор: 
- `constructor(container: HTMLElement, events: IEvents)` 

Поля класса:
- `email: HTMLInputElement` - поле ввода эмейла
- `phone: HTMLInputElement` - поле ввода номера телефона

Методы: 
- `set email()` - устанавливает значение в поле почтового адреса 
- `set phone()` - устанавливает значение в поле контактного телефона 

#### Класс SuccessfulForm
Наследуется от класса Component. Предназначен для реализации модального окна с формой, содержащей сообщение об успешном оформлении заказа, в которое передаётся полная стоимость корзины. 

Конструктор: 
- `constructor(container: HTMLElement, events: IEvents)`

Поля класса:
- `closeButton: HTMLButtonElement` - кнопка закрытия формы при успешном оформлении заказа
- `total: number` - общая сумма покупки
- `description: HTMLElement` - сообщение об успешном оформлении заказа

Методы: 
- `set total()` - устанавливает значение в поле общей суммы заказа

#### Класс SiteApi 
наследуется от класса Api. Используется для вывода карточек товаров на странице, а также и отправки заказа

Конструктор: 
- `constructor(cdn: string, baseUrl: string, options: RequestInit = {})`

Поля класса:
- `cdn: string` - используется для формирования полного пути к изображениям продуктов

Методы: 
- `getProductItem(id: string): Promise<IProduct>` - получает данные о продукте по его ID и добавить полный URL изображения
- `getProductList(): Promise<IProduct[]>` - получает список продуктов и добавить полный URL изображения для каждого продукта
- `postOrder(orderData: IShoppingPost): Promise<ISuccessfulOrder>` - отправляет данные заказа на сервер и вернуть результат

### Взаимодействие компнонетов
Взаимодействие осуществляется за счет событий, генерируемых с помощью броекера событий и их обработчиков. 

Список событий, которые могут генерироваться в системе

-`items:changed` - изменение массива карточек товаров.
- `card:select` - при клике на товар всплывает модальное окно с подробной информацией о товаре и возможностью добавления товара в корзину.
- `card:add` - при клике в модальном окне товара на кнопку "добавить в корзину" происходит добавление товара.
- `card:remove` - при клике на кнопку удаления товара в корзине.
- `basket:open`- открытие модального окна с содержимым корзины.
- `basket:changed` - изменение содержимого корзины и оформление заказа из корзины.
- `order:submit` - подтверждение данных для оплаты и доставки.
- `contacts:submit` - подтверждение контактных данных.
- `order:complete` - при открытии окна успешной оплаты.
- `formErrors:change` - событие, сообщающее о необходимости валидации форм с вводом адреса и способа оплаты и с контактными данными. 
- `/^(order|contacts)\..*:change/` - регулярное выражениедля всех изменений полей заказа.
- `success:finish` - окно успешного оформления заказа.
- `modal:open` - открытие модального окна.
- `modal:close` - закрытие модального окна.
