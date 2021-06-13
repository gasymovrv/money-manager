import { combineReducers } from 'redux';
import savingsFilter from './savings-filter.reducer';
import mainTable from './main-table.reducer';
import pagination from './pagination.reducer';
import showCategories from './show-categories.reducer';
import error from './error.reducer';
import success from './success.reducer';

const rootReducer = combineReducers({ savingsFilter, mainTable, pagination, showCategories, error, success });

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
