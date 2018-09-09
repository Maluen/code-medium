class AuthService {
  start(services) {
    this.services = services;

    this.services.rpc.registerHandlers({
      'auth.login': this.handleLogin,
    });
  }

  handleLogin = (data) => {
    console.log('HANDLE LOGIN', data);
    throw new Error('noice aaa');
  }
}

export default AuthService;
