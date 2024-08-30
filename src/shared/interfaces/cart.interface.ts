// Interfaces
import { IProduct } from './product.interface';

// Export cart interfaces
export interface IAddCart {
  productId: string;
  fingerprint: string;
  price?: number | string;
  userId: string;
  currency?: string;
  selectedFeature?: any
}

export interface IRemoveCart {
  productId: string;
  fingerprint: string;
  userId: string;
}

export interface IDiscountCart {
  discount: number
  fingerprint: string;
  couponId?: string;
}

export interface ICart {
  id: string;
  fingerPrint: string;
  total: number;
  products: IProduct[];
  userId?: string;
  discount: number
}
