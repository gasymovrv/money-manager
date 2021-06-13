import { HIDE_SUCCESS, SHOW_SUCCESS } from '../constants';
import { SuccessActionType } from '../interfaces/actions.interface';

const success = (
  state = null,
  action: SuccessActionType
): string | null => {
  switch (action.type) {
    case SHOW_SUCCESS:
      return action.payload.successMsg;
    case HIDE_SUCCESS:
      return null;
    default:
      return state;
  }
}

export default success;
