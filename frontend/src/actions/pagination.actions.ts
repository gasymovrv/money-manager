import { CHANGE_PAGINATION, RESET_PAGINATION } from '../constants';
import { PaginationActionType } from '../interfaces/actions.interface';
import { PaginationParams } from '../interfaces/main-table.interface';

export const changePagination = (activePaginationOptions: PaginationParams): PaginationActionType => ({
  type: CHANGE_PAGINATION,
  payload: {
    activePaginationOptions,
  },
});

export const resetPagination = (): PaginationActionType => ({
  type: RESET_PAGINATION,
  payload: {
    activePaginationOptions: {page: 0, pageSize: 500}
  },
});
