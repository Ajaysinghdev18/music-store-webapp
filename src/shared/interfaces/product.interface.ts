// Interfaces
import { ICategory } from './category.interface';
import { CURRENCY, PRODUCT_TYPE } from '../enums';
import { IArtist } from './artist.interface';
import { IAuction } from './auction.interface';

export interface IFile {
  filename: string;
  fieldname: string;
  path: string;
  size: number;
  url: string
}

export interface IProduct {
  id?: string;
  selectedFeatures?:any;
  type: PRODUCT_TYPE;
  name: string;
  auction?: IAuction;
  category: ICategory[];
  thumbnail: IFile;
  mask_thumbnail?: IFile;
  icon?: IFile;
  sign?: IFile;
  isAuction?: boolean;
  iconUrl?: string;
  signUrl?: string;
  mask_thumbnailUrl?: string;
  thumbnailUrl?: string;
  productFeatures: any;
  price: number;
  description: string;
  currency: CURRENCY;
  sku?: string;
  statement?: string;
  genre?: string;
  music?: IFile;
  image?: IFile;
  video?: IFile;
  preview?: IFile;
  previewUrl?: string;
  musicUrl?: string;
  txHash?: string;
  createdAt?: string;
  ticket?: string;
  transferTxHash?: string;
  tokenId?: string;
  ownerAddress?: string;
  isFeatured?: boolean;
  location?: string;
  startTime?: string | Date;
  endTime?: string | Date;
  getThumbnailUrl?: string;
  artistDetails?: IArtist;
  productURLId?: string;
  artistId: string;
  galleryId?: string;
  next?: {
    id: string;
    img: string;
  };
  chain?: string,
  object?: {
    filename: string,
    url: string,
    fieldname: string
  }
}
