import { Income } from './income.interface';
import { Expense } from './expense.interface';
import { SearchResult, SortDirection } from './common.interface';

export class Saving implements SavingResponse {
  id: number;
  date: string;
  value: number;
  incomesSum: number;
  expensesSum: number;
  incomesByType: Map<string, Income[]>;
  expensesByType: Map<string, Expense[]>;

  constructor(id: number,
              date: string,
              value: number,
              incomesSum: number,
              expensesSum: number,
              incomesByType: Map<string, Income[]>,
              expensesByType: Map<string, Expense[]>) {
    this.id = id;
    this.date = date;
    this.value = value;
    this.incomesSum = incomesSum;
    this.expensesSum = expensesSum;
    this.incomesByType = incomesByType;
    this.expensesByType = expensesByType;
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
  incomesByType: any,
  expensesByType: any
}

export class SavingSearchParams {
  from?: string;
  to?: string;
  sortBy?: SavingFieldToSort;
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

export enum SavingFieldToSort {
  DATE = 'DATE',
}