import { IQuery } from '../shared/interfaces';
import Http from './http';

export const gettransactions = (query: IQuery) => {
  return Http.get('/transaction', query);
};

export const deployWalletTransaction = (value: any) => {
  return Http.post('/transaction/deploy', { ...value });
};
