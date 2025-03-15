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

class SubstackService {
  start(services) {
    console.log("substack hey!");
    this.services = services;

    // Disable UI extension On Firefox since simulated paste doesn't work (insertGistIntoPost)
    if (process.env.BROWSER !== 'firefox') {
      this.bindEvents();
      this.extendCommands();
    }

    this.services.rpc.sendRequest(CONTEXT.background, null, 'inject.function', {
      name: 'substack_rewrite_xhr',
    });
  }

  bindEvents() {
    document.body.addEventListener('dblclick', (event) => {
      const gistEl = event.target.closest('.github-gist');
      if (gistEl) {
        const gistMetaEl = gistEl.querySelector('.gist-meta');
        if (gistMetaEl) {
          const anchor = [...gistMetaEl.querySelectorAll('a[href^="https://gist.github.com/"]')]
            .find(a => a.href.indexOf('#file-') !== -1);
          const gistId = anchor.href.match(/\/([a-zA-Z0-9]+)#file-/)[1];
          const gistName = anchor.innerText.trim();
          console.log('gist id ' + gistId + ', gist name: ' + gistName);
          this.handleEditGistClick(gistId, gistName);
        }
      }
    });
  }

  async extendCommands() {
    const check = () => {
      const newCommandsEl = document.querySelector('.tiptap-menu > div');
      if (newCommandsEl && newCommandsEl !== this.commandsEl) {
        this.commandsEl = newCommandsEl;
        const buttons = this.commandsEl.querySelectorAll('button');
        const buttonEl = buttons[buttons.length - 1].parentElement.cloneNode(true);
        const title = 'Insert Github Gist';
        buttonEl.children[0].setAttribute('aria-label', title);
        buttonEl.children[0].setAttribute('title', title);
        buttonEl.children[0].setAttribute('data-test-id', 'code-medium');
        buttonEl.children[0].innerHTML = title;
        buttonEl.classList.add(namespace('substack-button'));
        buttonEl.addEventListener('mousedown', this.handleCreateGistClick);
        this.commandsEl.appendChild(buttonEl);
      }

      const newPostArticleContent = document.querySelector('[data-testid="editor"]');
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
  };

  handleCreateGistClick = () => {
    this.services.app.createGist()
      .then(gist => {
        //alert('CREATED: ' + gist.html_url);
        return this.insertGistIntoPost(gist);
      })
      .catch(err => this.handleAppError(err));
  };

  handleEditGistClick = (gistId, gistName) => {
    this.services.app.editGist(gistId, gistName)
      .then(gist => {
        //alert('EDITED: ' + gist.html_url);
        this.updateGistIntoPost(gist);
      })
      .catch(err => this.handleAppError(err));
  };

  handleAppError = (err) => {
    if (err instanceof Error && err.message === 'deleted') {
      this.deleteGistIntoPost();
      return;
    }

    throw err;
  };

  insertGistIntoPost(gist) {
    const clipboardData = new window.DataTransfer();
    const gistUrl = `https://gist.github.com/${gist.owner.login}/${gist.id}`;
    clipboardData.setData('text/plain', gistUrl);
    document.querySelector('[data-testid="editor"]').dispatchEvent(new window.ClipboardEvent('paste', {
      bubbles: true,
      cancelable: false,
      defaultPrevented: false,
      clipboardData,
    }));
  }

  updateGistIntoPost(gist) {
    this.deleteGistIntoPost();
    this.insertGistIntoPost(gist);
  }

  deleteGistIntoPost() {
    const gistEl = document.querySelector('.github-gist.ProseMirror-selectednode');
    simulateBackspaceKeydown(gistEl);
  }
}

export default SubstackService;
