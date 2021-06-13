import { Operation, OperationCategory } from './operation.interface';
import React from 'react';
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

export interface Categories {
  incomeCategories: OperationCategory[],
  expenseCategories: OperationCategory[]
}

export interface Rows {
  rows: Row[],
  totalElements: number
}

export interface MainTableProps {
  rows: Row[],
  totalElements: number,
  page: number,
  pageSize: number,

  refreshTable(): void,

  handleChangePage(event: unknown, newPage: number): void

  handleChangeRowsPerPage(event: React.ChangeEvent<HTMLInputElement>): void
}