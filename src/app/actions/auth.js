import services from '../services';
import { CONTEXT } from '../../common/services/RPCService';
import { getErrorMessage } from '../../common/utils';

export function fetch() {
  return (dispatch) => {
    dispatch({ type: 'AUTH_FETCH' });

    return services.rpc
      .sendRequest(CONTEXT.background, null, 'auth.fetch')
      .then(({ loggedIn }) => {
        dispatch({
          type: 'AUTH_FETCH_SUCCESS',
          loggedIn,
        });
        return loggedIn;
      })
      .catch(err => {
        const errorMessage = getErrorMessage(err);
        dispatch({
          type: 'AUTH_FETCH_FAILURE',
          errorMessage,
        });
        services.noty.showError(`Auth fetch failed: ${errorMessage}`);
        console.error(err);
        return Promise.reject(err);
      });
  };
}

export function login() {
  return (dispatch) => {
    dispatch({ type: 'AUTH_LOGIN' });

    return services.rpc
      .sendRequest(CONTEXT.background, null, 'auth.login')
      .then(() => {
        dispatch({ type: 'AUTH_LOGIN_SUCCESS' });
        //console.log('login success');
      })
      .catch((err) => {
        const errorMessage = getErrorMessage(err);
        dispatch({
          type: 'AUTH_LOGIN_FAILURE',
          errorMessage,
        });
        services.noty.showError(`Login failed: ${errorMessage}`);
        console.error(err);
        return Promise.reject(err);
      });
  };
}

export function logout() {
  return (dispatch) => {
    dispatch({ type: 'AUTH_LOGOUT' });

    return services.rpc
      .sendRequest(CONTEXT.background, null, 'auth.logout')
      .then(() => {
        dispatch({ type: 'AUTH_LOGOUT_SUCCESS' });
        //console.log('logout success');
        return services.rpc.sendRequest(CONTEXT.content, null, 'app.loggedOut');
      })
      .catch((err) => {
        const errorMessage = getErrorMessage(err);
        dispatch({
          type: 'AUTH_LOGOUT_FAILURE',
          errorMessage,
        });
        services.noty.showError(`Logout failed: ${errorMessage}`);
        console.error(err);
        return Promise.reject(err);
      });
  };
}
