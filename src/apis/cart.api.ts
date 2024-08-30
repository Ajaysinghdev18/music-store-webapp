import { IAddCart, IDiscountCart, IRemoveCart } from '../shared/interfaces';
import Http from './http';

export const read = (query: { fingerprint: string }) => {
  return Http.get('/cart', query);
};

export const addToCart = (data: IAddCart) => {
  return Http.post(`/cart/add`, data);
};

export const removeFromCart = (data: IRemoveCart) => {
  return Http.delete(`/cart/remove`, data);
};
export const addDiscount = (data: IDiscountCart) => {
  return Http.post(`/cart/discount`, data);
};