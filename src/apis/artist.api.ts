import Http from './http';

import { IQuery } from '../shared/interfaces';

export const readAll = (query?: IQuery) => {
  return Http.get('/artists', query);
};

export const read = (id: string) => {
  return Http.get(`/artists/artist/${id}`);
};
export const readAllNFT = (id: string) => {
  return Http.get(`/products/artist/${id}`);
};

