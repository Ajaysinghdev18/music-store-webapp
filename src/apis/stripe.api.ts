import { ICart } from '../shared/interfaces';
import Http from './http';

export const createSession = (data: object) => {
  return Http.post('/stripe/checkout-session', data);
};
