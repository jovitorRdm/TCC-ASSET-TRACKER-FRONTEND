import { Address } from 'cluster';
import { GenericStatus } from './genericStatus';

export interface EventSalons {
  id?: string;
  status: GenericStatus;
  name: string;
  description: string;
  address: Address;
  capacity: number;
  value: number;
}

export interface CreateEventSalonsRequestData {
  name: string;
  description: string;
  address: Address;
  capacity: number;
  value: number;
}
