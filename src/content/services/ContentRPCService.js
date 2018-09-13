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
    const iframe = document.querySelector(`.${namespace('app')} iframe`);
    const iframeWindow = iframe && iframe.contentWindow;
    if (iframeWindow) iframeWindow.postMessage(message, '*');
  }

  sendUp(message) {
    // send to background
    return browser.runtime.sendMessage(message);
  }
}

export default ContentRPCService;
