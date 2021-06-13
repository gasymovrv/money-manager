import { CHANGE_PAGINATION, RESET_PAGINATION } from '../constants';
import { PaginationActionType } from '../interfaces/actions.interface';
import { load } from 'redux-localstorage-simple';
import { PaginationParams } from '../interfaces/main-table.interface';

const state: any = load({states: ['pagination'], namespace: 'money-manager'});

const initialState: PaginationParams = (state && state.pagination) ?
  state.pagination :
  {page: 0, pageSize: 500};

const pagination = (
  state = initialState,
  {type, payload}: PaginationActionType
): PaginationParams => {
  switch (type) {
    case CHANGE_PAGINATION:
    case RESET_PAGINATION:
      return payload.activePaginationOptions;
    default:
      return state;
  }
}

export default pagination;
