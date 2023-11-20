import { GenericStatus } from './genericStatus';

export interface ProductEntries {
  id?: string;
  name: string;
  quantity: number;
  value: number;
}

export interface InputProductEntriesRequestData {
  id?: string;
  status: GenericStatus;
  productId: string;
  quantity: number;
  value: number;
}
