import { createServices } from '../../common/utils';
import ContentRPCService from './ContentRPCService';
import AppService from './AppService';
import MediumService from './MediumService';

const { services, start } = createServices([
  ['rpc', ContentRPCService],
  ['app', AppService],
  ['medium', MediumService],
]);

export default services;
export { start };
