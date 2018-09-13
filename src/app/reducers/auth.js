const initialState = {
  fetching: false,
  fetched: false,
  loggingIn: false,
  loggedIn: false,
  loggingOut: false,
  errorMessage: '',
};

export function auth(state = initialState, action) {
  switch (action.type) {
    case 'AUTH_FETCH':
      return {
        ...state,
        fetching: true,
        fetched: false,
      };
    case 'AUTH_FETCH_SUCCESS':
      return {
        ...state,
        fetching: false,
        fetched: true,
        loggedIn: action.loggedIn,
        errorMessage: '',
      };
    case 'AUTH_FETCH_FAILURE':
      return {
        ...state,
        fetching: false,
        fetched: false,
        errorMessage: action.errorMessage,
      };

    case 'AUTH_LOGIN':
      return {
        ...state,
        loggingIn: true,
        loggedIn: false,
      };
    case 'AUTH_LOGIN_SUCCESS':
      return {
        ...state,
        loggingIn: false,
        loggedIn: true,
        errorMessage: '',
      };
    case 'AUTH_LOGIN_FAILURE':
      return {
        ...state,
        loggingIn: false,
        loggedIn: false,
        errorMessage: action.errorMessage,
      };

    case 'AUTH_LOGOUT':
      return {
        ...state,
        loggingOut: true,
      };
    case 'AUTH_LOGOUT_SUCCESS':
      return {
        ...state,
        loggingOut: false,
        loggedIn: false,
        errorMessage: '',
      };
    case 'AUTH_LOGOUT_FAILURE':
      return {
        ...state,
        loggingOut: false,
        errorMessage: action.errorMessage,
      };
    default:
      return state;
  }
}
