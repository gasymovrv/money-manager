import { Income, IncomeType } from './income.interface';
import { Expense, ExpenseType } from './expense.interface';
import React from 'react';

export interface Row {
  id: number,
  date: string,
  incomesSum: number,
  expensesSum: number,
  incomeLists: Array<Income[] | undefined>,
  expenseLists: Array<Expense[] | undefined>,
  savings: number
}

export interface HomeState {
  incomeTypes: IncomeType[],
  expenseTypes: ExpenseType[],
  rows: Row[],
  totalElements: number
}

export interface MainTableProps {
  isLoading: boolean,
  incomeTypes: IncomeType[],
  expenseTypes: ExpenseType[],
  rows: Row[],
  totalElements: number,
  page: number,
  pageSize: number,

  refreshTable(): void,

  handleChangePage(event: unknown, newPage: number): void

  handleChangeRowsPerPage(event: React.ChangeEvent<HTMLInputElement>): void
}