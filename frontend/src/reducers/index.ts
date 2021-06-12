import { combineReducers } from 'redux';
import savingsFilter from './savings-filter.reducer';

const rootReducer = combineReducers({ savingsFilter });

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
