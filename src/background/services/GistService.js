class GistService {
  start(services) {
    this.services = services;

    this.services.rpc.registerHandlers({
      'gist.fetch': this.handleFetch,
      'gist.create': this.handleCreate,
      'gist.edit': this.handleEdit,
      'gist.delete': this.handleDelete,
    });
  }

  handleFetch = async ({ gistId }) => {
    const accessToken = await this.services.auth.getAccessToken();
    if (!accessToken) {
      throw new Error('No access token');
    }

    console.log('FETCHING', gistId);

    return this.services.api.get(`/gists/${gistId}`, accessToken);
  }

  handleCreate = async ({ name, description, code, isPublic }) => {
    const accessToken = await this.services.auth.getAccessToken();
    if (!accessToken) {
      throw new Error('No access token');
    }

    console.log('CREATING', name, description, code);

    return this.services.api.post('/gists', accessToken, {
      description,
      public: isPublic,
      files: {
        [name]: {
          content: code,
        },
      },
    });
  }

  handleEdit = async ({ gistId, gistName, name, description, code }) => {
    const accessToken = await this.services.auth.getAccessToken();
    if (!accessToken) {
      throw new Error('No access token');
    }

    console.log('EDITING', gistId, name, description, code);

    return this.services.api.patch(`/gists/${gistId}`, accessToken, {
      description,
      files: {
        [gistName]: { // original name
          filename: name, // new name
          content: code,
        },
      },
    });
  }

  handleDelete = async ({ gistId }) => {
    const accessToken = await this.services.auth.getAccessToken();
    if (!accessToken) {
      throw new Error('No access token');
    }

    console.log('DELETING', gistId);

    return this.services.api.delete(`/gists/${gistId}`, accessToken);
  }
}

export default GistService;
