import { ERROR_EXP_CATEGORIES, LOADING_EXP_CATEGORIES, SUCCESS_EXP_CATEGORIES } from '../constants';
import { CategoriesState, ExpCategoriesActionType } from '../interfaces/actions.interface';

const initialState: CategoriesState = {
  categories: [],
  isLoading: true,
  initialized: false
}

const expCategoriesState = (
  state = initialState,
  action: ExpCategoriesActionType
): CategoriesState => {
  switch (action.type) {
    case LOADING_EXP_CATEGORIES:
      return {categories: [], isLoading: true, initialized: true};
    case SUCCESS_EXP_CATEGORIES:
      return {categories: action.payload.categories, isLoading: false, initialized: true};
    case ERROR_EXP_CATEGORIES:
      return {categories: [], isLoading: false, error: action.payload.error, initialized: true};
    default:
      return state;
  }
}

export default expCategoriesState;
