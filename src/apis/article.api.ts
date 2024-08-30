import Http from './http';

import { IQuery } from '../shared/interfaces';

export const readAll = (query?: IQuery) => {
  return Http.get('/articles', query);
};

export const read = (id: string) => {
  return Http.get(`/articles/${id}`);
};
