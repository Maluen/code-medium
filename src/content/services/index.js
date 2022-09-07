import { createServices } from '../../common/utils';
import ContentRPCService from './ContentRPCService';
import AppService from './AppService';
import MediumService from './MediumService';
import SubstackService from './SubstackService';

const contentIsSubstack = /(^|\.)substack.com$/i.test(window.location.hostname);

const { services, start } = createServices([
  ['rpc', ContentRPCService],
  ['app', AppService],
  ['integration', contentIsSubstack ? SubstackService : MediumService],
]);

export default services;
export { start };
