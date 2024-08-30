import Http from './http';

import { IQuery } from '../shared/interfaces';

export const readAll = (query?: IQuery) => {
  return Http.get('/products', query);
};

export const read = (id: string) => {
  return Http.get(`/products/product/${id}`);
};

export const toggleFavorite = (data: { fingerprint: string; productId: string }) => {
  return Http.post('/products/toggle-favorite', data);
};

export const getTransactionDetails = (txHash: string): Promise<any> => {
  return Http.get(`/products/nft/${txHash}`);
};

export const get3DObjectData = (id: string): Promise<any> => {
  return Http.get(`/products/3d-object/${id}`);
};
export const isPublicProduct = (id: string): Promise<any> => {
  return Http.get(`/products/isPublic/${id}`);
};