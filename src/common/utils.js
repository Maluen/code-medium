import config from './config';

export function waitForEl(selector) {
  return new Promise((resolve) => {
    let checkInterval;
    function check() {
      const el = document.querySelector(selector);
      if (el) {
        clearInterval(checkInterval);
        resolve(el);
      }
    }
    checkInterval = setInterval(check, 100);
    check();
  });
}

export function namespace(...args) {
  const prefix = config.namespace;
  if (args.length === 0) return prefix;
  return args.map(str => prefix + '-' + str).join(' ');
}

// array: [[serviceName, ServiceClass]]
export function createServices(array) {
  const services = {};

  let readyPromiseDefer;
  const readyPromise = new Promise((resolve, reject) => {
    readyPromiseDefer = { resolve, reject };
  });

  array.forEach(info => {
    const [serviceName, ServiceClass] = info;
    services[serviceName] = new ServiceClass();
  });

  const start = async () => {
    for (let i = 0; i < array.length; i++) {
      const info = array[i];
      const [serviceName] = info;
      await services[serviceName].start(services, { readyPromise });
    }
    readyPromiseDefer.resolve();
  };

  return { services, start };
}

export function getUrlQuery(url) {
  const parsedUrl = new URL(url);
  return parsedUrl.search
    .replace('?', '')
    .split('&')
    .reduce((currentResult, string) => {
      const [name, value] = string.split('=');
      currentResult[decodeURIComponent(name)] = decodeURIComponent(value);
      return currentResult;
    }, {});
}

export function getErrorMessage(err) {
  if (typeof err === 'object' && err !== null) {
    if (err.message) return err.message;
    return JSON.stringify(err);
  }

  return String(err);
}

export function makeStartable(fn) {
  let startedPromiseDefer;
  const startedPromise = new Promise((resolve, reject) => {
    startedPromiseDefer = { resolve, reject };
  });

  let initPromise;
  return {
    init: () => {
      initPromise = Promise.resolve(
        fn({
          startedPromise,
        })
      );
    },
    start: () => {
      startedPromiseDefer.resolve();
      return initPromise;
    },
  };
}
