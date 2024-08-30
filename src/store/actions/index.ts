// Action types
import * as types from '../types';
import { ProductModel, UserModel } from '../../shared/models';
import { CartModel } from '../../shared/models/cart.model';
import { ICategory, IWallet } from '../../shared/interfaces';
import { ITransaction } from '../../shared/interfaces/transaction.interface';
import { IBalances } from '../../shared/interfaces/balance.interface';

// Export actions
export const setUser = (user: UserModel | null) => ({
  type: types.SET_USER,
  payload: user
});
export const setProducts = (products: ProductModel[] | null) => ({
  type: types.SET_PRODUCT_DATA,
  payload: products
});
export const setKYCDetails = (kyc: any | null) => ({
  type: types.SET_KYC_DETAILS,
  payload: kyc
});


export const toggleFavorite = (productId: string) => ({
  type: types.TOGGLE_FAVORITE,
  payload: productId
});
export const likedProducts = (data: any) => ({
  type: types.LIKED_PRODUCT,
  payload: data
});

export const addToCart = (cart: CartModel | null) => ({
  type: types.SET_CART,
  payload: cart
});

export const addUserWallets = (wallets: IWallet[] | null) => ({
  type: types.SET_WALLETS,
  payload: wallets
});

export const createOrder = (order: any | null) => ({
  type: types.CREATE_ORDER,
  payload: order
});

export const setCategories = (categories: ICategory[]) => ({
  type: types.SET_CATEGORIES,
  payload: categories
});

export const setBalances = (balances: IBalances) => ({
  type: types.SET_BALANCES,
  payload: balances
});

export const setTransactions = (transactions: ITransaction[]) => ({
  type: types.SET_TRANSACTIONS,
  payload: transactions
});

export const setScrollTop = (value: number) => ({
  type: types.SET_SCROLL_TOP,
  payload: value
});
