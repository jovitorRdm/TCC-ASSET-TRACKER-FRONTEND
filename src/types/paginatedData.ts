import { GenericStatus } from './genericStatus';
import { ProductType } from './productType';

export interface PaginatedRequestParams {
  query?: string;
  page?: number;
  pageSize?: number;
  filterByStatus?: GenericStatus;
  filterByType?: ProductType;
}

export interface PaginatedDataResponse<T> {
  data: T[];
  page: number;
  totalPages: number;
  query?: string;
  filterByStatus?: GenericStatus;
  filterByType?: ProductType;
}
