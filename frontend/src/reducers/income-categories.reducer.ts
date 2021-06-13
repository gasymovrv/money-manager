import { ERROR_INC_CATEGORIES, LOADING_INC_CATEGORIES, SUCCESS_INC_CATEGORIES } from '../constants';
import { CategoriesState, IncCategoriesActionType } from '../interfaces/actions.interface';

const initialState: CategoriesState = {
  categories: [],
  isLoading: true,
  initialized: false
}

const incCategoriesState = (
  state = initialState,
  action: IncCategoriesActionType
): CategoriesState => {
  switch (action.type) {
    case LOADING_INC_CATEGORIES:
      return {categories: [], isLoading: true, initialized: true};
    case SUCCESS_INC_CATEGORIES:
      return {categories: action.payload.categories, isLoading: false, initialized: true};
    case ERROR_INC_CATEGORIES:
      return {categories: [], isLoading: false, error: action.payload.error, initialized: true};
    default:
      return state;
  }
}

export default incCategoriesState;
