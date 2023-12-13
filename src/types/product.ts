import { GenericStatus } from './genericStatus';
import { MeasurementUnit } from './measurementUnite';
import { ProductType } from './productType';

export interface Product {
  id?: string;
  status: GenericStatus;
  name: string;
  description: string;
  measurementUnit: MeasurementUnit;
  consumptionPerPerson: number;
  quantity: number;
  value: number;
  productType: ProductType;
  numberDay?: number;
  percentage?: number;
  SaleValue?: number;
}

export interface InputProductRequestData {
  id?: string;
  status: GenericStatus;
  name: string;
  description: string;
  measurementUnit: MeasurementUnit;
  consumptionPerPerson: number;
  quantity: number;
  value: number;
  productType: ProductType;
  numberDay?: number;
  percentage?: number;
  SaleValue?: number;
}
