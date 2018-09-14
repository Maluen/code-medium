import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled, { css } from 'styled-components';

import * as gistActions from '../../actions/gist';
import Loading from '../../components/Loading';
import TextInput from './TextInput';
import CodeEditor from './CodeEditor';

const styles = {
  container: css`
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  `,

  title: css`
    margin-top: 0;
  `,

  descriptionRow: css`
    margin-bottom: 15px;
  `,

  nameRow: css`
    padding: 5px 10px;
    border: 1px solid #e1e4e8;
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
  `,

  nameTextInput: css`
    width: 250px;
    max-width: 50%;
  `,

  viewButton: css`
    float: right;
    font-size: 11px;
    padding: 3px 6px;
  `,

  codeRow: css`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    border: 1px solid #e1e4e8;
    border-top: none;

    #codeEditor {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      border: 1px solid rgba(27,31,35,0.2);
      border-top: none;
      border-radius: 0.25em;

      &:focus-within {
        border-color: #2188ff;
        box-shadow: inset 0 1px 2px rgba(27,31,35,0.075), 0 0 0 0.2em rgba(3,102,214,0.3);
      }
    }
  `,

  buttonRow: css`
    padding-top: 15px;
    display: flex;
    flex-direction: row;
  `,

  button: css`
    background-color: #eff3f6;ì
    border-color: rgba(27,31,35,0.2);
    padding: 6px 12px;
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    white-space: nowrap;
    vertical-align: middle;
    user-select: none;
    border-radius: 0.25em;

    &:hover {
      background-color: #e6ebf1;
      background-image: linear-gradient(-180deg, #f0f3f6 0%, #e6ebf1 90%);
      background-position: -.5em;
      border-color: rgba(27,31,35,0.35);
    }

    &:active {
      background-color: #e9ecef;
      background-image: none;
      border-color: rgba(27,31,35,0.35);
      box-shadow: inset 0 0.15em 0.3em rgba(27,31,35,0.15);
    }

    &:disabled {
      color: rgba(36,41,46,0.4);
      background-color: #eff3f6;
      background-image: none;
      border-color: rgba(27,31,35,0.2);
      box-shadow: none;
    }
  `,

  deleteButton: css`
    position: relative;
    display: inline-block;
    cursor: pointer;
    color: #cb2431;
    background-color: #fafbfc;ì
    padding: 3px 10px;

    &:hover {
      color: #fff;
      background-color: #cb2431;
      background-image: linear-gradient(-180deg, #de4450 0%, #cb2431 90%);
      border-color: rgba(27,31,35,0.5);
    }

    &:active {
      color: #fff;
      background-color: #b5202c;
      background-image: none;
      border-color: rgba(27,31,35,0.5);
      box-shadow: inset 0 0.15em 0.3em rgba(27,31,35,0.15);
    }

    &:disabled {
      color: rgba(203,36,49,0.4);
      background-color: #eff3f6;
      background-image: none;
      border-color: rgba(27,31,35,0.2);
      box-shadow: none;
    }
  `,

  saveButtonContainer: css`
    margin-left: auto;
  `,

  createSecretButton: css`
    margin-right: 15px;

    background-color: #e6e1c0;
    background-image: linear-gradient(#fffad5, #e6e1c0);
    border-color: #e3deb9;

    &:hover {
      background-color: #dfd8ae;
      background-image: linear-gradient(#fff7bc, #dfd8ae);
      border-color: #dad3a3;
    }

    &:active {
      background-color: #dfd8ae;
      background-image: none;
      border-color: #daa4a3;
    }

    &:disabled {
      color: rgba(102,102,102,0.5);
      background-color: #e6e1c0;
      background-image: linear-gradient(#fffad5, #e6e1c0);
      border-color: #e3deb9;
    }
  `,

  saveButton: css`

  `,
};

const Container = styled.div`
  ${styles.container}
`;

const Title = styled.h3`
  ${styles.title}
`;

const DescriptionRow = styled.div`
  ${styles.descriptionRow}
`;

const NameRow = styled.div`
  ${styles.nameRow}
`;

const ViewButton = styled.button`
  ${styles.button}
  ${styles.viewButton}
`;

const CodeRow = styled.div`
  ${styles.codeRow}
`;

const ButtonRow = styled.div`
  ${styles.buttonRow}
`;

const DeleteButton = styled.button`
  ${styles.button}
  ${styles.deleteButton}
`;

const SaveButtonsContainer = styled.div`
  ${styles.saveButtonContainer}
`;

const CreateSecretButton = styled.button`
  ${styles.button}
  ${styles.createSecretButton}
`;

const SaveButton = styled.button`
  ${styles.button}
  ${styles.saveButton}
`;

class GistScreen extends React.Component {
  static propTypes = {
    gist: PropTypes.object,
    fetching: PropTypes.bool.isRequired,
    creating: PropTypes.bool.isRequired,
    editing: PropTypes.bool.isRequired,
    deleting: PropTypes.bool.isRequired,

    gistActions: PropTypes.object.isRequired,
  };

  static defaultProps = {
    gist: null,
  };

  state = {
    description: '',
    name: '',
    code: '',
  };

  componentWillMount() {
    const { gistId, gistName } = this.props.match.params;
    if (gistId) {
      // edit
      this.props.gistActions.fetch(gistId, gistName)
        .then(gist => {
          console.log('FETCHED GIST', gist, gistId, gistName);
          this.setState({
            description: gist.description || '',
            name: gistName,
            code: gist.files[gistName].content,
          });
        })
        .catch(errorType => {
          if (typeof errorType === 'string') {
            this.props.history.push(`/error/${errorType}`);
            return;
          }
          throw errorType;
        });
    } else {
      // create
      this.setState({
        description: '',
        name: '',
        code: '',
      });
    }
  }

  handleDescriptionChange = (event) => {
    this.setState({ description: event.currentTarget.value });
  }

  handleNameChange = (event) => {
    this.setState({ name: event.currentTarget.value });
  }

  handleCodeChange = (code) => {
    this.setState({ code });
  }

  handleViewClick = () => {
    window.open(this.props.gist.html_url, '_blank');
  }

  handleCreatePublicClick = () => {
    this.props.gistActions.create({
      ...this.state,
      isPublic: true,
    });
  }

  handleCreateSecretClick = () => {
    this.props.gistActions.create({
      ...this.state,
      isPublic: false,
    });
  }

  handleEditClick = () => {
    this.props.gistActions.edit({
      ...this.state,
      gistName: this.props.match.params.gistName,
      gistId: this.props.match.params.gistId,
    });
  }

  handleDeleteClick = () => {
    const confirmed = window.confirm('Are you positive you want to delete this Gist?');
    if (confirmed) {
      this.props.gistActions.deleteGist(this.props.match.params.gistId);
    }
  }

  render() {
    const { description, name, code } = this.state;
    const saveDisabled = !name.trim() ||
      !code.trim();

    const editing = !!this.props.match.params.gistId;
    const loading = this.props.fetching ||
      this.props.creating ||
      this.props.editing ||
      this.props.deleting;

    const detectedLanguage = editing
      ? this.props.gist && this.props.gist.files[this.props.match.params.gistName].language
      : '';

    return (
      <Container>
        {loading ? <Loading immediate={this.props.fetching} /> : ''}

        <Title>{editing ? 'Update Gist' : 'Add a new Gist'}</Title>
        <DescriptionRow>
          <TextInput
            placeholder="Gist description..."
            value={description}
            onChange={this.handleDescriptionChange}
          />
        </DescriptionRow>
        <NameRow>
          <TextInput
            containerStyle={styles.nameTextInput}
            placeholder="Filename including extension..."
            value={name}
            onChange={this.handleNameChange}
          />
          {editing ?
            <ViewButton onClick={this.handleViewClick}>
              View on GitHub
            </ViewButton>
            : ''}
        </NameRow>
        <CodeRow>
          <CodeEditor
            filename={name}
            detectedLanguage={detectedLanguage}
            value={code}
            onChange={this.handleCodeChange}
          />
        </CodeRow>
        <ButtonRow>
          {editing ?
            <DeleteButton
              onClick={this.handleDeleteClick}
            >
              Delete gist
            </DeleteButton>
            : ''}

          <SaveButtonsContainer>
            {!editing ?
              <CreateSecretButton
                disabled={saveDisabled}
                onClick={this.handleCreateSecretClick}
              >
                Create secret gist
              </CreateSecretButton>
              : ''}

            <SaveButton
              disabled={saveDisabled}
              onClick={editing ? this.handleEditClick : this.handleCreatePublicClick}
            >
              {editing ? 'Update gist' : 'Create public gist'}
            </SaveButton>
          </SaveButtonsContainer>
        </ButtonRow>
      </Container>
    );
  }
}

const stateToProps = ({ gist }) => ({
  gist: gist.gist,
  fetching: gist.fetching,
  creating: gist.creating,
  editing: gist.editing,
  deleting: gist.deleting,
});

const dispatchToProps = dispatch => ({
  gistActions: bindActionCreators(gistActions, dispatch),
});

export default connect(stateToProps, dispatchToProps)(GistScreen);
