import { EventBudget } from './EventBudget';
import { Address } from './address';
import { budgetProducts } from './budgetProducts';
import { budgetServices } from './budgetServices';
import { Customer } from './customer';
import { EventType } from './event';
import { GenericStatus } from './genericStatus';

export interface Budget {
  id: string;
  typeBudget: TypeBudget;
  customerId: string;
  numberPeople: number;
  pickupDate: Date;
  returnDate: Date;
  totalAmount: number;
  totalCharged: number;
  discount: number;
  eventTypeId?: string;
  budgetServices?: budgetServices[];
  budgetProducts?: budgetProducts[];
  Customer?: Customer;
  EventType?: EventType;
  EventLocation?: EventLocation;
}

export interface CreateBudgetRequestData {
  id: string;
  typeBudget: TypeBudget;
  customerId: string;
  numberPeople: number;
  pickupDate: Date;
  returnDate: Date;
  totalAmount: number;
  totalCharged: number;
  discount: number;
  eventBudget?: EventBudget;
  budgetServices?: budgetServices[];
  budgetProducts?: budgetProducts[];
  Customer?: Customer;
}

export enum TypeBudget {
  event = 'event',
  rent = 'rent',
}

export interface EventLocation {
  id: string;
  name: string;
  address: Address;
  status: GenericStatus;
  value: number;
  capacity: number;
}
