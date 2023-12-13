import { Assignment } from './assignment';
import { Product } from './product';
import { ServiceItem } from './serviceItem';

export interface budgetProducts {
  id: number;
  budgetId: String;
  productId?: String;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  Product?: Product;
  Assignment?: Assignment;
}

export interface InputBudgetProductsRequestData {
  id: number;
  budgetId: String;
  productId?: String;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  Product?: Product;
  Assignment?: Assignment;
}
