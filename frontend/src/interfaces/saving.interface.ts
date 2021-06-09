import { Period, SearchResult, SortDirection } from './common.interface';

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
  period: Period,
  date: string,
  value: number,
  isOverdue: boolean,
  incomesSum: number,
  expensesSum: number,
  incomesByCategory: any,
  expensesByCategory: any
}

export class SavingSearchRequestParams {
  from?: string;
  to?: string;
  sortBy?: SavingFieldToSort;
  groupBy?: Period;
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
    this.sortBy = filter.sortBy;
    this.groupBy = filter.groupBy;
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
  SAVING_VALUE = 'SAVING_VALUE',
}

export interface SavingsFilterParams {
  from?: string;
  to?: string;
  sortBy?: SavingFieldToSort;
  groupBy?: Period;
  sortDirection: SortDirection;
}