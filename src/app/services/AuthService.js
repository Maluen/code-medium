import { CONTEXT } from '../../common/services/RPCService';

class AuthService {
  start(services) {
    this.services = services;
  }

  login() {
    return this.services.rpc
      .sendRequest(CONTEXT.background, null, 'auth.login')
      .then((data) => {
        alert('login success' + JSON.stringify(data, null, 2));
      })
      .catch((err) => {
        alert('login failed: ' + err.stack);
        console.error(err);
      });
  }
}

export default AuthService;
