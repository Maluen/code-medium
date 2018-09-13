import React from 'react';
import styled, { css } from 'styled-components';

// NOTE: error icon by https://www.iconfinder.com/icons/299045/error_sign_icon

const styles = {
  container: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 50%;
    margin-left: auto;
    margin-right: auto;
    font-size: 18px;
    text-align: center;
    font-family: Verdana;
  `,

  heading: css`
    color: #FF1919;

    &:before {
      content: '';
      display: inline-block;
      background: url('/app/assets/error.svg');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: 100px;
      height: 100px;
      vertical-align: middle;
      margin-right: 10px;
      margin-top: -10px;
    }
  `,
};

const Container = styled.div`
  ${styles.container}
`;

const Heading = styled.h3`
  ${styles.heading}
`;

const defaultErrorMessage = 'Make sure you that the gist you are trying to access still exists and that you have the rights for it.';

const errorMessagesByType = {
  unauthorized: 'Looks like you have revoked access to the application. Try connecting your github account again.',
  'not found': 'Make sure the gist still exists.',
};

class ErrorScreen extends React.Component {
  render() {
    const errorMessage = errorMessagesByType[this.props.match.params.errorType] ||
      defaultErrorMessage;

    return (
      <Container>
        <Heading>Something went wrong</Heading>
        <p>{errorMessage}</p>
      </Container>
    );
  }
}

export default ErrorScreen;
