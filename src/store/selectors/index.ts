// Interfaces
import { IReducer } from '../../shared/interfaces';

// Export selectors
export const getUser = (reducer: IReducer) => reducer.state.user;
export const getOrder = (reducer: IReducer) => reducer.state.order;
export const getFavorites = (reducer: IReducer) => reducer.state.user?.favoriteProducts;
export const getLikedProducts = (reducer: IReducer) => reducer.state.likedProducts;
export const getCart = (reducer: IReducer) => reducer.state.cart;
export const getCategories = (reducer: IReducer) => reducer.state.categories;
export const getScrollTop = (reducer: IReducer) => reducer.state.scrollTop;
export const getBalances = (reducer: IReducer) => reducer.state.balances;
export const gettransactions = (reducer: IReducer) => reducer.state.transactions;
export const getUserWallets = (reducer: IReducer) => reducer.state.wallets;
export const getKYCDetails = (reducer: IReducer) => reducer.state.kycDetails;
export const getKYCFieldValues = (reducer: IReducer) => reducer.state.kycFieldsValue;
export const getProducts = (reducer: IReducer) => reducer.state.products;