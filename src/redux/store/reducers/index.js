import { combineReducers } from 'redux'
import vendingMachine from './vendingMachine'
const rootReducer = combineReducers({
  vendingMachine,
});

export default rootReducer;