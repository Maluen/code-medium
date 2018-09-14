import { createServices } from '../../common/utils';
import BackgroundRPCService from './BackgroundRPCService';
import ApiService from './ApiService';
import AuthService from './AuthService';
import GistService from './GistService';

const { services, start } = createServices([
  ['rpc', BackgroundRPCService],
  ['api', ApiService],
  ['auth', AuthService],
  ['gist', GistService],
]);

export default services;
export { start };
