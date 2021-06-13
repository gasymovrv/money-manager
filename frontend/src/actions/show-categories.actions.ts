import { CHANGE_SHOWING_CATEGORIES, RESET_SHOWING_CATEGORIES } from '../constants';
import { ShowingCategoriesActionType } from '../interfaces/actions.interface';
import { ShowingCategoriesParams } from '../interfaces/main-table.interface';

export const changeShowingCategories = (activeShowingOptions: ShowingCategoriesParams): ShowingCategoriesActionType => ({
  type: CHANGE_SHOWING_CATEGORIES,
  payload: {
    activeShowingOptions,
  },
});

export const resetShowingCategories = (): ShowingCategoriesActionType => ({
  type: RESET_SHOWING_CATEGORIES,
  payload: {
    activeShowingOptions: {showExpenseCategories: true, showIncomeCategories: true}
  },
});
