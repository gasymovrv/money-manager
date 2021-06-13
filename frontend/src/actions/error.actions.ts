import { HIDE_ERROR, SHOW_ERROR } from '../constants';
import { ErrorActionType } from '../interfaces/actions.interface';

export const showError = (errorMsg: string): ErrorActionType => ({
  type: SHOW_ERROR,
  payload: {
    errorMsg,
  },
});

export const hideError = (): ErrorActionType => ({
  type: HIDE_ERROR
});
