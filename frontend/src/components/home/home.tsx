import React, { useEffect, useState } from 'react';
import MainTable from '../main-table/main-table';
import Header from '../header/header';
import { Container } from '@material-ui/core';
import { Income, IncomeType } from '../../interfaces/income.interface';
import { Expense, ExpenseType } from '../../interfaces/expense.interface';
import { getAccumulations, getExpenseTypes, getIncomeTypes } from '../../services/api.service';
import { SearchResult, SortDirection } from '../../interfaces/common.interface';
import { Accumulation, AccumulationSearchParams } from '../../interfaces/accumulation.interface';
import { HomeState, Row } from '../../interfaces/main-table.interface';
import ErrorNotification from '../notification/error.notification';
import { expenseTypeSort, incomeTypeSort } from '../../helpers/sort.helper';

async function getTable(page: number, rowsPerPage: number): Promise<HomeState> {
  const expenseTypes = await getExpenseTypes();
  expenseTypes.sort(expenseTypeSort);

  const incomeTypes = await getIncomeTypes();
  incomeTypes.sort(incomeTypeSort);

  const searchResult: SearchResult<Accumulation> = await getAccumulations(
    new AccumulationSearchParams(SortDirection.DESC, page, rowsPerPage)
  );
  const accumulations = searchResult.result;
  const rows: Row[] = accumulations.map(({id, date, value, expensesByType, incomesByType}: Accumulation) => {
    const expenses: Array<Expense | undefined> = [];
    const incomes: Array<Income | undefined> = [];

    expenseTypes.forEach(({name}: ExpenseType) => {
      const exp = expensesByType.get(name);
      expenses.push(exp);
    })
    incomeTypes.forEach(({name}: IncomeType) => {
      const inc = incomesByType.get(name);
      incomes.push(inc);
    });

    return {id, date, incomes, expenses, savings: value};
  });

  return {incomeTypes: incomeTypes, expenseTypes: expenseTypes, rows: rows, totalElements: searchResult.totalElements};
}

const Home: React.FC = () => {
  const [{incomeTypes, expenseTypes, rows, totalElements}, setData] = useState<HomeState>({
    incomeTypes: [],
    expenseTypes: [],
    rows: [],
    totalElements: 0
  })
  const [error, setError] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(100);

  const handleChangePage = (event: unknown, newPage: number) => {
    setLoading(true);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    setPageSize(+event.target.value);
    setPage(0);
  };

  const setTableData = () => {
    setError(false);
    getTable(page, pageSize).then((data) => {
        setData(data);
        setLoading(false)
      },
      (err) => {
        console.log(`Getting main table error: ${err}`)
        setError(true);
      })
  }

  useEffect(setTableData, [page, pageSize])

  return (
    <Container maxWidth="xl">
      <Header
        refreshTable={setTableData}
      />
      <MainTable
        refreshTable={setTableData}
        isLoading={isLoading}
        incomeTypes={incomeTypes}
        expenseTypes={expenseTypes}
        rows={rows}
        totalElements={totalElements}
        page={page}
        pageSize={pageSize}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
      />
      {error && <ErrorNotification text="Something went wrong"/>}
    </Container>
  )
}

export default Home;