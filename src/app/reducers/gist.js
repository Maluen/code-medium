const initialState = {
  gist: null,
  fetching: false,
  fetched: false,
  creating: false,
  created: false,
  editing: false,
  edited: false,
  deleting: false,
  deleted: false,
  errorMessage: '',
};

export function gist(state = initialState, action) {
  switch (action.type) {
    case 'GIST_FETCH':
      return {
        ...state,
        fetching: true,
      };
    case 'GIST_FETCH_SUCCESS':
      return {
        ...state,
        fetching: false,
        errorMessage: '',
        fetched: true,
        gist: action.gist,
      };
    case 'GIST_FETCH_FAILURE':
      return {
        ...state,
        fetching: false,
        errorMessage: action.errorMessage,
      };

    case 'GIST_CREATE':
      return {
        ...state,
        creating: true,
      };
    case 'GIST_CREATE_SUCCESS':
      return {
        ...state,
        creating: false,
        errorMessage: '',
        created: true,
        gist: action.gist,
      };
    case 'GIST_CREATE_FAILURE':
      return {
        ...state,
        creating: false,
        errorMessage: action.errorMessage,
      };

    case 'GIST_EDIT':
      return {
        ...state,
        editing: true,
      };
    case 'GIST_EDIT_SUCCESS':
      return {
        ...state,
        editing: false,
        errorMessage: '',
        edited: true,
        gist: action.gist,
      };
    case 'GIST_EDIT_FAILURE':
      return {
        ...state,
        editing: false,
        errorMessage: action.errorMessage,
      };

    case 'GIST_DELETE':
      return {
        ...state,
        deleting: true,
      };
    case 'GIST_DELETE_SUCCESS':
      return {
        ...state,
        deleting: false,
        errorMessage: '',
        deleted: true,
      };
    case 'GIST_DELETE_FAILURE':
      return {
        ...state,
        deleting: false,
        errorMessage: action.errorMessage,
      };
    default:
      return state;
  }
}
