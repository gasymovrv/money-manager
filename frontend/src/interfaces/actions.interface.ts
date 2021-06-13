import {
  CHANGE_FILTER,
  CHANGE_PAGINATION,
  CHANGE_SHOWING_CATEGORIES,
  ERROR_MAIN_TABLE,
  LOADING_MAIN_TABLE,
  RESET_FILTER,
  RESET_PAGINATION,
  RESET_SHOWING_CATEGORIES,
  SUCCESS_MAIN_TABLE
} from '../constants';
import { SavingsFilterParams } from './saving.interface';
import { OperationCategory } from './operation.interface';
import { PaginationParams, Row, ShowingCategoriesParams } from './main-table.interface';

interface ChangeFilterAction {
  type: typeof CHANGE_FILTER,
  payload: {
    activeFilter: SavingsFilterParams,
  }
}

interface ResetFilterAction {
  type: typeof RESET_FILTER
  payload: {
    activeFilter: SavingsFilterParams,
  }
}

interface ChangePaginationAction {
  type: typeof CHANGE_PAGINATION,
  payload: {
    activePaginationOptions: PaginationParams,
  }
}

interface ResetPaginationAction {
  type: typeof RESET_PAGINATION,
  payload: {
    activePaginationOptions: PaginationParams,
  }
}

interface ChangeShowingCategoriesAction {
  type: typeof CHANGE_SHOWING_CATEGORIES,
  payload: {
    activeShowingOptions: ShowingCategoriesParams,
  }
}

interface ResetShowingCategoriesAction {
  type: typeof RESET_SHOWING_CATEGORIES,
  payload: {
    activeShowingOptions: ShowingCategoriesParams,
  }
}

interface LoadingMainTableAction {
  type: typeof LOADING_MAIN_TABLE
}

interface SuccessMainTableAction {
  type: typeof SUCCESS_MAIN_TABLE,
  payload: {
    incomeCategories: OperationCategory[],
    expenseCategories: OperationCategory[],
    rows: Row[],
    totalElements: number
  }
}

interface ErrorMainTableAction {
  type: typeof ERROR_MAIN_TABLE,
  payload: {
    error: Response,
  }
}

export type SavingsFilterActionType = ChangeFilterAction | ResetFilterAction;

export type PaginationActionType = ChangePaginationAction | ResetPaginationAction;

export type ShowingCategoriesActionType = ChangeShowingCategoriesAction | ResetShowingCategoriesAction;

export type MainTableActionType = LoadingMainTableAction | SuccessMainTableAction | ErrorMainTableAction;