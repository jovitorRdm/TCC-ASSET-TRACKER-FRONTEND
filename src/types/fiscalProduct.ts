import { GenericStatus } from './genericStatus';
import { ProductEntries } from './productEntries';
import { Supplier } from './supplier';

export interface FiscalProduct {
  id?: string;
  status: GenericStatus;
  supplierId: string;
  supplier: Supplier;
  invoiceNumber: string;
  issueDate: Date;
  totalAmount: number;
  productEntries: ProductEntries[];
}

export interface InputFiscalProductRequestData {
  id: string;
  status: GenericStatus;
  supplierId: string;
  supplier: Supplier;
  invoiceNumber: string;
  issueDate: Date;
  totalAmount: number;
  productEntries: ProductEntries[];
}
