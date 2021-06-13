import { ERROR_EXP_CATEGORIES, LOADING_EXP_CATEGORIES, SUCCESS_EXP_CATEGORIES } from '../constants';
import { ExpCategoriesActionType } from '../interfaces/actions.interface';
import { OperationCategory } from '../interfaces/operation.interface';

export const loadingExpCategoriesAction = (): ExpCategoriesActionType => ({
  type: LOADING_EXP_CATEGORIES
});

export const successExpCategoriesAction = (categories: OperationCategory[]): ExpCategoriesActionType => ({
  type: SUCCESS_EXP_CATEGORIES,
  payload: {
    categories,
  },
});

export const errorExpCategoriesAction = (error: Response): ExpCategoriesActionType => ({
  type: ERROR_EXP_CATEGORIES,
  payload: {
    error,
  },
});
