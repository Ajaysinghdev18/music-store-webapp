import Http from './http';


export const createBid = (object: any, auctionId: string) => {
  return Http.post(`/auction/bid/${auctionId}`, object);
};

