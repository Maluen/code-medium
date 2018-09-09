import { createServices } from '../../common/utils';
import BackgroundRPCService from './BackgroundRPCService';
import AuthService from './AuthService';

const { services, start } = createServices([
  ['rpc', BackgroundRPCService],
  ['auth', AuthService],
]);

export default services;
export { start };
