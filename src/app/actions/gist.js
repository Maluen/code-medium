import services from '../services';
import { CONTEXT } from '../../common/services/RPCService';

const RETRY_DELAY = 3000;
const MAX_RETRIES = -1;

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
          const errorMessage = err instanceof Error ? err.message : String(err);
          console.error(err);

          if (MAX_RETRIES < 0 || retries < MAX_RETRIES) {
            // retry
            const retrySeconds = Math.round(RETRY_DELAY / 1000);
            const timeWord = retrySeconds === 1 ? 'second' : 'seconds';
            const noty = services.noty.showError(`Gist fetch failed. Retrying in ${retrySeconds} ${timeWord}: ${errorMessage}`);
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                noty.close();
                setTimeout(() => { // wait noty close animation
                  tryOne(retries + 1).then(resolve, reject);
                }, 500);
              }, RETRY_DELAY);
            });
          }

          // fail
          services.noty.showError(`Gist fetch failed. Giving up: ${errorMessage}`);
          dispatch({
            type: 'GIST_FETCH_FAILURE',
            errorMessage,
          });
          return Promise.reject(err);
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
        dispatch({ type: 'GIST_CREATE_SUCCESS' });
        services.rpc.sendRequest(CONTEXT.content, null, 'app.gistCreated', gist);
        return gist;
      })
      .catch((err) => {
        const errorMessage = err instanceof Error ? err.message : String(err);
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
        dispatch({ type: 'GIST_EDIT_SUCCESS' });
        services.rpc.sendRequest(CONTEXT.content, null, 'app.gistEdited', gist);
        return gist;
      })
      .catch((err) => {
        const errorMessage = err instanceof Error ? err.message : String(err);
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
        const errorMessage = err instanceof Error ? err.message : String(err);
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
