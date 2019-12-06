import browser from 'webextension-polyfill';

const prefix = 'options.';

// NOTE: these options are accessible from the content app.
// Do not put anything sensitive (like the accessToken) here.
class OptionsService {
  start(services) {
    this.services = services;

    this.services.rpc.registerHandlers({
      'options.get': this.handleGet,
      'options.set': this.handleSet,
    });
  }

  async handleGet({ name }) {
    const realName = prefix + name;
    const storedObj = await browser.storage.local.get({ [realName]: null });
    return storedObj[realName];
  }

  async handleSet({ name, value }) {
    const realName = prefix + name;
    await browser.storage.local.set({ [realName]: value });
  }
}

export default OptionsService;
