
// карточка товара
export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number
}

// массив карточек на главной странице
export interface IProductsList {
    products: IProduct[];
    preview: string | null;
}

// информация о товарах в корзине
export type IBasket = Pick<IProduct, 'title' | 'price'>;

//форма ввод
export interface IOrder {
    payment: string;
    adress: string;
}

export interface IBuyerInfo {
    email: string;
    phone: string;
}

export interface IOrderData {
    CheckValidation(data: Record<keyof IOrder, string>): boolean;
}

export interface IBuyerInfoData {
    CheckValidation(data: Record<keyof IBuyerInfo, string>): boolean;
}
