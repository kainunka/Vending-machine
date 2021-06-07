import { createStore , applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'
import AsyncMiddleware from '../reducers/middleware/async';
import CombineActionsMiddleware from '../reducers/middleware/combine-async-actions';

const _getMiddleware = () => {
  const combineMiddleware = new CombineActionsMiddleware().create();
  const asyncMiddleware = new AsyncMiddleware().create();
  return [thunk, combineMiddleware, asyncMiddleware];
};
const middleware = _getMiddleware();
const composedMiddlewares = applyMiddleware(...middleware);
const store = createStore(rootReducer, composedMiddlewares);

export default store;