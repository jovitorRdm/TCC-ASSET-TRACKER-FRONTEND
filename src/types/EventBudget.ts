import { BudgetDetail } from './budgetDetail';

export interface EventBudget {
  id: string;
  eventId: string;
  totalAmount: number;
  budgetDetails: BudgetDetail[];
}
