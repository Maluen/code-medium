import { namespace, waitForEl } from '../common/utils';

function start() {
  if (window.top === window) return; // iframe only

  //console.log('IFRAME ' + window.location.href);

  window.addEventListener('message', event => {
    const message = event.data;
    if (typeof message !== 'object' || message === null) return;
    if (message.from !== namespace('app') || message.to !== namespace('app')) return;
    if (message.topic === 'request:iframe.info') {
      //console.log('IFRAME: got request');

      const gistMetaEl = document.body.querySelector('.gist-meta');
      if (!gistMetaEl) return; // not a gist

      const anchor = [...gistMetaEl.querySelectorAll('a[href^="https://gist.github.com/"]')]
        .find(a => a.href.indexOf('#file-') !== -1);
      const gistId = anchor.href.match(/\/([a-zA-Z0-9]+)#file-/)[1];
      const gistName = anchor.innerText.trim();
      console.log('IFRAME: gist id ' + gistId + ', gist name: ' + gistName);

      window.top.postMessage({
        from: namespace('app'),
        to: namespace('app'),
        topic: 'response:iframe.info',
        data: { gistId, gistName },
      }, '*');
    }
  });

  waitForEl('body').then(() => {
    const isGistIframe = !!document.body.querySelector('script[src^="https://gist.github.com/"]');
    if (isGistIframe) {
      // wait full loading of gist
      waitForEl('.gist-meta').then(() => {
        const documentHeight = document.body.clientHeight;
        console.log('IFRAME GIST, DOCUMENT HEIGHT', documentHeight);
        window.top.postMessage({
          from: namespace('app'),
          to: namespace('app'),
          topic: 'iframe:gist:documentHeight',
          data: { documentHeight },
        }, '*');
      });
    }
  });
}

start();
