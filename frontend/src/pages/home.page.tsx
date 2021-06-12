import React, { useEffect, useState } from 'react';
import MainTable from '../components/main-table/main-table';
import Header from '../components/header/header';
import { MainTableData } from '../interfaces/main-table.interface';
import ErrorNotification from '../components/notification/error.notification';
import SavingsFilter from '../components/filter/savings-filter';
import PageContainer from '../components/page-container/page-container';
import { getSavingsAsTable } from '../helpers/api.helper';
import { connect } from 'react-redux';
import { changeFilter, resetFilter } from '../actions/savings-filter.actions';
import { SavingsFilterProps } from '../interfaces/actions.interface';

const HomePage: React.FC<SavingsFilterProps> = (props) => {
  const {savingsFilter} = props;
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

  const setTableData = () => {
    let mounted = true;

    (async () => {
      if (mounted) {
        setError(false);
        try {
          const data = await getSavingsAsTable(page, pageSize, savingsFilter);
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
      savingsFilter
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
        <SavingsFilter {...props}/>
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

export default connect(
  ({savingsFilter}: any) => ({
    savingsFilter
  }),
  {changeFilter, resetFilter}
)(HomePage);