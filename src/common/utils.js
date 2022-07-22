import config from './config';

const identity = x => x;

function generalTemplate(calculateValue = identity, transformResult = identity) {
  return (strings, ...keys) => {
    const result = strings[0] + keys.reduce((currentResult, key, i) => {
      const value = calculateValue(key);
      return currentResult + value + (strings[i + 1] || '');
    }, '');
    return transformResult(result);
  };
}

const encoderEl = document.createElement('div');
function encodeHTML(html) {
  encoderEl.innerText = html;
  return encoderEl.innerHTML;
}

const parserEl = document.createElement('div');
export const parseHTML = generalTemplate(encodeHTML, elementOuterHTML => {
  parserEl.innerHTML = elementOuterHTML;
  return parserEl.firstElementChild;
});

export function injectCSS(css) {
  const style = document.createElement('style');
  style.innerHTML = css;
  document.head.appendChild(style);
}

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

  array.forEach(info => {
    const [serviceName, ServiceClass] = info;
    services[serviceName] = new ServiceClass();
  });

  const start = async () => {
    for (let i = 0; i < array.length; i++) {
      const info = array[i];
      const [serviceName] = info;
      await services[serviceName].start(services);
    }
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