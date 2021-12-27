import React, { useContext, useEffect } from 'react';
import MainTable from '../components/main-table/main-table';
import Header from '../components/header/header';
import ErrorNotification from '../components/notification/error.notification';
import SavingsFilter from '../components/filter/savings-filter';
import PageContainer from '../components/page-container/page-container';
import { useDispatch, useSelector } from 'react-redux';
import { SavingsFilterParamsMap } from '../interfaces/saving.interface';
import { fetchMainTable } from '../services/async-dispatch.service';
import { LinearProgress } from '@material-ui/core';
import { MainTableState, PaginationParams } from '../interfaces/main-table.interface';
import { COMMON_ERROR_MSG } from '../constants';
import { AuthContext } from '../interfaces/auth-context.interface';
import { getSavingsFilter } from '../helpers/common.helper';

const HomePage: React.FC = () => {
  const mainTableState: MainTableState = useSelector(({mainTable}: any) => mainTable);
  const pagination: PaginationParams = useSelector(({pagination}: any) => pagination);
  const accountId = useContext(AuthContext).user.currentAccount.id;
  const savingsFilterMap: SavingsFilterParamsMap = useSelector(({savingsFilterMap}: any) => savingsFilterMap);
  const savingsFilter = getSavingsFilter(accountId, savingsFilterMap);

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