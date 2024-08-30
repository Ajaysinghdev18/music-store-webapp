import { IQuery } from '../shared/interfaces';
import Http from './http';

export const readAll = (query?: IQuery) => {
  return Http.get('/categories', query);
};
