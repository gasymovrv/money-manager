import {
  CHANGE_FILTER,
  CHANGE_PAGINATION,
  CHANGE_SHOWING_CATEGORIES,
  ERROR_MAIN_TABLE,
  HIDE_ERROR,
  HIDE_SUCCESS,
  LOADING_MAIN_TABLE,
  RESET_FILTER,
  RESET_PAGINATION,
  RESET_SHOWING_CATEGORIES,
  SHOW_ERROR,
  SHOW_SUCCESS,
  SUCCESS_MAIN_TABLE
} from '../constants';
import { SavingsFilterParamsMap } from './saving.interface';
import { OperationCategory } from './operation.interface';
import { PaginationParams, Row, ShowingCategoriesParams } from './main-table.interface';

interface ChangeFilterAction {
  type: typeof CHANGE_FILTER,
  payload: {
    activeFilter: SavingsFilterParamsMap,
  }
}

interface ResetFilterAction {
  type: typeof RESET_FILTER
  payload: {
    activeFilter: SavingsFilterParamsMap,
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

interface ShowErrorAction {
  type: typeof SHOW_ERROR,
  payload: {
    errorMsg: string | null
  }
}

interface HideErrorAction {
  type: typeof HIDE_ERROR,
}

interface ShowSuccessAction {
  type: typeof SHOW_SUCCESS,
  payload: {
    successMsg: string | null
  }
}

interface HideSuccessAction {
  type: typeof HIDE_SUCCESS,
}

export type SavingsFilterActionType = ChangeFilterAction | ResetFilterAction;

export type PaginationActionType = ChangePaginationAction | ResetPaginationAction;

export type ShowingCategoriesActionType = ChangeShowingCategoriesAction | ResetShowingCategoriesAction;

export type MainTableActionType = LoadingMainTableAction | SuccessMainTableAction | ErrorMainTableAction;

export type ErrorActionType = ShowErrorAction | HideErrorAction;

export type SuccessActionType = ShowSuccessAction | HideSuccessAction;