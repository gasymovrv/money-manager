import { getSavings } from './api.service';
import { errorMainTableAction, loadingMainTableAction, successMainTableAction } from '../actions/main-table.actions';
import {
  SavingResponse,
  SavingSearchRequestParams,
  SavingSearchResult,
  SavingsFilterParams
} from '../interfaces/saving.interface';
import { PaginationParams, Row } from '../interfaces/main-table.interface';
import { Operation, OperationCategory } from '../interfaces/operation.interface';
import { formatByPeriod } from '../helpers/date.helper';

export const fetchMainTable = (paginationParams: PaginationParams,
                               savingsFilter: SavingsFilterParams) => async (dispatch: any) => {
  try {
    const {page, pageSize} = paginationParams;
    dispatch(loadingMainTableAction());
    const searchResult: SavingSearchResult = await getSavings(
      new SavingSearchRequestParams(page, pageSize, savingsFilter)
    );
    const incomeCategories = searchResult.incomeCategories;
    const expenseCategories = searchResult.expenseCategories;

    const savings = searchResult.result;
    const rows: Row[] = savings.map(({
                                       id,
                                       date,
                                       period,
                                       value,
                                       isOverdue,
                                       incomesSum,
                                       expensesSum,
                                       expensesByCategory,
                                       incomesByCategory
                                     }: SavingResponse) => {
      const expenseLists: Array<Operation[] | undefined> = [];
      const incomeLists: Array<Operation[] | undefined> = [];

      expenseCategories
        .filter(({isChecked}) => isChecked)
        .forEach(({name}: OperationCategory) => {
        const expenses = expensesByCategory.get(name);
        expenseLists.push(expenses);
      })
      incomeCategories
        .filter(({isChecked}) => isChecked)
        .forEach(({name}: OperationCategory) => {
        const incomes = incomesByCategory.get(name);
        incomeLists.push(incomes);
      });

      return {
        id,
        date: formatByPeriod(date, period),
        period,
        isOverdue,
        incomesSum,
        expensesSum,
        incomeLists,
        expenseLists,
        savings: value
      }
    });

    dispatch(successMainTableAction(
      incomeCategories,
      expenseCategories,
      rows,
      searchResult.totalElements
    ));
  } catch (err) {
    console.log(`Getting main table error: ${err}`)
    dispatch(errorMainTableAction(err));
  }
};
