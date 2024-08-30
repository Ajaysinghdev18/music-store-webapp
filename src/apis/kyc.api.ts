import Http from './http';

export const createKyc = (values: any) => {
  return Http.post('/kyc', values);
};

export const read = (id: string) => {
  return Http.get(`/kyc?=${id}`);
};
