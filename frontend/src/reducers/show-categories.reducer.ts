import { CHANGE_SHOWING_CATEGORIES, RESET_SHOWING_CATEGORIES } from '../constants';
import { ShowingCategoriesActionType } from '../interfaces/actions.interface';
import { load } from 'redux-localstorage-simple';
import { ShowingCategoriesParams } from '../interfaces/main-table.interface';

const state: any = load({states: ['showCategories'], namespace: 'money-manager'});

const initialState: ShowingCategoriesParams = (state && state.showCategories) ?
  state.showCategories :
  {showIncomeCategories: true, showExpenseCategories: true};

const showCategories = (
  state = initialState,
  {type, payload}: ShowingCategoriesActionType
): ShowingCategoriesParams => {
  switch (type) {
    case CHANGE_SHOWING_CATEGORIES:
    case RESET_SHOWING_CATEGORIES:
      return payload.activeShowingOptions;
    default:
      return state;
  }
}

export default showCategories;
