import { ERROR_MAIN_TABLE, LOADING_MAIN_TABLE, SUCCESS_MAIN_TABLE } from '../constants';
import { MainTableActionType } from '../interfaces/actions.interface';
import { MainTableState } from '../interfaces/main-table.interface';

const initialState: MainTableState = {
  incomeCategories: [],
  expenseCategories: [],
  rows: [],
  totalElements: 0,
  isLoading: true
}

const mainTable = (
  state = initialState,
  action: MainTableActionType
): MainTableState => {
  switch (action.type) {
    case LOADING_MAIN_TABLE:
      return {...state, isLoading: true};
    case SUCCESS_MAIN_TABLE:
      return {
        incomeCategories: action.payload.incomeCategories,
        expenseCategories: action.payload.expenseCategories,
        rows: action.payload.rows,
        totalElements: action.payload.totalElements,
        isLoading: false
      };
    case ERROR_MAIN_TABLE:
      return {
        ...state,
        isLoading: false,
        error: action.payload.error
      };
    default:
      return state;
  }
}

export default mainTable;
