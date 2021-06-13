import { ERROR_MAIN_TABLE, LOADING_MAIN_TABLE, SUCCESS_MAIN_TABLE } from '../constants';
import { MainTableActionType } from '../interfaces/actions.interface';
import { OperationCategory } from '../interfaces/operation.interface';
import { Row } from '../interfaces/main-table.interface';

export const loadingMainTableAction = (): MainTableActionType => ({
  type: LOADING_MAIN_TABLE
});

export const successMainTableAction = (incomeCategories: OperationCategory[],
                                       expenseCategories: OperationCategory[],
                                       rows: Row[],
                                       totalElements: number): MainTableActionType => ({
  type: SUCCESS_MAIN_TABLE,
  payload: {
    incomeCategories,
    expenseCategories,
    rows,
    totalElements
  },
});

export const errorMainTableAction = (error: Response): MainTableActionType => ({
  type: ERROR_MAIN_TABLE,
  payload: {
    error,
  },
});
