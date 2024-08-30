import { IRegisterFormData } from '../shared/interfaces';
import Http from './http';

export const login = (email: string, password: string) => {
  return Http.post('/auth/login', { email, password });
};

export const register = (data: IRegisterFormData) => {
  return Http.post('/auth/register', data);
};

export const verify = (token: any) => {
  return Http.post('/auth/verify', token);
};

export const me = () => {
  return Http.get('/auth/me');
};

export const resetPassword = (newPassword: string, token: string) => {
  return Http.post('/auth/reset-password/', { newPassword, token });
};

export const forgotPassword = (email: string) => {
  return Http.post('/auth/forgot-password/', { email });
};
