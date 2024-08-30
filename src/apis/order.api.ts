import Axios from 'axios';

import { IOrder, IQuery, OrderStatusType, VatType } from '../shared/interfaces';
import Http from './http';

export const order = ({
  userId,
  totalPrice,
  name,
  discount,
  note,
  isGift,
  email,
  phoneNumber,
  products,
  buyerIpAddress,
  fingerprint,
  crypto,
  paymentMethod,
  casperWalletKey,
  ethereumWalletKey,
  clientReferenceId
}: IOrder) => {
  return Http.post(`/checkout/orders`, {
    userId,
    totalPrice,
    discount,
    name,
    note,
    isGift,
    email,
    phoneNumber,
    products,
    buyerIpAddress,
    fingerprint,
    crypto,
    paymentMethod,
    casperWalletKey,
    ethereumWalletKey,
    clientReferenceId,
  });
};

export const readAll = (params?: IQuery) => {
  return Http.get('/checkout/orders', params);
};

export const read = (id: string) => {
  console.log("🚀 ~ file: order.api.ts:49 ~ read ~ id:", id)
  return Http.get(`/checkout/orders/${id}`);
};

export const getVat = (query: VatType) => {
  return Http.get(`/checkout/vat?amountToBePaid=${query.amountToBePaid}&buyerIpAddress=${query.buyerIpAddress}`);
};

export const updateOrderStatus = (body: OrderStatusType) => {
  return Http.patch(`/checkout/orders/status`, body);
};

export const updateOrder = (id: string, body: any) => {
  return Http.patch(`/checkout/orders/${id}`, body);
};

export const getIpv4 = () => {
  return Axios.get(`https://api.ipify.org/?format=json`);
};

export const getDetailsFromIp = (ip: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${process.env.REACT_APP_IP_API_KEY}`
    }
  };
  return Axios.get(`https://ipinfo.io/${ip}`, config);
};

export const createSession = (data: object) => {
  return Http.post('/checkout/stripe-session', data);
};

