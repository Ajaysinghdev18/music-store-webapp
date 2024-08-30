import Http from './http';

export const readAll = (): Promise<any> => {
  return Http.get('/us');
};
