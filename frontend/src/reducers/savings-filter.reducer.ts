import { CHANGE_FILTER, RESET_FILTER } from '../constants';
import { SavingsFilterActionType } from '../interfaces/actions.interface';
import { defaultFilter, SavingsFilterParams } from '../interfaces/saving.interface';
import { load } from 'redux-localstorage-simple';

const state: any = load({states: ["savingsFilter"], namespace: 'money-manager'});

const initialState: SavingsFilterParams = (state && state.savingsFilter) ? state.savingsFilter : defaultFilter;

const savingsFilter = (
  state = initialState,
  {type, payload}: SavingsFilterActionType
): SavingsFilterParams => {
  switch (type) {
    case CHANGE_FILTER:
    case RESET_FILTER:
      return payload.activeFilter;
    default:
      return state;
  }
}

export default savingsFilter;
