import React, { useEffect, useState } from 'react';
import MainTable from '../components/main-table/main-table';
import Header from '../components/header/header';
import { Operation, OperationCategory } from '../interfaces/operation.interface';
import { getExpenseCategories, getIncomeCategories, getSavings } from '../services/api.service';
import { SearchResult, SortDirection } from '../interfaces/common.interface';
import {
  SavingFieldToSort,
  SavingResponse,
  SavingSearchParams,
  SavingsFilterParams
} from '../interfaces/saving.interface';
import { HomeState, Row } from '../interfaces/main-table.interface';
import ErrorNotification from '../components/notification/error.notification';
import { sortCategories } from '../helpers/sort.helper';
import moment, { Moment } from 'moment';
import SavingsFilter from '../components/filter/savings-filter';
import { DATE_FORMAT } from '../helpers/date.helper';
import PageContainer from '../components/page-container/page-container';

async function getTable(page: number, rowsPerPage: number, filter: SavingsFilterParams): Promise<HomeState> {
  const expenseCategories = await getExpenseCategories();
  expenseCategories.sort(sortCategories);

  const incomeCategories = await getIncomeCategories();
  incomeCategories.sort(sortCategories);

  const searchResult: SearchResult<SavingResponse> = await getSavings(
    new SavingSearchParams(page, rowsPerPage, filter)
  );
  const savings = searchResult.result;
  const rows: Row[] = savings.map(({
                                     id,
                                     date,
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
      date,
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

const HomePage: React.FC = () => {
  const [{incomeCategories, expenseCategories, rows, totalElements}, setData] = useState<HomeState>({
    incomeCategories: [],
    expenseCategories: [],
    rows: [],
    totalElements: 0
  })
  const [error, setError] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(100);

  const [selectedFrom, setFrom] = useState<Moment | null>(null);
  const [inputFromValue, setInputFromValue] = useState();
  const [selectedTo, setTo] = useState<Moment | null>(moment());
  const [inputToValue, setInputToValue] = useState(moment().format(DATE_FORMAT));
  const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.DESC);
  const [sortBy, setSortBy] = useState<SavingFieldToSort>(SavingFieldToSort.DATE);

  const setTableData = () => {
    let mounted = true;

    if (selectedFrom && selectedFrom.isValid && !selectedFrom.isValid()) {
      return;
    }
    if (selectedTo && selectedTo.isValid && !selectedTo.isValid()) {
      return;
    }
    const filter = {
      from: inputFromValue,
      to: inputToValue,
      sortDirection: sortDirection,
      sortBy: sortBy
    };

    (async () => {
      if (mounted) {
        setError(false);
        try {
          const data = await getTable(page, pageSize, filter);
          setData(data);
          setLoading(false);
        } catch (err) {
          console.log(`Getting main table error: ${err}`)
          setError(true);
        }
      }
    })();

    return () => {
      mounted = false
    };
  }

  useEffect(
    setTableData,
    [
      page,
      pageSize,
      selectedFrom,
      selectedTo,
      inputToValue,
      inputFromValue,
      sortDirection,
      sortBy
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

  const handleChangeFrom = (date: any, value: any) => {
    setFrom(date);
    setInputFromValue(value);
  }

  const handleChangeTo = (date: any, value: any) => {
    setTo(date);
    setInputToValue(value);
  }

  const handleSortDirection = (event: React.ChangeEvent<any>) => {
    setSortDirection(event.target.value);
  }

  const handleSortBy = (event: React.ChangeEvent<any>) => {
    setSortBy(event.target.value);
  }

  console.log('Home Page rendering');
  return (
    <PageContainer>
      <Header
        isWelcome={false}
        refreshTable={setTableData}
      >
        <SavingsFilter
          selectedFrom={selectedFrom}
          inputFromValue={inputFromValue}
          selectedTo={selectedTo}
          inputToValue={inputToValue}
          sortDirection={sortDirection}
          sortBy={sortBy}
          handleChangeFrom={handleChangeFrom}
          handleChangeTo={handleChangeTo}
          handleChangeSortDirection={handleSortDirection}
          handleChangeSortBy={handleSortBy}
        />
      </Header>
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
      {error && <ErrorNotification text="Something went wrong"/>}
    </PageContainer>
  )
}

export default HomePage;