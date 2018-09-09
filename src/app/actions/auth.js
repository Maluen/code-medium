import services from '../services';

export function login() {
  return (dispatch) => {
    return services.auth.login();
  };
}
