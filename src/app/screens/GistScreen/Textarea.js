import React from 'react';
import styled, { css } from 'styled-components';

import { styles as textInputStyles } from './TextInput';

const styles = {
  container: css`
    flex-grow: 1;
  `,
};

const Container = styled.textarea`
  ${textInputStyles.container}
  ${styles.container}
`;

class Textarea extends React.Component {
  render() {
    return (
      <Container {...this.props} />
    );
  }
}

export default Textarea;
