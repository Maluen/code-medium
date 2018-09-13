import { createServices } from '../../common/utils';
import AppRPCService from './AppRPCService';
import NotyService from './NotyService';

const { services, start } = createServices([
  ['rpc', AppRPCService],
  ['noty', NotyService],
]);

export default services;
export { start };
