import { CHANGE_FILTER, RESET_FILTER } from '../constants';
import { SavingsFilterActionType } from '../interfaces/actions.interface';
import { defaultFilterMap, SavingsFilterParamsMap } from '../interfaces/saving.interface';
import { load } from 'redux-localstorage-simple';

const state: any = load({states: ['savingsFilterMap'], namespace: 'money-manager'});

const initialState: SavingsFilterParamsMap =
  (state && state.savingsFilterMap) ? state.savingsFilterMap : defaultFilterMap;

const savingsFilterMap = (
  state = initialState,
  {type, payload}: SavingsFilterActionType
): SavingsFilterParamsMap => {
  switch (type) {
    case CHANGE_FILTER:
    case RESET_FILTER:
      return payload.activeFilter;
    default:
      return state;
  }
}

export default savingsFilterMap;
