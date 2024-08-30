import { IIcon } from "../../components";
import { INFT } from "./nft.interface";

interface IWalletAccount {
  type: string;
  icon: IIcon;
  amount: number;
}

export interface IWallet {
  _id?: string;
  name: string;
  icon?: IIcon;
  accounts: IWalletAccount[];
  isConnected: boolean;
  default: boolean;
  chain: string;
  address: string;
  privateKey: string;
  balance?: number;
  nfts?: INFT[] | string[];
}