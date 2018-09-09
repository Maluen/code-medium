import { start as startServices } from './services';

startServices()
  .then(() => {
    console.log('background services started');
  });
