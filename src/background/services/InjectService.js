import browser from 'webextension-polyfill';

const FUNCTIONS = {
  /* eslint-disable no-var, func-names, prefer-rest-params */
  substack_rewrite_xhr: () => {
    console.log('inject: substack_rewrite_xhr');
    const _open = XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function (method, URL) {
      let _onreadystatechange = this.onreadystatechange;
      this.onreadystatechange = () => {
        if (this.readyState === 4 && this.status === 200 && (URL || '').includes('api/v1/github/gist')) {
          try {
            const data = JSON.parse(this.responseText);

            // remove template elements
            // WHY: substack removes them anyway, but keeps their content, breaking the gist.
            // See https://github.com/Maluen/code-medium/issues/11#issuecomment-2192327945
            const parser = document.createElement('div');
            parser.innerHTML = data.innerHTML;
            [...parser.querySelectorAll('template')].forEach((template) => {
              template.remove();
            });
            data.innerHTML = parser.innerHTML;

            // rewrite responseText
            Object.defineProperty(this, 'responseText', {
              value: JSON.stringify(data),
              configurable: true,
              enumerable: true,
            });
          } catch (err) {
            console.error(err);
          }
        }
        // call original callback
        if (_onreadystatechange) _onreadystatechange.apply(this, arguments);
      };

      // detect any onreadystatechange changing
      Object.defineProperty(this, 'onreadystatechange', {
        get: _onreadystatechange,
        set: (value) => {
          _onreadystatechange = value;
        },
        configurable: true,
        enumerable: true,
      });

      return _open.apply(this, arguments);
    };
  },
  /* eslint-enable */
};

class InjectService {
  start(services) {
    this.services = services;

    this.services.rpc.registerHandlers({
      'inject.function': this.handleFunction,
    });
  }

  async handleFunction({ name }, tabId) {
    const func = FUNCTIONS[name];
    browser.scripting
      .executeScript({
        target: {
          tabId,
        },
        func,
        world: 'MAIN',
      });
  }
}

export default InjectService;
