import { applyMiddleware, compose, createStore } from 'redux';
import rootReducer from './reducers';
import { save } from 'redux-localstorage-simple'
import thunk from 'redux-thunk';

/* eslint-disable no-underscore-dangle */
const composeEnhancers =
  process.env.NODE_ENV !== 'production' &&
  typeof window === 'object' &&
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;
/* eslint-enable */

const store = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(thunk),
    applyMiddleware(save({
      states: ["savingsFilter", "pagination", "showCategories"],
      namespace: 'money-manager'
    }))
  ),
);

export default store;
