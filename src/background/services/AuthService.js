import browser from 'webextension-polyfill';
import uuidv4 from 'uuid/v4';
import config from '../../common/config';
import { getUrlQuery } from '../../common/utils';

const authConfig = config.auths[process.env.BROWSER];
const { clientId, clientSecret } = authConfig;

const redirectUrl = (process.env.BROWSER === 'firefox')
  ? browser.identity.getRedirectURL()
  : `https://${config.app.ids.chrome}.chromiumapp.org/`;
console.log('OAUTH REDIRECT URL', redirectUrl);

const scope = 'gist';
const getAuthUrl = state => 'https://github.com/login/oauth/authorize?' +
  `client_id=${encodeURIComponent(clientId)}&` +
  `scope=${encodeURIComponent(scope)}&` +
  `state=${encodeURIComponent(state)}&` +
  `redirect_uri=${redirectUrl}`;

const getAccessTokenUrl = (code, state) => 'https://github.com/login/oauth/access_token?' +
  `client_id=${encodeURIComponent(clientId)}&` +
  `client_secret=${encodeURIComponent(clientSecret)}&` +
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
  return fetch(`https://api.github.com/applications/${clientId}/tokens/${accessToken}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Basic ${btoa(clientId + ':' + clientSecret)}`,
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
    this.userId = null;

    this.services.rpc.registerHandlers({
      'auth.fetch': this.handleFetch,
      'auth.login': this.handleLogIn,
      'auth.logout': this.handleLogout,
    });
  }

  handleFetch = async () => {
    const accessToken = await this.getAccessToken();
    const userId = await this.getUserId();
    return {
      loggedIn: !!accessToken,
      userId,
    };
  }

  handleLogIn = async () => {
    const { code, state } = await getAuthCode();
    const accessToken = await getAccessToken(code, state);
    const { id: userId } = await this.services.api.get('/user', accessToken);

    await this.saveAccessToken(accessToken);
    await this.saveUserId(userId);

    return { userId };
  }

  handleLogout = async () => {
    const accessToken = await this.getAccessToken();
    if (!accessToken) {
      throw new Error('No access token');
    }

    await revokeAccessToken(accessToken);
    await this.saveAccessToken(null);
    await this.saveUserId(null);
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

  async saveUserId(userId) {
    this.userId = userId;
    await browser.storage.local.set({ userId });
  }

  async getUserId() {
    if (typeof this.userId === 'undefined' || this.userId === null) {
      const storedObj = await browser.storage.local.get({ userId: null });
      this.userId = storedObj.userId;
    }
    return this.userId;
  }
}

export default AuthService;
