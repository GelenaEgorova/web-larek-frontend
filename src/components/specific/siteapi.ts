import { Api, ApiListResponse } from '../base/api';
import { IProduct, ISuccessfulOrder, IShoppingPost} from '../../types';

export class SiteApi extends Api {
	protected _cdn: string;

	constructor(cdn: string, baseUrl: string, options: RequestInit = {}) {
		super(baseUrl, options);
		this._cdn = cdn;
	}

	getProductItem(id: string): Promise<IProduct> {
        return this.get(`/product/${id}`).then(
            (item: IProduct) => ({
                ...item,
                image: `${this._cdn}${item.image}`,
            })
        );
    }

	getProductList(): Promise<IProduct[]> {
		return this.get('/product').then((data: ApiListResponse<IProduct>) =>
			data.items.map(item => ({
				...item,
				image: `${this._cdn}${item.image}`,
			}))
		);
	}

	postOrder(orderData: IShoppingPost): Promise<ISuccessfulOrder> {
        return this.post(`/order`, orderData).then((orderResult: ISuccessfulOrder) => orderResult)
	}
}