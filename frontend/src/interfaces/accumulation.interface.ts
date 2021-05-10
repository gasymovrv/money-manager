import { Income } from './income.interface';
import { Expense } from './expense.interface';
import { SearchResult, SortDirection } from './common.interface';

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
  totalElements: number;

  constructor(result: Accumulation[],
              totalElements: number) {
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

export class AccumulationSearchParams {
  from?: string;
  to?: string;
  sortBy?: AccumulationFieldToSort;
  sortDirection: SortDirection;
  pageNum: number;
  pageSize: number;

  constructor(sortDirection: SortDirection, pageNum: number, pageSize: number) {
    this.sortDirection = sortDirection;
    this.pageNum = pageNum;
    this.pageSize = pageSize;
  }

  public toUrlSearchParams():URLSearchParams {
    const url = new URLSearchParams()
    const params:any = this;
    Object.keys(params).forEach(key => {
      const param = params[key];
      if (param) {
        url.append(key, param);
      }
    })
    return url;
  }
}

export enum AccumulationFieldToSort {
  DATE = 'DATE',
}