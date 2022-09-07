import browser from 'webextension-polyfill';
import { namespace } from '../../common/utils';
import { CONTEXT } from '../../common/services/RPCService';

class AppService {
  start(services) {
    this.services = services;
    this.pendingOperation = null;

    this.services.rpc.registerHandlers({
      'app.gistCreated': this.handleCreatedGist,
      'app.gistEdited': this.handleEditedGist,
      'app.gistDeleted': this.handleDeletedGist,
      'app.loggedOut': this.rejectAndClose,
      'app.close': this.rejectAndClose,
    });

    this.injectApp();
  }

  injectApp() {
    const container = document.createElement('div');
    container.className = namespace('app', 'hide');
    container.addEventListener('click', this.rejectAndClose);

    const iframe = document.createElement('iframe');
    iframe.name = namespace('app-iframe');
    iframe.src = browser.runtime.getURL('/app/index.html');
    iframe.setAttribute('frameborder', '0');

    container.appendChild(iframe);
    document.body.appendChild(container);

    this.el = container;
  }

  rejectAndClose = (reason = 'closed') => {
    // close app via outside click
    if (this.pendingOperation) {
      this.pendingOperation.reject(new Error(reason));
      this.pendingOperation = null;
    }
    this.close();
  }

  open() {
    this.el.classList.remove(namespace('hide'));
    document.documentElement.classList.add(namespace('app-open'));
    this.services.integration.handleAppOpenState();
  }

  close() {
    this.el.classList.add(namespace('hide'));
    document.documentElement.classList.remove(namespace('app-open'));
    this.services.integration.handleAppOpenState();
    this.reset();
  }

  isOpen = () => {
    return document.documentElement.classList.contains(namespace('app-open'));
  }

  reset() {
    const iframe = this.el.querySelector('iframe');
    const src = iframe.src;
    iframe.addEventListener('load', function onload() {
      iframe.removeEventListener('load', onload);
      iframe.src = src;
    });
    iframe.src = '';
  }

  async createGist() {
    return new Promise((resolve, reject) => {
      // this.open();
      // setTimeout(() => {
      //   resolve({ url: 'https://www.google.com/' });
      //   this.close();
      // }, 3000);
      this.pendingOperation = { resolve, reject };
      this.open();
      this.services.rpc.sendRequest(CONTEXT.app, null, 'app.command', {
        name: 'create',
      });
    });
  }

  handleCreatedGist = (gist) => {
    this.pendingOperation.resolve(gist);
    this.pendingOperation = null;
    this.close();
  }

  async editGist(gistId, gistName) {
    return new Promise((resolve, reject) => {
      this.pendingOperation = { resolve, reject };
      this.open();
      this.services.rpc.sendRequest(CONTEXT.app, null, 'app.command', {
        name: 'edit',
        params: { gistId, gistName },
      });
    });
  }

  handleEditedGist = (gist) => {
    this.pendingOperation.resolve(gist);
    this.pendingOperation = null;
    this.close();
  }

  handleDeletedGist = () => {
    this.rejectAndClose('deleted');
  }
}

export default AppService;
