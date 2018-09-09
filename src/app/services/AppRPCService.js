import RPCService, { CONTEXT } from '../../common/services/RPCService';

class AppRPCService extends RPCService {
  constructor() {
    super(CONTEXT.app);
  }

  listenForMessages() {
    window.addEventListener('message', (event) => {
      const message = event.data;
      this.handleIncomingMessage(message);
    });
  }

  sendDown() {
    throw new Error('No down context');
  }

  sendUp(message) {
    // send to content
    window.parent.postMessage(message, '*');
  }
}

export default AppRPCService;
