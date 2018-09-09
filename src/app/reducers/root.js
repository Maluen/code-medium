import { combineReducers } from 'redux';
import * as reducers from './index';

const appReducer = combineReducers({
  ...reducers,
});

const rootReducer = (state, action) => {
  return appReducer(state, action);
};

export default rootReducer;
