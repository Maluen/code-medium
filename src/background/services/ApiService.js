class ApiService {
  start(services) {
    this.services = services;
  }

  fetch(path, method, accessToken, body) {
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

  get(path, accessToken) {
    return this.fetch(path, 'GET', accessToken);
  }

  post(path, accessToken, body) {
    return this.fetch(path, 'POST', accessToken, body);
  }

  patch(path, accessToken, body) {
    return this.fetch(path, 'PATCH', accessToken, body);
  }

  delete(path, accessToken, body) {
    return this.fetch(path, 'DELETE', accessToken, body);
  }
}

export default ApiService;
