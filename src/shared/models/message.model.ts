import { IMessage } from '../interfaces';

export class MessageModel {
  id: string;
  owner: string;
  income: boolean;
  content: string;
  read?: boolean;
  favorite?: boolean;
  createdAt: string;
  updatedAt: string;

  constructor(data: IMessage) {
    this.id = data.id;
    this.owner = data.owner;
    this.income = data.income;
    this.content = data.content;
    this.read = data.read || false;
    this.favorite = data.favorite || false;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
