import { Income } from './income.interface';
import { Expense } from './expense.interface';
import { SearchResult } from './common.interface';

export class Accumulation {
  id: number;
  date: string;
  value: number;
  incomesByType: Map<string, Income>;
  expensesByType: Map<string, Expense>;

  constructor(id: number,
              date: string,
              value: number,
              incomesByType: Map<string, Income>,
              expensesByType: Map<string, Expense>) {
    this.id = id;
    this.date = date;
    this.value = value;
    this.incomesByType = incomesByType;
    this.expensesByType = expensesByType;
  }
}

export class AccumulationSearchResult implements SearchResult<Accumulation> {
  result: Accumulation[];
  totalElements: bigint;

  constructor(result: Accumulation[],
              totalElements: bigint) {
    this.result = result;
    this.totalElements = totalElements;
  }
}

export interface AccumulationResponse {
  id: number,
  date: string,
  value: number,
  incomesByType: any,
  expensesByType: any
}