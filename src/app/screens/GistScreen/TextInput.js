import React from 'react';
import styled, { css } from 'styled-components';

export const styles = {
  container: css`
    width: 100%;
    height: 100%;
    padding: 6px 8px;
    font-size: 14px;
    line-height: 20px;
    vertical-align: middle;
    color: #24292e;
    border: 1px solid #d1d5da;
    border-radius: 3px;
    outline: none;
    box-shadow: inset 0 1px 2px rgba(27,31,35,0.075);
    box-sizing: border-box;

    &:focus {
      border-color: #2188ff;
      box-shadow: inset 0 1px 2px rgba(27,31,35,0.075), 0 0 0 0.2em rgba(3,102,214,0.3);
    }

    &::-webkit-input-placeholder {
      color: #6a737d;
      opacity: 0.54;
    }
  `,
};

const Container = styled.input`
  ${styles.container}
  ${({ containerStyle }) => containerStyle}
`;

class Input extends React.Component {
  render() {
    return (
      <Container
        type="text"
        {...this.props}
      />
    );
  }
}

export default Input;
