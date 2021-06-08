import { createStore , applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers'

const _getMiddleware = () => {
  return [thunk];
};
const middleware = _getMiddleware();
const composedMiddlewares = applyMiddleware(...middleware);
const store = createStore(rootReducer, composedMiddlewares);

export default store;