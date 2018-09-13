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
        fetched: false,
        gist: null,
      };
    case 'GIST_FETCH_SUCCESS':
      return {
        ...state,
        fetching: false,
        fetched: true,
        gist: action.gist,
        errorMessage: '',
      };
    case 'GIST_FETCH_FAILURE':
      return {
        ...state,
        fetching: false,
        fetched: false,
        errorMessage: action.errorMessage,
      };

    case 'GIST_CREATE':
      return {
        ...state,
        creating: true,
        created: false,
      };
    case 'GIST_CREATE_SUCCESS':
      return {
        ...state,
        creating: false,
        created: true,
        errorMessage: '',
      };
    case 'GIST_CREATE_FAILURE':
      return {
        ...state,
        creating: false,
        created: false,
        errorMessage: action.errorMessage,
      };

    case 'GIST_EDIT':
      return {
        ...state,
        editing: true,
        edited: false,
      };
    case 'GIST_EDIT_SUCCESS':
      return {
        ...state,
        editing: false,
        edited: true,
        errorMessage: '',
      };
    case 'GIST_EDIT_FAILURE':
      return {
        ...state,
        editing: false,
        edited: false,
        errorMessage: action.errorMessage,
      };

    case 'GIST_DELETE':
      return {
        ...state,
        deleting: true,
        deleted: false,
      };
    case 'GIST_DELETE_SUCCESS':
      return {
        ...state,
        deleting: false,
        deleted: true,
        errorMessage: '',
      };
    case 'GIST_DELETE_FAILURE':
      return {
        ...state,
        deleting: false,
        deleted: false,
        errorMessage: action.errorMessage,
      };
    default:
      return state;
  }
}
