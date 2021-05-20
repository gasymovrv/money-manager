import { Operation, OperationType } from './operation.interface';
import React from 'react';

export interface Row {
  id: number,
  date: string,
  incomesSum: number,
  expensesSum: number,
  incomeLists: Array<Operation[] | undefined>,
  expenseLists: Array<Operation[] | undefined>,
  savings: number
}

export interface HomeState {
  incomeTypes: OperationType[],
  expenseTypes: OperationType[],
  rows: Row[],
  totalElements: number
}

export interface MainTableProps {
  isLoading: boolean,
  incomeTypes: OperationType[],
  expenseTypes: OperationType[],
  rows: Row[],
  totalElements: number,
  page: number,
  pageSize: number,

  refreshTable(): void,

  handleChangePage(event: unknown, newPage: number): void

  handleChangeRowsPerPage(event: React.ChangeEvent<HTMLInputElement>): void
}