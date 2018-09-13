import browser from 'webextension-polyfill';

function api(path, method, accessToken, body) {
  if (!path.startsWith('/')) {
    path = '/' + path;
  }
  return fetch(`https://api.github.com${path}`, {
    method,
    headers: {
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `token ${accessToken}`,
    },
    cache: 'no-cache',
    body: body ? JSON.stringify(body) : undefined,
  }).then(response => {
    if (!response.ok) throw new Error(response.statusText);
    if (response.status === 204) return;
    return response.json();
  });
}

function apiGet(path, accessToken) {
  return api(path, 'GET', accessToken);
}

function apiPost(path, accessToken, body) {
  return api(path, 'POST', accessToken, body);
}

function apiPatch(path, accessToken, body) {
  return api(path, 'PATCH', accessToken, body);
}

function apiDelete(path, accessToken, body) {
  return api(path, 'DELETE', accessToken, body);
}

class GistService {
  start(services) {
    this.services = services;

    this.services.rpc.registerHandlers({
      'gist.fetch': this.handleFetch,
      'gist.create': this.handleCreate,
      'gist.edit': this.handleEdit,
      'gist.delete': this.handleDelete,
    });
  }

  handleFetch = async ({ gistId }) => {
    const accessToken = await this.services.auth.getAccessToken();
    if (!accessToken) {
      throw new Error('No access token');
    }

    console.log('FETCHING', gistId);

    return apiGet(`/gists/${gistId}`, accessToken);
  }

  handleCreate = async ({ name, description, code, isPublic }) => {
    const accessToken = await this.services.auth.getAccessToken();
    if (!accessToken) {
      throw new Error('No access token');
    }

    console.log('CREATING', name, description, code);

    return apiPost('/gists', accessToken, {
      description,
      public: isPublic,
      files: {
        [name]: {
          content: code,
        },
      },
    });
  }

  handleEdit = async ({ gistId, gistName, name, description, code }) => {
    const accessToken = await this.services.auth.getAccessToken();
    if (!accessToken) {
      throw new Error('No access token');
    }

    console.log('EDITING', gistId, name, description, code);

    return apiPatch(`/gists/${gistId}`, accessToken, {
      description,
      files: {
        [gistName]: { // original name
          filename: name, // new name
          content: code,
        },
      },
    });
  }

  handleDelete = async ({ gistId }) => {
    const accessToken = await this.services.auth.getAccessToken();
    if (!accessToken) {
      throw new Error('No access token');
    }

    console.log('DELETING', gistId);

    return apiDelete(`/gists/${gistId}`, accessToken);
  }
}

export default GistService;
