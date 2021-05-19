import React, { useEffect, useState } from 'react';
import MainTable from '../main-table/main-table';
import Header from '../header/header';
import { Container, makeStyles } from '@material-ui/core';
import { Income, IncomeType } from '../../interfaces/income.interface';
import { Expense, ExpenseType } from '../../interfaces/expense.interface';
import { getExpenseTypes, getIncomeTypes, getSavings } from '../../services/api.service';
import { SearchResult, SortDirection } from '../../interfaces/common.interface';
import { Saving, SavingSearchParams } from '../../interfaces/saving.interface';
import { HomeState, Row } from '../../interfaces/main-table.interface';
import ErrorNotification from '../notification/error.notification';
import { typesSort } from '../../helpers/sort.helper';
import { createStyles, Theme } from '@material-ui/core/styles';
import WelcomeBox from '../welcome-box/welcome-box';

async function getTable(page: number, rowsPerPage: number): Promise<HomeState> {
  const expenseTypes = await getExpenseTypes();
  expenseTypes.sort(typesSort);

  const incomeTypes = await getIncomeTypes();
  incomeTypes.sort(typesSort);

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
                                     expensesByType,
                                     incomesByType
                                   }: Saving) => {
    const expenseLists: Array<Expense[] | undefined> = [];
    const incomeLists: Array<Income[] | undefined> = [];

    expenseTypes.forEach(({name}: ExpenseType) => {
      const expenses = expensesByType.get(name);
      expenseLists.push(expenses);
    })
    incomeTypes.forEach(({name}: IncomeType) => {
      const incomes = incomesByType.get(name);
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

  return {incomeTypes, expenseTypes, rows, totalElements: searchResult.totalElements};
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
  const [{incomeTypes, expenseTypes, rows, totalElements}, setData] = useState<HomeState>({
    incomeTypes: [],
    expenseTypes: [],
    rows: [],
    totalElements: 0
  })
  const [isWelcome, setIsWelcome] = useState<boolean>(false);
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
        if (!data.expenseTypes.length && !data.incomeTypes.length) {
          setIsWelcome(true);
        } else {
          setData(data);
          setIsWelcome(false);
        }
        setLoading(false);
      },
      (err) => {
        console.log(`Getting main table error: ${err}`)
        setError(true);
      })
  }

  useEffect(setTableData, [page, pageSize])

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
          incomeTypes={incomeTypes}
          expenseTypes={expenseTypes}
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