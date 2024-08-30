export interface ITransaction {
  _id?: string;
  currency?: string;
  type?: string;
  amount?: number;
  network?: string;
  address?: string;
  status?: string;
  txId?: string;
  txKey?: string;
}
