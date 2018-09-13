import { combineReducers } from 'redux';
import * as reducers from './index';

const appReducer = combineReducers({
  ...reducers,
});

const rootReducer = (state, action) => {
  if (action.type === 'ROOT_RESET') {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
