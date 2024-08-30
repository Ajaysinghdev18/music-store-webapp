import { REACT_APP_API_ASSET_SERVER } from '../../constants';
import { CURRENCY, PRODUCT_TYPE } from '../enums';
import { IArtist, IFile, IProduct } from '../interfaces';
import { IAuction } from '../interfaces/auction.interface';
import { CategoryModel } from './category.model';

export class ProductModel {
  id: string;
  type: PRODUCT_TYPE;
  auction?: IAuction;
  productURLId?: string;
  name: string;
  category: CategoryModel[];
  thumbnail: IFile;
  mask_thumbnail?: IFile;
  galleryId?: string;
  icon?: IFile;
  sign?: IFile;
  video?: IFile;
  isAuction?: boolean;
  price: number;
  description: string;
  productFeatures: any;
  selectedFeatures:any;
  currency: CURRENCY;
  sku?: string;
  statement?: string;
  music?: IFile;
  preview?: IFile;
  txHash?: string;
  createdAt?: string;
  transferTxHash?: string;
  tokenId?: string;
  ownerAddress?: string;
  isFeatured?: boolean;
  location?: string;
  startTime?: string | Date;
  endTime?: string | Date;
  chain?: string;
  artistDetails?: IArtist;
  artistId: string;
  next?: {
    id: string;
    img: string;
  };
  object?: {
    filename: string,
    url: string,
    fieldname: string
  }

  get getAvatarUrl(): string {
    return `${REACT_APP_API_ASSET_SERVER}/${this.icon?.fieldname}/${this.icon?.filename}`;
  }

  get nextProductAvatarUrl(): string {
    const fieldName = this.next?.img?.includes('t', 0) ? 'thumbnail' : 'icon';
    return `${REACT_APP_API_ASSET_SERVER}/${fieldName}/${this.next?.img}`;
  }

  // get getPreviewSongUrl(): string {
  //   return `${REACT_APP_API_ASSET_SERVER}/${this.preview?.fieldname}/${this.preview?.filename}`;
  // }
  //
  // get getThumbnailUrl(): string {
  //   return `${REACT_APP_API_ASSET_SERVER}/${this.thumbnail?.fieldname}/${this.thumbnail?.filename}`;
  // }
  //
  get getVideoUrl(): string {
    return this.video?.url || '';
  }
  //
  // get getSignUrl(): string {
  //   return `${REACT_APP_API_ASSET_SERVER}/${this.sign?.fieldname}/${this.sign?.filename}`;
  // }
  //
  // get getThumbnailMaskUrl(): string {
  //   return `${REACT_APP_API_ASSET_SERVER}/${this.mask_thumbnail?.fieldname}/${this.mask_thumbnail?.filename}`;
  // }

  get getPreviewSongUrl(): string {
    return `${REACT_APP_API_ASSET_SERVER}/${this.preview?.fieldname}/${this.preview?.filename}`;
  }

  get getThumbnailUrl(): string {
    return `${REACT_APP_API_ASSET_SERVER}/${this.thumbnail?.fieldname}/${this.thumbnail?.filename}`;
  }

  get getSignUrl(): string {
    return `${REACT_APP_API_ASSET_SERVER}/${this.sign?.fieldname}/${this.sign?.filename}`;
  }

  get getThumbnailMaskUrl(): string {
    return `${REACT_APP_API_ASSET_SERVER}/${this.mask_thumbnail?.fieldname}/${this.mask_thumbnail?.filename}`;
  }

  get categoryNames(): string {
    return this.category.map((cat) => cat.name).join(', ');
  }
  get categoryNamesArray(): string[] {
    return this.category.map((cat) => cat.name)
  }
  constructor(data: IProduct) {
    this.id = data.id || '';
    this.type = data.type;
    this.name = data.name;
    this.category = data.category?.map((cat) => new CategoryModel(cat)) || [];
    this.thumbnail = data.thumbnail as IFile;
    this.mask_thumbnail = data.mask_thumbnail;
    this.icon = data.icon;
    this.sign = data.sign;
    this.video = data.video;
    this.price = data.price;
    this.description = data.description;
    this.currency = data.currency;
    this.sku = data.sku;
    this.statement = data.statement;
    this.music = data.music;
    this.preview = data.preview;
    this.txHash = data.txHash;
    this.createdAt = data.createdAt;
    this.transferTxHash = data.transferTxHash;
    this.tokenId = data.tokenId;
    this.ownerAddress = data.ownerAddress;
    this.isFeatured = data.isFeatured;
    this.auction = data.auction;
    this.isAuction = data.isAuction;
    this.next = data.next;
    this.location = data.location;
    this.startTime = data.startTime;
    this.endTime = data.endTime;
    this.chain = data.chain;
    this.object = data.object;
    this.artistDetails = data.artistDetails;
    this.galleryId = data.galleryId;
    this.artistId = data.artistId;
    this.productURLId = data.productURLId;
    this.productFeatures = data.productFeatures;
    this.isAuction = data.isAuction;
    this.selectedFeatures = data.selectedFeatures;
  }
}
