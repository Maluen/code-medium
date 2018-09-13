import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as authActions from '../actions/auth';
import Loading from '../components/Loading';

const styles = {
  container: css`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  `,

  button: css`
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
      background: url('/app/assets/github.png');
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
  `,
};

const Container = styled.div`
  ${styles.container}
`;

const Button = styled.button`
  ${styles.button}
`;

class AuthScreen extends React.Component {
  static propTypes = {
    loggingIn: PropTypes.bool.isRequired,

    authActions: PropTypes.object.isRequired,
  };

  handleLoginClick = () => {
    this.props.authActions.login()
      .then(() => {
        this.props.history.push(this.props.location.state.from.pathname || '/');
      });
  }

  render() {
    return (
      <Container>
        {this.props.loggingIn ? <Loading /> : ''}
        <Button onClick={this.handleLoginClick}>
          Login with GitHub
        </Button>
      </Container>
    );
  }
}

const stateToProps = ({ auth }) => ({
  loggingIn: auth.loggingIn,
});

const dispatchToProps = dispatch => ({
  authActions: bindActionCreators(authActions, dispatch),
});

export default connect(stateToProps, dispatchToProps)(AuthScreen);
