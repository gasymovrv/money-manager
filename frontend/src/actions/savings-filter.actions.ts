import { CHANGE_FILTER, RESET_FILTER } from '../constants';
import { defaultFilterMap, SavingsFilterParamsMap } from '../interfaces/saving.interface';
import { SavingsFilterActionType } from '../interfaces/actions.interface';

export const changeFilter = (activeFilter: SavingsFilterParamsMap): SavingsFilterActionType => ({
  type: CHANGE_FILTER,
  payload: {
    activeFilter,
  },
});

export const resetFilter = (): SavingsFilterActionType => ({
  type: RESET_FILTER,
  payload: {
    activeFilter: defaultFilterMap,
  },
});
