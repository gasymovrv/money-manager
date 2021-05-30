import { SearchResult, SortDirection } from './common.interface';

export class SavingSearchResult implements SearchResult<SavingResponse> {
  result: SavingResponse[];
  totalElements: number;

  constructor(result: SavingResponse[],
              totalElements: number) {
    this.result = result;
    this.totalElements = totalElements;
  }
}

export interface SavingResponse {
  id: number,
  date: string,
  value: number,
  isOverdue: boolean,
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