import { createServices } from '../../common/utils';
import BackgroundRPCService from './BackgroundRPCService';
import ApiService from './ApiService';
import AuthService from './AuthService';
import GistService from './GistService';
import OptionsService from './OptionsService';
import ShortcutsService from './ShortcutsService';

const { services, start } = createServices([
  ['rpc', BackgroundRPCService],
  ['api', ApiService],
  ['auth', AuthService],
  ['gist', GistService],
  ['options', OptionsService],
  ['shortcuts', ShortcutsService],
]);

export default services;
export { start };
