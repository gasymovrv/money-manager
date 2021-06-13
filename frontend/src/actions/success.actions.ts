import { HIDE_SUCCESS, SHOW_SUCCESS } from '../constants';
import { SuccessActionType } from '../interfaces/actions.interface';

export const showSuccess = (successMsg: string): SuccessActionType => ({
  type: SHOW_SUCCESS,
  payload: {
    successMsg,
  },
});

export const hideSuccess = (): SuccessActionType => ({
  type: HIDE_SUCCESS
});
