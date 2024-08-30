import { IQuery } from '../shared/interfaces';
import Http from './http';

export const getDepositAddress = (query: IQuery) => {
  return Http.get('/payment/depositAddress', query);
};

export const generateWithdrawal = (body: IQuery) => {
  return Http.post('/payment/withdraw', body);
};
