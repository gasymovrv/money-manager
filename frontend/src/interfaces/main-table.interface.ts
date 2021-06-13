import { Operation, OperationCategory } from './operation.interface';
import { Period } from './common.interface';

export interface Row {
  id: number,
  date: string,
  period: Period,
  isOverdue: boolean,
  incomesSum: number,
  expensesSum: number,
  incomeLists: Array<Operation[] | undefined>,
  expenseLists: Array<Operation[] | undefined>,
  savings: number
}

export type MainTableState = {
  incomeCategories: OperationCategory[],
  expenseCategories: OperationCategory[],
  rows: Row[],
  totalElements: number,
  isLoading: boolean,
  error?: Response
}

export type PaginationParams = {
  page: number,
  pageSize: number
}

export type ShowingCategoriesParams = {
  showIncomeCategories: boolean,
  showExpenseCategories: boolean
}