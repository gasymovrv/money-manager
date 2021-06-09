import React, { useEffect, useState } from 'react';
import MainTable from '../components/main-table/main-table';
import Header from '../components/header/header';
import { Period, SortDirection } from '../interfaces/common.interface';
import { SavingFieldToSort, SavingsFilterParams } from '../interfaces/saving.interface';
import { MainTableData } from '../interfaces/main-table.interface';
import ErrorNotification from '../components/notification/error.notification';
import moment, { Moment } from 'moment';
import SavingsFilter from '../components/filter/savings-filter';
import { DATE_FORMAT } from '../helpers/date.helper';
import PageContainer from '../components/page-container/page-container';
import { getSavingsAsTable } from '../helpers/api.helper';

const HomePage: React.FC = () => {
  const [{incomeCategories, expenseCategories, rows, totalElements}, setData] = useState<MainTableData>({
    incomeCategories: [],
    expenseCategories: [],
    rows: [],
    totalElements: 0
  })
  const [error, setError] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(500);

  const [selectedFrom, setFrom] = useState<Moment | null>(null);
  const [inputFromValue, setInputFromValue] = useState();
  const [selectedTo, setTo] = useState<Moment | null>(moment().endOf('month'));
  const [inputToValue, setInputToValue] = useState(moment().endOf('month').format(DATE_FORMAT));
  const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.DESC);
  const [sortBy, setSortBy] = useState<SavingFieldToSort>(SavingFieldToSort.DATE);
  const [groupBy, setGroupBy] = useState<Period>(Period.DAY);

  const setTableData = () => {
    let mounted = true;

    if (selectedFrom && selectedFrom.isValid && !selectedFrom.isValid()) {
      return;
    }
    if (selectedTo && selectedTo.isValid && !selectedTo.isValid()) {
      return;
    }
    const filter: SavingsFilterParams = {
      from: inputFromValue,
      to: inputToValue,
      sortDirection: sortDirection,
      sortBy: sortBy,
      groupBy: groupBy
    };

    (async () => {
      if (mounted) {
        setError(false);
        try {
          const data = await getSavingsAsTable(page, pageSize, filter);
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
      sortBy,
      groupBy
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

  const handleGroupBy = (event: React.ChangeEvent<any>) => {
    setGroupBy(event.target.value);
  }

  return (
    <PageContainer>

      <Header isWelcome={false} refreshTable={setTableData}>
        <SavingsFilter
          selectedFrom={selectedFrom}
          inputFromValue={inputFromValue}
          selectedTo={selectedTo}
          inputToValue={inputToValue}
          sortDirection={sortDirection}
          sortBy={sortBy}
          groupBy={groupBy}
          handleChangeFrom={handleChangeFrom}
          handleChangeTo={handleChangeTo}
          handleChangeSortDirection={handleSortDirection}
          handleChangeSortBy={handleSortBy}
          handleChangeGroupBy={handleGroupBy}
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