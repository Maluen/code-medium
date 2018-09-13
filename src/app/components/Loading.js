import React from 'react';
import PropTypes from 'prop-types';
import styled, { css, keyframes } from 'styled-components';

// https://loading.io/css/
// "lds-dual-ring"
const spinnerAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const styles = {
  container: css`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgb(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 5;
    opacity: 0;
    transition: opacity 1s;

    ${props => props.slow ? css`
      opacity: 1;
    ` : ''}

    ${props => props.immediate ? css`
      opacity: 1;
      transition: none;
    ` : ''}
  `,

  spinner: `
    display: inline-block;
    width: 64px;
    height: 64px;

    &:after {
      content: " ";
      display: block;
      width: 46px;
      height: 46px;
      margin: 1px;
      border-radius: 50%;
      border: 5px solid #fff;
      border-color: #fff transparent #fff transparent;
      animation: ${spinnerAnimation} 1.2s linear infinite;
    }
  `,
};

const Container = styled.div`
  ${styles.container}
`;

const Spinner = styled.div`
  ${styles.spinner}
`;

class Loading extends React.Component {
  static propTypes = {
    immediate: PropTypes.bool,
  };

  static defaultProps = {
    immediate: false,
  };

  state = {
    slow: false,
  }

  componentDidMount() {
    this.timeout = setTimeout(() => {
      this.setState({ slow: true });
    }, 1500);
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  render() {
    return (
      <Container
        immediate={this.props.immediate}
        slow={this.state.slow}
      >
        <Spinner />
      </Container>
    );
  }
}

export default Loading;
