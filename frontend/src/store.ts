import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers';
import { save } from 'redux-localstorage-simple'
import thunk from 'redux-thunk';

const store = createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(thunk),
    applyMiddleware(save({
      states: ["savingsFilter", "pagination", "showCategories"],
      namespace: 'money-manager'
    }))
  ),
);

export default store;
