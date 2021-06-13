import { getExpenseCategories, getIncomeCategories } from '../services/api.service';
import {
  errorIncCategoriesAction,
  loadingIncCategoriesAction,
  successIncCategoriesAction
} from '../actions/income-categories.actions';
import {
  errorExpCategoriesAction,
  loadingExpCategoriesAction,
  successExpCategoriesAction
} from '../actions/expense-categories.actions';

export const fetchIncCategories = () => async (dispatch: any) => {
  try {
    dispatch(loadingIncCategoriesAction());
    const asyncData = await getIncomeCategories()
    dispatch(successIncCategoriesAction(asyncData));
  } catch (error) {
    dispatch(errorIncCategoriesAction(error));
  }
};

export const fetchExpCategories = () => async (dispatch: any) => {
  try {
    dispatch(loadingExpCategoriesAction());
    const asyncData = await getExpenseCategories()
    dispatch(successExpCategoriesAction(asyncData));
  } catch (error) {
    dispatch(errorExpCategoriesAction(error));
  }
};