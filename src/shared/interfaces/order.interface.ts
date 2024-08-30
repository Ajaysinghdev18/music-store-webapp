import { IFile, IProduct } from './product.interface';
import { CURRENCY, PRODUCT_TYPE } from '../enums';

export enum OrderStatus {
  Created = 'Created',
  Processed = 'Processed',
  Cancelled = 'Cancelled'
}

interface IOrderItem {
  id: string;
  productName: string;
  description: string;
  price: number;
  type: PRODUCT_TYPE;
  thumbnail: IFile;
  category: string[];
  currency: CURRENCY;
  nftDetail?: NftDetail
}

interface TokenDetail {
  to: string;
  chain: string;
  transactionHash: string;
}
export interface NftDetail {
  details: TokenDetail;
  tokenId: string;
}


export interface IOrder {
  id?: string;
  _id?: string;
  userId?: string;
  products?: IProduct[];
  orderItems?: IOrderItem[];
  totalPrice?: any;
  firstName?: string;
  lastName?: string;
  username?: string;
  discount?:number;
  name?: string;
  phoneNumber?: number;
  email?: string;
  note?: string;
  isGift?: boolean;
  buyerIpAddress?: string;
  fingerprint?: string;
  crypto?: string[];
  paymentMethod?: string;
  status?: OrderStatus;
  createdAt?: string;
  updatedAt?: string;
  cryptoInfo?: any;
  vat?: any;
  ethereumWalletKey?: string;
  casperWalletKey?: string;
  nftDetail?: NftDetail;
  taxamoInvoiceNumber?: string;
  clientReferenceId?: string;
  txKey?: string;
}

export interface VatType {
  amountToBePaid: number;
  buyerIpAddress: string;
}

export interface OrderStatusType {
  orderId: string;
  status: OrderStatus;
  paidAt: number;
  transaction_lines?: any;
}

export interface IShopHistory {
  _id: string;
  count: number;
  price: number;
}
