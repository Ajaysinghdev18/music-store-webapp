import { ProductModel } from './product.model';
import { ICart } from '../interfaces';

export class CartModel {
  id: string;
  fingerPrint: string;
  userId: string;
  products: ProductModel[];
  total: number;
  discount: number;

  constructor(data: ICart) {
    this.id = data.id;
    this.discount = data.discount;
    this.fingerPrint = data.fingerPrint;
    this.userId = data.userId || '';
    this.products = data?.products && data.products.map((product) => new ProductModel(product));
    this.total = data.total;
  }
}
