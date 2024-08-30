// Interfaces
import { IUser } from './auth.interface';



export interface IAuction {
  id: string;
  seller: IUser | string;
  startingPrice: number;
  currentHighestBid: number;
  latestBid: number;
  bids: any;
}
