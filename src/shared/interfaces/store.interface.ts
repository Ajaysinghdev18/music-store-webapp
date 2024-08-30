// Interfaces
import { ICategory, IUser, IWallet } from '../interfaces';
import { ProductModel } from '../models';
import { CartModel } from '../models/cart.model';
import { IBalance } from './balance.interface';
import { ITransaction } from './transaction.interface';

export interface IProductsState {
  cart: CartModel | null;
  favorites: string[] | null;
}

export interface IState {
  user: IUser | null;
  cart: CartModel | null;
  order: any;
  categories: ICategory[];
  scrollTop: number;
  balances: IBalance[];
  transactions: ITransaction[];
  wallets: IWallet[];
  kycDetails : any | null;
  kycFieldsValue: any;
  likedProducts:any;
  products: ProductModel[]
}

export interface IReducer {
  state: IState;
}
