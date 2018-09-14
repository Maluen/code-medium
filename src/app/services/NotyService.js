import Noty from 'noty';

class NotyService {
  start(services) {
    this.services = services;
  }

  show(options = {}) {
    const noty = new Noty({
      theme: 'mint',
      layout: 'topCenter',
      timeout: 3000,
      ...options,
    });
    noty.show();
    return noty;
  }

  showError(options) {
    if (typeof options === 'string') {
      options = { text: options };
    }

    return this.show({
      type: 'error',
      ...options,
    });
  }

  showWarning(options) {
    if (typeof options === 'string') {
      options = { text: options };
    }

    return this.show({
      type: 'warning',
      ...options,
    });
  }
}

export default NotyService;
