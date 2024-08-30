// Action types
import * as types from '../types';

// Interfaces
import { IState } from '../../shared/interfaces';
import { combineReducers } from 'redux';
import { IBalance } from '../../shared/interfaces/balance.interface';

// Constants
const noBalances: IBalance[] = [
  {
    name: 'ETHEREUM',
    unit: 'ETH',
    icon: 'ethereum',
    currency: '$',
    price: 0,
    toUsd: 23.7878,
    rate: 0,
    coins: 0
  },
  {
    name: 'CASPER',
    unit: 'CSPR',
    icon: 'casper-coin',
    currency: '$',
    price: 0,
    toUsd: 123123.123,
    rate: 0,
    coins: 0
  }
];

// Initial state
const initialState: IState = {
  user: null,
  cart: null,
  order: null,
  categories: [],
  scrollTop: 0,
  balances: noBalances,
  transactions: [],
  wallets: [],
  kycDetails: null,
  kycFieldsValue: null,
  likedProducts: [],
  products:[]
};

// Create root reducer
const rootReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case types.SET_USER:
      return {
        ...state,
        user: action.payload
      };
    case types.SET_PRODUCT_DATA:
      return {
        ...state,
        products: action.payload
      };
    case types.SET_CART:
      return {
        ...state,
        cart: action.payload
      };

    case types.SET_KYC_DETAILS:
      return {
        ...state,
        kycDetails: action.payload
      };
    case types.SET_KYC_FIELD_VALUES:
      return {
        ...state,
        kycFieldsValue: action.payload
      };
    case types.SET_WALLETS:
      return {
        ...state,
        wallets: action.payload
      };
    case types.LIKED_PRODUCT: 
      return {
        ...state,
        likedProducts: action.payload
      };
    case types.TOGGLE_FAVORITE: {
      let favoriteProducts = state.user?.favoriteProducts || [];
      const isFavoriteProduct = favoriteProducts?.includes(action.payload);

      if (isFavoriteProduct) {
        favoriteProducts = favoriteProducts?.filter((productId) => productId !== action.payload);
      } else {
        favoriteProducts = [...favoriteProducts, action.payload];
      }

      return {
        ...state,
        user: {
          ...state.user,
          favoriteProducts
        }
      };
    }
    case types.CREATE_ORDER: {
      return { ...state, order: action.payload };
    }
    case types.SET_CATEGORIES: {
      return {
        ...state,
        categories: action.payload
      };
    }
    case types.SET_BALANCES: {
      return {
        ...state,
        balances: noBalances.map((balance: IBalance) => {
          if (balance.unit in action.payload) {
            return {
              ...balance,
              price: action.payload[balance.unit]?.balance || 0,
              coins: action.payload[balance.unit]?.balance || 0,
              toUsd: action.payload[balance.unit]?.usd || 0,
              rate: action.payload[balance.unit]?.rate || 0
            };
          }
          return balance;
        })
      };
    }
    case types.SET_TRANSACTIONS: {
      return {
        ...state,
        transactions: action.payload
      };
    }
    case types.SET_SCROLL_TOP: {
      return {
        ...state,
        scrollTop: action.payload
      };
    }
    default:
      return state;
  }
};

// Export root reducer
export default combineReducers({ state: rootReducer });
