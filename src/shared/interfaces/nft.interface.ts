import { ProductModel } from "../models";

export interface INFTDETAIL {
  chain: string;
  network: string;
  to: string;
  transactionHash: string;
}


export interface INFT {
  artistId: string;
  contractId: string;
  galleryId: string;
  ipfsFileHash: string;
  ipfsImageHash: string;
  isMinted: boolean;
  productId: ProductModel;
  details: INFTDETAIL;
  status: boolean;
  tokenId: string;
  createdAt?: string;
  updatedAt?: string
}
