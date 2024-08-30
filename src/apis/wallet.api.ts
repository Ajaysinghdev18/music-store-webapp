import Http from './http';

export const readAll = () => {
  return Http.get('/wallet');
};

export const read = (id: string) => {
  return Http.get(`/wallet/${id}`);
};

export const updateWallet = (id: string, body: any) => {
  return Http.patch(`/wallet/edit/${id}`, body);
};

export const downloadPrivateKey = (id: string, chain: string) => {
  return Http.post(`/wallet/${id}`, { chain });
};

export const createWallet = (name: string, chain: string) => {
  return Http.post(`/wallet/create`, { name, chain });
};
