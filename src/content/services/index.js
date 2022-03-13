import { createServices } from '../../common/utils';
import ContentRPCService from './ContentRPCService';
import AppService from './AppService';
import MediumService from './MediumService';
import SubstackService from './SubstackService';

const { services, start } = createServices([
  ['rpc', ContentRPCService],
  ['app', AppService],
  ['medium', MediumService],
  ['substack', SubstackService],
]);

export default services;
export { start };
