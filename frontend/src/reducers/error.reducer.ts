import { HIDE_ERROR, SHOW_ERROR } from '../constants';
import { ErrorActionType } from '../interfaces/actions.interface';

const error = (
  state = null,
  action: ErrorActionType
): string | null => {
  switch (action.type) {
    case SHOW_ERROR:
      return action.payload.errorMsg;
    case HIDE_ERROR:
      return null;
    default:
      return state;
  }
}

export default error;
