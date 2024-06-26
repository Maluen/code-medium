import { v4 as uuidv4 } from 'uuid';

import { namespace } from '../utils';

const CONTEXT = {
  background: namespace('background'),
  content: namespace('content'),
  app: namespace('app'),
};

// NOTE: make sure to define all the available contexts here
const contextsChain = [
  CONTEXT.background,
  CONTEXT.content,
  CONTEXT.app,
];

function isValidMessage(message) {
  return (typeof message === 'object' && message !== null) &&
    (message.from && message.from.startsWith(namespace())) &&
    (message.to && message.to.startsWith(namespace())) &&
    message.id &&
    message.type;
}

function isErrorJsonObject(err) {
  return typeof err === 'object' &&
    err !== null &&
    'message' in err &&
    'stack' in err;
}

class RPCService {
  constructor(context) {
    this.contextIndex = contextsChain.indexOf(context);
    if (this.contextIndex === -1) {
      throw new Error('Unrecognized context');
    }
    this.context = context;

    this.pendingRequests = {}; // <id, { resolve, reject }>
    this.requestHandlers = {}; // <topic, function>
  }

  start(services, { readyPromise }) {
    this.services = services;
    this.readyPromise = readyPromise;

    this.listenForMessages();
  }

  registerHandlers(handlers) {
    Object.keys(handlers).forEach(topic => {
      const func = handlers[topic];
      if (this.requestHandlers[topic]) {
        throw new Error(`${topic} is already registered`);
      }
      this.requestHandlers[topic] = func;
    });
  }

  listenForMessages() {
    throw new Error('Not implemented');
  }

  handleIncomingMessage(message) {
    if (!isValidMessage(message)) return;

    if (message.to === this.context) {
      if (message.type === 'response') {
        const pendingRequest = this.pendingRequests[message.id];
        if (!pendingRequest) return;
        delete this.pendingRequests[message.id];
        if (message.err) {
          let err;
          if (isErrorJsonObject(message.err)) {
            err = new Error(message.err.message);
            err.stack = message.err.stack;
          } else {
            err = message.err;
          }
          pendingRequest.reject(err);
        } else {
          pendingRequest.resolve(message.data);
        }
        return;
      }

      if (message.type === 'request') {
        Promise.resolve()
          .then(() => {
            if (!message.topic) {
              throw new Error('request handling: message topic is not set');
            }
            const handler = this.requestHandlers[message.topic];
            if (!handler) {
              throw new Error(`${message.topic} has no handler`);
            }
            return handler;
          })
          .then(handler => handler(message.data || {}, message.tabId))
          .then(data => {
            // NOTE: invert message.from and message.to to send back the message
            return this.sendResponse(message.from, message.tabId, message.id, undefined, data);
          })
          .catch(err => {
            return this.sendResponse(message.from, message.tabId, message.id, err);
          });
        return;
      }
    }

    this.sendFromContext(message.from, message);
  }

  sendRequest(toContext, tabId, topic, data) {
    return new Promise((resolve, reject) => {
      try {
        const id = uuidv4();
        this.pendingRequests[id] = { resolve, reject };
        this.sendToContext(toContext, {
          tabId,
          id,
          type: 'request',
          from: this.context,
          to: toContext,
          topic,
          data,
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  sendResponse(toContext, tabId, id, err, data) {
    return this.sendToContext(toContext, {
      tabId,
      id,
      type: 'response',
      from: this.context,
      to: toContext,
      err: err instanceof Error
        ? { message: err.message, stack: err.stack }
        : err,
      data,
    });
  }

  sendFromContext(fromContext, message) {
    const fromContextIndex = contextsChain.indexOf(fromContext);
    if (fromContextIndex === -1) {
      throw new Error(`Unrecognized fromContext: ${fromContext}`);
    }
    if (fromContextIndex === this.contextIndex) {
      throw new Error(`fromContext can't be equal to current context: ${fromContext}`);
    }
    if (fromContextIndex < this.contextIndex) {
      return this.sendDown(message);
    }
    return this.sendUp(message);
  }

  sendToContext(toContext, message) {
    const toContextIndex = contextsChain.indexOf(toContext);
    if (toContextIndex === -1) {
      throw new Error(`Unrecognized toContext: ${toContext}`);
    }
    if (toContextIndex === this.contextIndex) {
      throw new Error(`toContext can't be equal to current context: ${toContext}`);
    }
    if (toContextIndex < this.contextIndex) {
      return this.sendUp(message);
    }
    return this.sendDown(message);
  }

  sendDown() {
    throw new Error('Not implemented');
  }

  sendUp() {
    throw new Error('Not implemented');
  }
}

export default RPCService;
export { CONTEXT };
