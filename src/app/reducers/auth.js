const initialState = {
  userId: null,
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
      };
    case 'AUTH_FETCH_SUCCESS':
      return {
        ...state,
        fetching: false,
        errorMessage: '',
        fetched: true,
        loggedIn: action.loggedIn,
        userId: action.userId,
      };
    case 'AUTH_FETCH_FAILURE':
      return {
        ...state,
        fetching: false,
        errorMessage: action.errorMessage,
      };

    case 'AUTH_LOGIN':
      return {
        ...state,
        loggingIn: true,
      };
    case 'AUTH_LOGIN_SUCCESS':
      return {
        ...state,
        loggingIn: false,
        errorMessage: '',
        loggedIn: true,
        userId: action.userId,
      };
    case 'AUTH_LOGIN_FAILURE':
      return {
        ...state,
        loggingIn: false,
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
        errorMessage: '',
        loggedIn: false,
        userId: null,
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
