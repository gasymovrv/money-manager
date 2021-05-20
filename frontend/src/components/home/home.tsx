import React, { useEffect, useState } from 'react';
import MainTable from '../main-table/main-table';
import Header from '../header/header';
import { Container, makeStyles } from '@material-ui/core';
import { Operation, OperationCategory } from '../../interfaces/operation.interface';
import { getExpenseCategories, getIncomeCategories, getSavings } from '../../services/api.service';
import { SearchResult, SortDirection } from '../../interfaces/common.interface';
import { Saving, SavingSearchParams } from '../../interfaces/saving.interface';
import { HomeState, Row } from '../../interfaces/main-table.interface';
import ErrorNotification from '../notification/error.notification';
import { sortCategories } from '../../helpers/sort.helper';
import { createStyles, Theme } from '@material-ui/core/styles';
import WelcomeBox from '../welcome-box/welcome-box';

async function getTable(page: number, rowsPerPage: number): Promise<HomeState> {
  const expenseCategories = await getExpenseCategories();
  expenseCategories.sort(sortCategories);

  const incomeCategories = await getIncomeCategories();
  incomeCategories.sort(sortCategories);

  const searchResult: SearchResult<Saving> = await getSavings(
    new SavingSearchParams(SortDirection.DESC, page, rowsPerPage)
  );
  const savings = searchResult.result;
  const rows: Row[] = savings.map(({
                                     id,
                                     date,
                                     value,
                                     incomesSum,
                                     expensesSum,
                                     expensesByCategory,
                                     incomesByCategory
                                   }: Saving) => {
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
      date,
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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      minWidth: 800,
    }
  })
);

const Home: React.FC = () => {
  const classes = useStyles();
  const [{incomeCategories, expenseCategories, rows, totalElements}, setData] = useState<HomeState>({
    incomeCategories: [],
    expenseCategories: [],
    rows: [],
    totalElements: 0
  })
  const [isWelcome, setIsWelcome] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(100);

  const setTableData = () => {
    let mounted = true;
    (async () => {
      setError(false);
      try {
        const data = await getTable(page, pageSize);
        if (mounted) {
          if (!data.expenseCategories.length && !data.incomeCategories.length) {
            setIsWelcome(true);
          } else {
            setData(data);
            setIsWelcome(false);
          }
          setLoading(false);
        }
      } catch (err) {
        console.log(`Getting main table error: ${err}`)
        if (mounted) setError(true);
      }
    })()
    return function cleanup() {
      mounted = false
    }
  }

  useEffect(setTableData, [page, pageSize])

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
    <Container maxWidth="xl" className={classes.container}>
      <Header
        isWelcome={isWelcome}
        refreshTable={setTableData}
      />
      {isWelcome ?
        <WelcomeBox onStart={() => setIsWelcome(false)}/> :
        <MainTable
          refreshTable={setTableData}
          isLoading={isLoading}
          incomeCategories={incomeCategories}
          expenseCategories={expenseCategories}
          rows={rows}
          totalElements={totalElements}
          page={page}
          pageSize={pageSize}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
        />
      }
      {error && <ErrorNotification text="Something went wrong"/>}
    </Container>
  )
}

export default Home;