import browser from 'webextension-polyfill';

import RPCService, { CONTEXT } from '../../common/services/RPCService';

class BackgroundRPCService extends RPCService {
  constructor() {
    super(CONTEXT.background);
  }

  listenForMessages() {
    // listen to all the contents
    browser.runtime.onMessage.addListener((message, sender) => {
      this.handleIncomingMessage({
        ...message,
        tabId: sender.tab.id,
      });
    });
  }

  sendDown(message) {
    if (typeof message.tabId === 'undefined' || message.tabId === null) {
      throw new Error('message.tab.id must be set');
    }
    return browser.tabs.sendMessage(message.tabId, message);
  }

  sendUp() {
    throw new Error('No up context');
  }
}

export default BackgroundRPCService;
