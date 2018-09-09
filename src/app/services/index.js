import { createServices } from '../../common/utils';
import AppRPCService from './AppRPCService';
import AuthService from './AuthService';

const { services, start } = createServices([
  ['rpc', AppRPCService],
  ['auth', AuthService],
]);

export default services;
export { start };
