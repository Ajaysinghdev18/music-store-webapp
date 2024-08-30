import { IAccessToken, IApplicationStatus, IQuery } from '../shared/interfaces';
import Http from './http';

export const getFavorites = () => {
  return Http.get(`/users/favorites`);
};
export const updateProfile = (id: string, body: object) => {
  return Http.patch(`/users/${id}`, body);
};

export const updatePassword = (id: string, body: object) => {
  return Http.patch(`/users/${id}/update-password`, body);
};

export const updateAvatar = (id: string, avatar: FormData) => {
  return Http.post(`/users/${id}/update-avatar`, avatar);
};

export const getMessages = (query: IQuery) => {
  return Http.get('/users/messages', query);
};

export const removeMessage = (messageId: string) => {
  return Http.delete(`/users/messages/${messageId}`);
};

export const getShopHistory = (id: string) => {
  return Http.get(`/users/${id}/shop-history`);
};

export const getKYCAccessToken = (query: IAccessToken) => {
  return Http.get(`/kyc/accessToken?userId=${query.userId}`);
};

export const getApplicationStatus = () => {
  return Http.get('/kyc/applicationStatus');
};

export const getKYCStatus = (params: { query?: any; options?: any; projection?: any; aggregate?: any }) => {
  return Http.get(`/kyc`, params);
};

export const toggleSubscribe = (data: { userId: string; artistId: string }) => {
  return Http.post('/users/subsricbe-toggle', data);
};
export const getSubscribed = (id: string) => {
  return Http.get(`/users/${id}/subscribed`);
};
