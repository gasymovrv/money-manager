import { Income, IncomeType } from './income.interface';
import { Expense, ExpenseType } from './expense.interface';
import React from 'react';

export interface Row {
  id: number
  date: string
  incomes: Array<Income | null | undefined>
  expenses: Array<Expense | null | undefined>
  savings: number
}

export interface HomeState {
  incomeTypes: IncomeType[],
  expenseTypes: ExpenseType[],
  rows: Row[],
  totalElements: number
}

export interface MainTableProps {
  refreshTable(): void,
  isLoading: boolean,
  incomeTypes: IncomeType[],
  expenseTypes: ExpenseType[],
  rows: Row[],
  totalElements: number,
  page: number,
  pageSize: number,
  handleChangePage(event: unknown, newPage: number): void
  handleChangeRowsPerPage(event: React.ChangeEvent<HTMLInputElement>): void
}