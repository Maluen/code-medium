import browser from 'webextension-polyfill';

import './content.scss';
import { start as startServices } from './services';
import { waitForEl, namespace } from '../common/utils';

function handleButtonClick() {

}

function injectApp() {
  const iframe = document.createElement('iframe');
  iframe.src = browser.runtime.getURL('/app/index.html');
  iframe.className = namespace('iframe');
  iframe.setAttribute('frameborder', '0');
  document.body.appendChild(iframe);
}

async function start() {
  await startServices();

  // TODO: wait for app to be ready before continuing
  injectApp();

  const commandsEl = await waitForEl('.inlineTooltip-menu');

  const buttonEl = commandsEl.firstElementChild.cloneNode(true);
  const title = 'Add github gist';
  buttonEl.setAttribute('title', title);
  buttonEl.setAttribute('aria-label', title);
  buttonEl.setAttribute('data-action', 'inline-menu-gist');

  buttonEl.addEventListener('click', () => {
    alert('clicked');
  });

  commandsEl.appendChild(buttonEl);
}

start();
