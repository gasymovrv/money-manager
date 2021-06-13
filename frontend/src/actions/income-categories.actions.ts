import { ERROR_INC_CATEGORIES, LOADING_INC_CATEGORIES, SUCCESS_INC_CATEGORIES } from '../constants';
import { IncCategoriesActionType } from '../interfaces/actions.interface';
import { OperationCategory } from '../interfaces/operation.interface';

export const loadingIncCategoriesAction = (): IncCategoriesActionType => ({
  type: LOADING_INC_CATEGORIES
});

export const successIncCategoriesAction = (categories: OperationCategory[]): IncCategoriesActionType => ({
  type: SUCCESS_INC_CATEGORIES,
  payload: {
    categories,
  },
});

export const errorIncCategoriesAction = (error: Response): IncCategoriesActionType => ({
  type: ERROR_INC_CATEGORIES,
  payload: {
    error,
  },
});
