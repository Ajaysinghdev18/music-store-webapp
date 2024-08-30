// Export auth interfaces
import { ROLE } from '../enums';
import { IArtist } from './artist.interface';

export interface IUser {
  id: string;
  name: string;
  email: string;
  username: string;
  avatar: any;
  birthday?: string;
  phoneNumber?: string;
  notificationSettings?: string[];
  verify?: boolean;
  role: ROLE;
  favoriteProducts?: string[];
  createdAt?: string;
  subscribedArtist?:  string[];
  isKYCVerified: boolean;
  applicationId: string;
  accountWallet?: string;
  chainId?: number;
  language?: string;
  currency?: string;
  zip?: string;
  region?: string;
  city?: string;
  country?: string;
  addressLine2?: string;
  addressLine1?: string;
  KYCStatus?: string;
}

export interface IRegisterFormData {
  name: string;
  email: string;
  password: string;
}
