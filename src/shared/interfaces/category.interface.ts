// Export category type
import { IProduct } from './product.interface';

export interface ICategory {
  id?: string;
  name: string;
  visibleInNav: boolean;
  subCategories?: string[];
  products?: string[] | IProduct[];
}
