import browser from 'webextension-polyfill';

import RPCService, { CONTEXT } from '../../common/services/RPCService';
import { namespace } from '../../common/utils';

class ContentRPCService extends RPCService {
  constructor() {
    super(CONTEXT.content);
  }

  listenForMessages() {
    // listen to app
    window.addEventListener('message', (event) => {
      const message = event.data;
      this.handleIncomingMessage(message);
    });

    // listen to background
    browser.runtime.onMessage.addListener(message => {
      this.handleIncomingMessage(message);
    });
  }

  sendDown(message) {
    // send to app
    document.querySelector(`.${namespace('iframe')}`).contentWindow
      .postMessage(message, '*');
  }

  sendUp(message) {
    // send to background
    browser.runtime.sendMessage(message);
  }
}

export default ContentRPCService;
