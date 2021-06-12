import { CHANGE_FILTER, RESET_FILTER } from '../constants';
import { SavingsFilterParams } from './saving.interface';

interface ChangeFilterAction {
  type: typeof CHANGE_FILTER,
  payload: {
    activeFilter: SavingsFilterParams,
  }
}
interface ResetFilterAction {
  type: typeof RESET_FILTER
  payload: {
    activeFilter: SavingsFilterParams,
  }
}
export type SavingsFilterActionType = ChangeFilterAction | ResetFilterAction;

export type SavingsFilterProps = {
  savingsFilter: SavingsFilterParams,
  changeFilter(activeFilter: SavingsFilterParams): SavingsFilterActionType,
  resetFilter(): SavingsFilterActionType,
}