const initialState = {
  options: {},
  fetching: false,
  fetched: false,
  saving: false,
  saved: false,
  errorMessage: '',
};

export function options(state = initialState, action) {
  switch (action.type) {
    case 'OPTIONS_GET':
      return {
        ...state,
        fetching: true,
      };
    case 'OPTIONS_GET_SUCCESS':
      return {
        ...state,
        fetching: false,
        errorMessage: '',
        fetched: true,
        options: {
          ...state.options,
          [action.name]: action.value,
        },
      };
    case 'OPTIONS_GET_FAILURE':
      return {
        ...state,
        fetching: false,
        errorMessage: action.errorMessage,
      };

    case 'OPTIONS_SET':
      return {
        ...state,
        saving: true,
      };
    case 'OPTIONS_SET_SUCCESS':
      return {
        ...state,
        saving: false,
        errorMessage: '',
        saved: true,
        options: {
          ...state.options,
          [action.name]: action.value,
        },
      };
    case 'OPTIONS_SET_FAILURE':
      return {
        ...state,
        saving: false,
        errorMessage: action.errorMessage,
      };

    default:
      return state;
  }
}
