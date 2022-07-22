import browser from 'webextension-polyfill';
import { CONTEXT } from '../../common/services/RPCService';
import { makeStartable } from '../../common/utils';

class ShortcutsService {
  constructor() {
    this.listenForExtensionCommands.init(); // in constructor to have sync bind (MV3)
  }

  async start(services) {
    this.services = services;

    await this.listenForExtensionCommands.start();
  }

  listenForExtensionCommands = makeStartable(async ({ startedPromise }) => {
    browser.commands.onCommand.addListener(async (command) => {
      await startedPromise;
      if (command === 'medium-create-gist') {
        const tabs = await browser.tabs.query({
          active: true,
          currentWindow: true,
        });
        const currentTab = tabs[0];
        if (currentTab) {
          this.services.rpc.sendRequest(CONTEXT.content, currentTab.id, 'medium.createGist');
        }
      }
    });
  });
}

export default ShortcutsService;
