import browser from 'webextension-polyfill';
import RPCService, { CONTEXT } from '../../common/services/RPCService';
import { makeStartable } from '../../common/utils';

class BackgroundRPCService extends RPCService {
  constructor() {
    super(CONTEXT.background);

    this.listenForMessagesStartable.init();
  }

  listenForMessages() {
    this.listenForMessagesStartable.start();
  }

  listenForMessagesStartable = makeStartable(({ startedPromise }) => {
    // listen to all the contents
    browser.runtime.onMessage.addListener(async (message, sender) => {
      await startedPromise;
      await this.readyPromise; // also wait for the other services to start (or they won't be able to handle the rpc calls)
      this.handleIncomingMessage({
        ...message,
        tabId: sender.tab.id,
      });
    });
  });

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
