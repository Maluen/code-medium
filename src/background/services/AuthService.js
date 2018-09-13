import browser from 'webextension-polyfill';
import uuidv4 from 'uuid/v4';
import config from '../../common/config';
import { getUrlQuery } from '../../common/utils';

const redirectUrl = `https://${config.appId}.chromiumapp.org/`;

const scope = 'gist';
const getAuthUrl = state => 'https://github.com/login/oauth/authorize?' +
  `client_id=${encodeURIComponent(config.auth.clientId)}&` +
  `scope=${encodeURIComponent(scope)}&` +
  `state=${encodeURIComponent(state)}&` +
  `redirect_uri=${redirectUrl}`;

const getAccessTokenUrl = (code, state) => 'https://github.com/login/oauth/access_token?' +
  `client_id=${encodeURIComponent(config.auth.clientId)}&` +
  `client_secret=${encodeURIComponent(config.auth.clientSecret)}&` +
  `code=${encodeURIComponent(code)}&` +
  `state=${encodeURIComponent(state)}&` +
  `redirect_uri=${redirectUrl}`;

function getAuthCode() {
  const state = uuidv4();
  const url = getAuthUrl(state);
  return browser.identity.launchWebAuthFlow({ url, interactive: true })
    .then(redirectUrl => {
      const { state: receivedState, code } = getUrlQuery(redirectUrl);
      if (receivedState !== state) {
        throw new Error('Sent and received state don\'t match');
      }
      return { code, state };
    });
}

function getAccessToken(code, state) {
  const url = getAccessTokenUrl(code, state);
  return fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  }).then(response => {
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
  }).then(json => json.access_token);
}

function revokeAccessToken(accessToken) {
  return fetch(`https://api.github.com/applications/${config.auth.clientId}/tokens/${accessToken}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Basic ${btoa(config.auth.clientId + ':' + config.auth.clientSecret)}`,
    },
  }).then(response => {
    // 404 here just means that the user is already logged out
    // e.g. they disconnected the application directly in github
    if (!response.ok && response.status !== 404) {
      throw new Error(response.statusText);
    }
    return response;
  });
}

class AuthService {
  start(services) {
    this.services = services;
    this.accessToken = null;

    this.services.rpc.registerHandlers({
      'auth.fetch': this.handleFetch,
      'auth.login': this.handleLogIn,
      'auth.logout': this.handleLogout,
    });
  }

  handleFetch = async () => {
    const accessToken = await this.getAccessToken();
    return {
      loggedIn: !!accessToken,
    };
  }

  handleLogIn = async () => {
    const { code, state } = await getAuthCode();
    const accessToken = await getAccessToken(code, state);
    await this.saveAccessToken(accessToken);
  }

  handleLogout = async () => {
    const accessToken = await this.getAccessToken();
    if (!accessToken) {
      throw new Error('No access token');
    }

    await revokeAccessToken(accessToken);
    await this.saveAccessToken(null);
  }

  async saveAccessToken(accessToken) {
    this.accessToken = accessToken;
    await browser.storage.local.set({ accessToken });
  }

  async getAccessToken() {
    if (!this.accessToken) {
      const storedObj = await browser.storage.local.get({ accessToken: '' });
      this.accessToken = storedObj.accessToken;
    }
    return this.accessToken;
  }
}

export default AuthService;
