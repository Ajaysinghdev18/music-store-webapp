import { ROLE } from '../enums';
import { IArtist, IUser } from '../interfaces';
import { ProductModel } from './product.model';

export class UserModel {
  id: string;
  name: string;
  email: string;
  avatar: any;
  verify: boolean;
  birthday?: string;
  username?: string;
  phoneNumber?: string;
  role: ROLE;
  notificationSettings: string[];
  favoriteProducts?: string[] | ProductModel[] | (string | ProductModel)[];
  createdAt: string;
  isKYCVerified: boolean;
  applicationId: string;
  accountWallet: string;
  chainId: number;
  language?: string;
  currency?: string;
  zip?: string;
  region?: string;
  city?: string;
  country?: string;
  addressLine2?: string;
  addressLine1?: string;
  KYCStatus?:string;
  subscribedArtist?: string[];

  constructor(data: IUser) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.avatar = data.avatar;
    this.verify = data.verify || false;
    this.isKYCVerified = data.isKYCVerified || false;
    this.birthday = data.birthday || '';
    this.phoneNumber = data.phoneNumber || '';
    this.applicationId = data.applicationId || '';
    this.role = data.role;
    this.notificationSettings = data.notificationSettings || [];
    this.accountWallet = data.accountWallet || '';
    this.chainId = data.chainId || 0;
    this.language = data.language;
    this.currency = data.currency;
    this.zip = data.zip;
    this.region = data.region;
    this.city = data.city;
    this.country = data.country;
    this.addressLine2 = data.addressLine2;
    this.addressLine1 = data.addressLine1;
    this.username = data.username;
    this.KYCStatus = data.KYCStatus;
    this.subscribedArtist = data.subscribedArtist;
    if (data.favoriteProducts) {
      this.favoriteProducts = data.favoriteProducts;
    }
    this.createdAt = data.createdAt || '';
  }
}
