import { Operation } from './operation.interface';
import { SearchResult, SortDirection } from './common.interface';

export class Saving implements SavingResponse {
  id: number;
  date: string;
  value: number;
  incomesSum: number;
  expensesSum: number;
  incomesByCategory: Map<string, Operation[]>;
  expensesByCategory: Map<string, Operation[]>;

  constructor(id: number,
              date: string,
              value: number,
              incomesSum: number,
              expensesSum: number,
              incomesByCategory: Map<string, Operation[]>,
              expensesByCategory: Map<string, Operation[]>) {
    this.id = id;
    this.date = date;
    this.value = value;
    this.incomesSum = incomesSum;
    this.expensesSum = expensesSum;
    this.incomesByCategory = incomesByCategory;
    this.expensesByCategory = expensesByCategory;
  }
}

export class SavingSearchResult implements SearchResult<Saving> {
  result: Saving[];
  totalElements: number;

  constructor(result: Saving[],
              totalElements: number) {
    this.result = result;
    this.totalElements = totalElements;
  }
}

export interface SavingResponse {
  id: number,
  date: string,
  value: number,
  incomesSum: number,
  expensesSum: number,
  incomesByCategory: any,
  expensesByCategory: any
}

export class SavingSearchParams {
  from?: string;
  to?: string;
  sortBy?: SavingFieldToSort;
  sortDirection: SortDirection;
  pageNum: number;
  pageSize: number;

  constructor(
    pageNum: number,
    pageSize: number,
    filter: SavingsFilterParams) {
    this.pageNum = pageNum;
    this.pageSize = pageSize;
    this.from = filter.from;
    this.to = filter.to;
    this.sortDirection = filter.sortDirection;
  }

  public toUrlSearchParams(): URLSearchParams {
    const url = new URLSearchParams()
    const params: any = this;
    Object.keys(params).forEach(key => {
      const param = params[key];
      if (param) {
        url.append(key, param);
      }
    })
    return url;
  }
}

export enum SavingFieldToSort {
  DATE = 'DATE',
}

export interface SavingsFilterParams {
  from?: string;
  to?: string;
  sortBy?: SavingFieldToSort;
  sortDirection: SortDirection;
}