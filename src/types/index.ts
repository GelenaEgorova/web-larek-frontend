

import { IEvents } from '../components/base/events';
// карточка товара
export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number
    index?: number;
}

// массив карточек на главной странице
export interface IProductsList {
    items: IProduct[];
    preview: string | null;
}

// информация о товарах в корзине
export type IBasket = Pick<IProduct, 'title' | 'price'>;

//форма ввода информации о способе оплаты и адресе 
export interface IOrder {
    payment: string;
    address: string;
}

//форма ввода контактных данных пользователя
export interface IBuyerInfo {
    email: string;
    phone: string;
}

//общие данные для заказа
export type IShoppingInfo = IOrder & IBuyerInfo;

export type IShoppingPost = IShoppingInfo & {
    total: number;
    items: string[];
}

//вывод текста ошибок
export type IFormError = Partial<IShoppingInfo>;

//валидация форм
export interface IOrderData {
    CheckValidation(data: Record<keyof IOrder, string>): boolean;
}

export interface IBuyerInfoData {
    CheckValidation(data: Record<keyof IBuyerInfo, string>): boolean;
}

//форма успешной оплаты
export interface ISuccessfulOrder {
    id: string;
    total: number;
}

//общие данные о магазине
export interface IAppInfo {
    catalog: IProduct[];
    basket: IProduct[];
    order: IShoppingInfo;
    formError: IFormError;
    events: IEvents;
}