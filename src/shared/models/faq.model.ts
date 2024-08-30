import { IMultiLanguage } from '../interfaces';

export interface IFaqQuestion {
  id?: string;
  title: IMultiLanguage | any;
  answer: IMultiLanguage | any;
  category: IFaqCategory;
  updatedAt: string;
}

export interface IFaqCategory {
  id?: string;
  title: IMultiLanguage | any;
  questions: IFaqQuestion[];
  updatedAt: string;
}
