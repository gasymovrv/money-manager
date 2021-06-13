import { combineReducers } from 'redux';
import savingsFilter from './savings-filter.reducer';
import incCategoriesState from './income-categories.reducer';
import expCategoriesState from './expense-categories.reducer';

const rootReducer = combineReducers({ savingsFilter, incCategoriesState, expCategoriesState });

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
