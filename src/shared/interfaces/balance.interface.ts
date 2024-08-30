import { IIcon } from '../../components';

export interface IBalance {
  name: string;
  unit: string;
  icon: IIcon;
  currency: string;
  price: number;
  toUsd: number;
  rate: number;
  coins: number;
}

export interface ICryptoBalance {
  balance: number;
  usd: number;
  rate: number;
  coins: number;
}

export interface IBalances {
  _id?: string;
  userId?: string;
  ETH?: ICryptoBalance;
}
