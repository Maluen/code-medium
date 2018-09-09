import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as authActions from '../actions/auth';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoginButton = styled.button`
  background-color: #2b414e;
  color: white;
  font-size: 18px;
  border: none;
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;

  &:before {
    content: '';
    display: inline-block;
    background: url('assets/github.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 35px;
    height: 35px;
    vertical-align: middle;
    margin-right: 10px;
  };

  &:hover {
    opacity: 0.8;
  }
`;

class AuthScreen extends React.Component {
  static propTypes = {
    authActions: PropTypes.object.isRequired,
  };

  handleLoginClick = () => {
    this.props.authActions.login();
  }

  render() {
    return (
      <Container>
        <LoginButton onClick={this.handleLoginClick}>
          Login with GitHub
        </LoginButton>
      </Container>
    );
  }
}

const stateToProps = ({  }) => ({

});

const dispatchToProps = dispatch => ({
  authActions: bindActionCreators(authActions, dispatch),
});

export default connect(stateToProps, dispatchToProps)(AuthScreen);
