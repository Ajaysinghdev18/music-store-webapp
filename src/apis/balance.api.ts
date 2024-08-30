import { IQuery } from '../shared/interfaces';
import Http from './http';

export const getBalance = (query: IQuery) => {
  return Http.get('/balance', query);
};

export const createBalance = (query: IQuery) => {
  return Http.post('/balance', query);
};

export const getCasperBalance = (publicKey: string) => {
  return Http.get(`/balance/casper/${publicKey}`);
};
