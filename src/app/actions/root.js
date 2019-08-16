import services from '../services';
import { CONTEXT } from '../../common/services/RPCService';

export function reset() {
  return {
    type: 'ROOT_RESET',
  };
}

export function close() {
  services.rpc.sendRequest(CONTEXT.content, null, 'app.close');
  return {
    type: 'ROOT_CLOSE',
  };
}
