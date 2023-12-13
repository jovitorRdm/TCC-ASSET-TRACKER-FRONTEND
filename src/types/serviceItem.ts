import { Assignment } from './assignment';
import { GenericStatus } from './genericStatus';

export interface ServiceItem {
  id?: string;
  status: GenericStatus;
  name: string;
  description: string;
  assignmentId: string;
  saleValue: number;
  Assignment?: Assignment;
}

export interface InputServiceItemRequestData {
  id?: string;
  name: string;
  description: string;
  assignmentId: string;
  saleValue: number;
  Assignment?: Assignment;
}
