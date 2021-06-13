import {
  CHANGE_FILTER,
  ERROR_EXP_CATEGORIES,
  ERROR_INC_CATEGORIES,
  LOADING_EXP_CATEGORIES,
  LOADING_INC_CATEGORIES,
  RESET_FILTER,
  SAVE_EXP_CATEGORIES,
  SAVE_INC_CATEGORIES,
  SUCCESS_EXP_CATEGORIES,
  SUCCESS_INC_CATEGORIES
} from '../constants';
import { SavingsFilterParams } from './saving.interface';
import { OperationCategory } from './operation.interface';

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

interface SaveIncomeCategoriesAction {
  type: typeof SAVE_INC_CATEGORIES,
  payload: {
    categories: OperationCategory[],
  }
}

interface SaveExpenseCategoriesAction {
  type: typeof SAVE_EXP_CATEGORIES,
  payload: {
    categories: OperationCategory[],
  }
}

interface LoadingIncomeCategoriesAction {
  type: typeof LOADING_INC_CATEGORIES
}

interface LoadingExpenseCategoriesAction {
  type: typeof LOADING_EXP_CATEGORIES
}

interface SuccessIncomeCategoriesAction {
  type: typeof SUCCESS_INC_CATEGORIES,
  payload: {
    categories: OperationCategory[],
  }
}

interface SuccessExpenseCategoriesAction {
  type: typeof SUCCESS_EXP_CATEGORIES,
  payload: {
    categories: OperationCategory[],
  }
}

interface ErrorIncomeCategoriesAction {
  type: typeof ERROR_INC_CATEGORIES,
  payload: {
    error: Response,
  }
}

interface ErrorExpenseCategoriesAction {
  type: typeof ERROR_EXP_CATEGORIES,
  payload: {
    error: Response,
  }
}

export type SavingsFilterActionType = ChangeFilterAction | ResetFilterAction;

export type IncCategoriesActionType =
  SaveIncomeCategoriesAction
  | LoadingIncomeCategoriesAction
  | SuccessIncomeCategoriesAction
  | ErrorIncomeCategoriesAction;

export type ExpCategoriesActionType =
  SaveExpenseCategoriesAction
  | LoadingExpenseCategoriesAction
  | SuccessExpenseCategoriesAction
  | ErrorExpenseCategoriesAction;

export type CategoriesState = {
  categories: OperationCategory[],
  isLoading: boolean,
  initialized: boolean,
  error?: Response
}