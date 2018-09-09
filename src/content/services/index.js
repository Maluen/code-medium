import { createServices } from '../../common/utils';
import ContentRPCService from './ContentRPCService';

const { services, start } = createServices([
  ['rpc', ContentRPCService],
]);

export default services;
export { start };
