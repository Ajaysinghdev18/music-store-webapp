import { ARTICLE_STATUS } from '../enums';
import { IMultiLanguage } from './multilanguage';
import { IFile } from './product.interface';

export interface IArticle {
  id: string;
  title: IMultiLanguage | any;
  description: IMultiLanguage | any;
  thumbnail?: IFile;
  isFeatured?: boolean;
  status: ARTICLE_STATUS;
  author?: string;
  createdAt?: string;
  updatedAt?: string;
}
