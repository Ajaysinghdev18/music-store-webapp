import Http from './http';

export const read = (): Promise<any> => {
  return Http.get('/privacy');
};
