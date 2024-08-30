export interface IMessage {
  id: string;
  owner: string;
  income: boolean;
  content: string;
  read?: boolean;
  favorite?: boolean;
  createdAt: string;
  updatedAt: string;
}
