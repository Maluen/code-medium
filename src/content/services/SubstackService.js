import { waitForEl, namespace } from '../../common/utils';
import { CONTEXT } from '../../common/services/RPCService';

// https://stackoverflow.com/a/3866442/1418049
function moveCursorToEndOfElement(el) {
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

function simulateKeydown(el, keyCode) {
  const keyboardEvent = new KeyboardEvent('keydown', {
    bubbles: true, cancelable: true, keyCode,
  });
  return el.dispatchEvent(keyboardEvent);
}

function simulateEnterKeydown(el) {
  return simulateKeydown(el, 13);
}

function simulateBackspaceKeydown(el) {
  return simulateKeydown(el, 8);
}

class MediumService {
  start(services) {
    console.log("substack hey!");
    this.services = services;

    this.bindEvents();
    this.extendCommands();
  }

  bindEvents() {
    window.addEventListener('message', event => {
      const message = event.data;
      if (typeof message !== 'object' || message === null) return;
      if (message.from !== namespace('app') || message.to !== namespace('app')) return;
      if (message.topic === 'response:iframe.info') {
        if (message.data.gistId) {
          console.log('received from frame: gist id ' + message.data.gistId +
              ', gist name ' + message.data.gistName);
          this.handleEditGistClick(message.data.gistId, message.data.gistName);
        }
      }
      if (message.topic === 'iframe:gist:documentHeight') {
        this.handleGistDocumentHeight(event.source, message.data.documentHeight);
      }
    });

    document.body.addEventListener('dblclick', (event) => {
      if (event.target.classList.contains('iframeContainer')) {
        const iframe = event.target.querySelector('iframe');
        iframe.contentWindow.postMessage({
          from: namespace('app'),
          to: namespace('app'),
          topic: 'request:iframe.info',
        }, '*');
      }
    });
  }

  async extendCommands() {
    const check = () => {
      const newCommandsEl = document.querySelector('.ProseMirror-menu-dropdown-menu');
      if (newCommandsEl && newCommandsEl !== this.commandsEl) {
        this.commandsEl = newCommandsEl;
        const buttons = this.commandsEl.querySelectorAll('.ProseMirror-menu-dropdown-item');
        const buttonEl = buttons[buttons.length - 1].cloneNode(true);
        const title = 'Insert Github Gist';
        buttonEl.children[0].title = title;
        buttonEl.querySelector('span').innerText = 'Github Gist';
        buttonEl.classList.add(namespace('substack-button'));
        buttonEl.setAttribute('aria-label', title);
        buttonEl.setAttribute('data-action', 'inline-menu-gist');
        buttonEl.addEventListener('mousedown', this.handleCreateGistClick);
        this.commandsEl.appendChild(buttonEl);
      }

      const newPostArticleContent = document.querySelector('.postArticle-content');
      if (newPostArticleContent && newPostArticleContent !== this.postArticleContent) {
        this.postArticleContent = newPostArticleContent;
        this.postArticleContent.addEventListener('mouseup', (e) => {
          if (this.services.app.isOpen()) {
            e.preventDefault();
            e.stopImmediatePropagation();
          }
        }, true);
        this.postArticleContent.addEventListener('paste', (e) => {
          if (this.services.app.isOpen()) {
            e.preventDefault();
            e.stopImmediatePropagation();
          }
        }, true);
        this.handleAppOpenState();
      }
    };

    setInterval(check, 100);
    check();
  }

  handleAppOpenState = () => {
    if (this.postArticleContent) {
      this.postArticleContent.setAttribute(
        'contenteditable',
        this.services.app.isOpen() ? 'false' : 'true'
      );
    }
  }

  handleCreateGistClick = () => {
    this.services.app.createGist()
      .then(gist => {
        //alert('CREATED: ' + gist.html_url);
        return this.insertGistIntoPost(gist);
      })
      .catch(err => this.handleAppError(err));
  }

  handleEditGistClick = (gistId, gistName) => {
    this.services.app.editGist(gistId, gistName)
      .then(gist => {
        //alert('EDITED: ' + gist.html_url);
        this.updateGistIntoPost();
      })
      .catch(err => this.handleAppError(err));
  }

  handleAppError = (err) => {
    if (err instanceof Error && err.message === 'deleted') {
      this.deleteGistIntoPost();
      return;
    }

    throw err;
  }

  insertGistIntoPost(gist) {
    const clipboardData = new window.DataTransfer();
    clipboardData.setData('text/plain', gist.html_url);
    document.querySelector('[data-testid="editor"]').dispatchEvent(new window.ClipboardEvent('paste', {
      bubbles: true,
      cancelable: false,
      defaultPrevented: false,
      clipboardData,
    }));
  }

  updateGistIntoPost() {
    // reloading the iframe is enough
    const fieldEl = document.querySelector('figure.is-selected');
    const iframe = fieldEl.querySelector('iframe');
    const src = iframe.src;
    iframe.addEventListener('load', function onload() {
      iframe.removeEventListener('load', onload);
      iframe.src = src;
    });
    iframe.src = '';
  }

  deleteGistIntoPost() {
    const fieldEl = document.querySelector('figure.is-selected');
    simulateBackspaceKeydown(fieldEl);
  }

  handleGistDocumentHeight(iframeWindow, documentHeight) {
    const iframes = Array.from(document.body.querySelectorAll('iframe'));
    const iframe = iframes.find(anIframe => anIframe.contentWindow === iframeWindow);
    if (iframe) {
      const aspectRatioEl = iframe.closest('figure').querySelector('.aspectRatioPlaceholder-fill');

      const iframeComputedStyle = window.getComputedStyle(iframe);
      const iframeVerticalBorder = parseInt(iframeComputedStyle.borderTopWidth, 10) +
        parseInt(iframeComputedStyle.borderBottomWidth, 10);

      aspectRatioEl.style.paddingBottom = `${documentHeight + iframeVerticalBorder}px`;
    }
  }
}

export default MediumService;
