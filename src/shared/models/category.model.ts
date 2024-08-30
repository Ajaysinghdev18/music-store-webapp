import { ICategory } from '../interfaces';

export class CategoryModel {
  id: string;
  name: string;
  visibleInNav: boolean;
  subCategories?: string[];

  constructor(data: ICategory) {
    this.id = data.id || '';
    this.name = data.name;
    this.visibleInNav = data.visibleInNav;
    this.subCategories = data.subCategories;
  }
}
