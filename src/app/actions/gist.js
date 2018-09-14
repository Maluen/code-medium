import services from '../services';
import { CONTEXT } from '../../common/services/RPCService';
import { getErrorMessage } from '../../common/utils';

const RETRY_INITIAL_DELAY = 2000;
const MAX_RETRIES = -1;
const UNRETRYABLE_ERROR_TYPES = ['unauthorized', 'not found'];

export function fetch(gistId, gistName) {
  return (dispatch) => {
    dispatch({ type: 'GIST_FETCH' });

    const tryOne = (retries = 0) => {
      return services.rpc
        .sendRequest(CONTEXT.background, null, 'gist.fetch', { gistId, gistName })
        .then((gist) => {
          dispatch({ type: 'GIST_FETCH_SUCCESS', gist });
          //alert('gist fetch success' + JSON.stringify(gist, null, 2));
          return gist;
        })
        .catch(err => {
          console.error(err);

          const errorMessage = getErrorMessage(err);
          const errorType = (errorMessage || '').toLowerCase().trim();
          const isRetryable = UNRETRYABLE_ERROR_TYPES.indexOf(errorType) === -1;

          if (isRetryable && (MAX_RETRIES < 0 || retries < MAX_RETRIES)) {
            // retry
            const retryDelay = RETRY_INITIAL_DELAY + (retries * RETRY_INITIAL_DELAY);

            const notyText = (timeLeft) => {
              const timeLeftSeconds = Math.round(timeLeft / 1000);
              const timeWord = timeLeftSeconds === 1 ? 'second' : 'seconds';
              return `Gist fetch failed. Retrying in ${timeLeftSeconds} ${timeWord}: ${errorMessage}`;
            };
            const noty = services.noty.showError({
              text: notyText(retryDelay),
              timeout: false,
            });

            return new Promise((resolve, reject) => {
              let timeLeft = retryDelay;
              const interval = setInterval(() => {
                timeLeft -= 1000;
                noty.setText(notyText(timeLeft));
                if (timeLeft <= 0) {
                  clearInterval(interval);
                  noty.close();
                  setTimeout(() => { // wait noty close animation
                    tryOne(retries + 1).then(resolve, reject);
                  }, 500);
                }
              }, 1000);
            });
          }

          // fail
          services.noty.showError(`Gist fetch failed. Giving up: ${errorMessage}`);
          dispatch({
            type: 'GIST_FETCH_FAILURE',
            errorMessage,
          });
          return Promise.reject(!isRetryable ? errorType : 'too many retries');
        });
    };
    return tryOne();
  };
}

export function create(data) {
  return (dispatch) => {
    dispatch({ type: 'GIST_CREATE' });
    return services.rpc
      .sendRequest(CONTEXT.background, null, 'gist.create', data)
      .then(gist => {
        dispatch({ type: 'GIST_CREATE_SUCCESS', gist });
        services.rpc.sendRequest(CONTEXT.content, null, 'app.gistCreated', gist);
        return gist;
      })
      .catch((err) => {
        const errorMessage = getErrorMessage(err);
        dispatch({
          type: 'GIST_CREATE_FAILURE',
          errorMessage,
        });
        services.noty.showError(`Gist creation failed: ${errorMessage}`);
        console.error(err);
        return Promise.reject(err);
      });
  };
}

export function edit(data) {
  return (dispatch) => {
    dispatch({ type: 'GIST_EDIT' });
    return services.rpc
      .sendRequest(CONTEXT.background, null, 'gist.edit', data)
      .then((gist) => {
        dispatch({ type: 'GIST_EDIT_SUCCESS', gist });
        services.rpc.sendRequest(CONTEXT.content, null, 'app.gistEdited', gist);
        return gist;
      })
      .catch((err) => {
        const errorMessage = getErrorMessage(err);
        dispatch({
          type: 'GIST_EDIT_FAILURE',
          errorMessage,
        });
        services.noty.showError(`Gist edit failed: ${errorMessage}`);
        console.error(err);
        return Promise.reject(err);
      });
  };
}

// can't use "delete" as a name since is a reserved keyword
export function deleteGist(gistId) {
  return (dispatch) => {
    dispatch({ type: 'GIST_DELETE' });
    return services.rpc
      .sendRequest(CONTEXT.background, null, 'gist.delete', { gistId })
      .then(() => {
        dispatch({ type: 'GIST_DELETE_SUCCESS' });
        return services.rpc.sendRequest(CONTEXT.content, null, 'app.gistDeleted');
      })
      .catch((err) => {
        const errorMessage = getErrorMessage(err);
        dispatch({
          type: 'GIST_DELETE_FAILURE',
          errorMessage,
        });
        services.noty.showError(`Gist edit failed: ${errorMessage}`);
        console.error(err);
        return Promise.reject(err);
      });
  };
}
