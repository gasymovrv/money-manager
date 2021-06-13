import React, { useEffect, useState } from 'react';
import MainTable from '../components/main-table/main-table';
import Header from '../components/header/header';
import { Row, Rows } from '../interfaces/main-table.interface';
import ErrorNotification from '../components/notification/error.notification';
import SavingsFilter from '../components/filter/savings-filter';
import PageContainer from '../components/page-container/page-container';
import { useDispatch, useSelector } from 'react-redux';
import { getSavings } from '../services/api.service';
import { SearchResult } from '../interfaces/common.interface';
import { SavingResponse, SavingSearchRequestParams } from '../interfaces/saving.interface';
import { Operation, OperationCategory } from '../interfaces/operation.interface';
import { formatByPeriod } from '../helpers/date.helper';
import { fetchExpCategories, fetchIncCategories } from '../helpers/api.helper';
import { CategoriesState } from '../interfaces/actions.interface';
import { LinearProgress } from '@material-ui/core';

const HomePage: React.FC = () => {
  const savingsFilter = useSelector(({savingsFilter}: any) => savingsFilter);
  const expCategoriesState: CategoriesState = useSelector(({expCategoriesState}: any) => expCategoriesState);
  const incCategoriesState: CategoriesState = useSelector(({incCategoriesState}: any) => incCategoriesState);
  const dispatch = useDispatch();
  const [{rows, totalElements}, setData] = useState<Rows>({
    rows: [],
    totalElements: 0
  })
  const [error, setError] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(500);

  const setTableData = () => {
    let mounted = true;

    if (!incCategoriesState.initialized) {
      dispatch(fetchIncCategories());
    }
    if (!expCategoriesState.initialized) {
      dispatch(fetchExpCategories());
    }
    const incomeCategories = incCategoriesState.categories;
    const expenseCategories = expCategoriesState.categories;

    if (!incCategoriesState.isLoading && !expCategoriesState.isLoading) {
      (async () => {
        if (mounted) {
          setError(false);
          if (incCategoriesState.error || expCategoriesState.error) {
            setError(true);
            return;
          }
          try {
            const searchResult: SearchResult<SavingResponse> = await getSavings(
              new SavingSearchRequestParams(page, pageSize, savingsFilter)
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

            setData({rows, totalElements: searchResult.totalElements});
            setLoading(false);
          } catch (err) {
            console.log(`Getting main table error: ${err}`)
            setError(true);
          }
        }
      })();
    }

    return () => {
      mounted = false
    };
  }

  useEffect(
    setTableData,
    [
      page,
      pageSize,
      savingsFilter,
      expCategoriesState,
      incCategoriesState,
      dispatch
    ])

  const handleChangePage = (event: unknown, newPage: number) => {
    setLoading(true);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    setPageSize(+event.target.value);
    setPage(0);
  };

  return (
    <PageContainer>

      <Header isWelcome={false} refreshTable={setTableData}>
        <SavingsFilter/>
      </Header>
      {isLoading ?
        <LinearProgress/> :
        <MainTable
          refreshTable={setTableData}
          rows={rows}
          totalElements={totalElements}
          page={page}
          pageSize={pageSize}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
        />
      }

      {error && <ErrorNotification text="Something went wrong"/>}

    </PageContainer>
  )
}

export default HomePage;