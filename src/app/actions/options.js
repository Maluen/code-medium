import services from '../services';
import { CONTEXT } from '../../common/services/RPCService';
import { getErrorMessage } from '../../common/utils';

export function get(name) {
  return (dispatch) => {
    dispatch({ type: 'OPTIONS_GET', name });

    return services.rpc
      .sendRequest(CONTEXT.background, null, 'options.get', { name })
      .then((value) => {
        dispatch({
          type: 'OPTIONS_GET_SUCCESS',
          name,
          value,
        });
        console.log('Got option', name, value);
        return value;
      })
      .catch(err => {
        const errorMessage = getErrorMessage(err);
        dispatch({
          type: 'OPTIONS_GET_FAILURE',
          name,
          errorMessage,
        });
        console.error(err);
        return Promise.reject(err);
      });
  };
}

export function set(name, value) {
  return (dispatch) => {
    dispatch({ type: 'OPTIONS_SET', name, value });

    return services.rpc
      .sendRequest(CONTEXT.background, null, 'options.set', { name, value })
      .then(() => {
        dispatch({
          type: 'OPTIONS_SET_SUCCESS',
          name,
          value,
        });
      })
      .catch((err) => {
        const errorMessage = getErrorMessage(err);
        dispatch({
          type: 'OPTIONS_SET_FAILURE',
          name,
          value,
          errorMessage,
        });
        console.error(err);
        return Promise.reject(err);
      });
  };
}
