import React, { useEffect } from 'react';
import MainTable from '../components/main-table/main-table';
import Header from '../components/header/header';
import ErrorNotification from '../components/notification/error.notification';
import SavingsFilter from '../components/filter/savings-filter';
import PageContainer from '../components/page-container/page-container';
import { useDispatch, useSelector } from 'react-redux';
import { SavingsFilterParams } from '../interfaces/saving.interface';
import { fetchMainTable } from '../services/async-dispatch.service';
import { LinearProgress } from '@material-ui/core';
import { MainTableState, PaginationParams } from '../interfaces/main-table.interface';
import { COMMON_ERROR_MSG } from '../constants';

const HomePage: React.FC = () => {
  const mainTableState: MainTableState = useSelector(({mainTable}: any) => mainTable);
  const savingsFilter: SavingsFilterParams = useSelector(({savingsFilter}: any) => savingsFilter);
  const pagination: PaginationParams = useSelector(({pagination}: any) => pagination);

  const dispatch = useDispatch();

  useEffect(
    () => {
      dispatch(fetchMainTable(pagination, savingsFilter));
    },
    [
      pagination,
      savingsFilter,
      dispatch
    ])

  return (
    <PageContainer>
      <Header hasActions={!mainTableState.isLoading}>
        <SavingsFilter/>
      </Header>
      {mainTableState.isLoading ?
        <LinearProgress/> :
        <MainTable/>
      }
      {mainTableState.error && <ErrorNotification text={COMMON_ERROR_MSG}/>}
    </PageContainer>
  )
}

export default HomePage;