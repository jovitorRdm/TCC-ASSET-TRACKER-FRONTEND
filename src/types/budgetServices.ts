import { Assignment } from './assignment';
import { Product } from './product';
import { ServiceItem } from './serviceItem';

export interface budgetServices {
  id: number;
  budgetId: String;
  serviceId?: String;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  Service?: ServiceItem;
  Assignment?: Assignment;
}

export interface InputBudgetServicesRequestData {
  id: number;
  budgetId: number;
  productId?: String;
  serviceId?: String;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  Product?: Product;
}
