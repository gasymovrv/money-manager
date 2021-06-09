import { SavingResponse, SavingSearchRequestParams, SavingsFilterParams } from '../interfaces/saving.interface';
import { MainTableData, Row } from '../interfaces/main-table.interface';
import { getExpenseCategories, getIncomeCategories, getSavings } from '../services/api.service';
import { sortCategories } from './sort.helper';
import { SearchResult } from '../interfaces/common.interface';
import { Operation, OperationCategory } from '../interfaces/operation.interface';
import { formatByPeriod } from './date.helper';

export async function getSavingsAsTable(page: number,
                                        rowsPerPage: number,
                                        filter: SavingsFilterParams): Promise<MainTableData> {
  const expenseCategories = await getExpenseCategories();
  expenseCategories.sort(sortCategories);

  const incomeCategories = await getIncomeCategories();
  incomeCategories.sort(sortCategories);

  const searchResult: SearchResult<SavingResponse> = await getSavings(
    new SavingSearchRequestParams(page, rowsPerPage, filter)
  );
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

    expenseCategories.forEach(({name}: OperationCategory) => {
      const expenses = expensesByCategory.get(name);
      expenseLists.push(expenses);
    })
    incomeCategories.forEach(({name}: OperationCategory) => {
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

  return {
    incomeCategories: incomeCategories,
    expenseCategories: expenseCategories,
    rows,
    totalElements: searchResult.totalElements
  };
}