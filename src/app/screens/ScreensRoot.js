import React from 'react';
import {
  BrowserRouter as Router, Route, Switch, Redirect, withRouter,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled, { css } from 'styled-components';

import services from '../services';
import * as authActions from '../actions/auth';
import Loading from '../components/Loading';
import HomeScreen from './HomeScreen';
import AuthScreen from './AuthScreen';
import GistScreen from './GistScreen';
import ErrorScreen from './ErrorScreen';

const styles = {
  container: css`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  `,

  header: css`
    position: absolute;
    right: 0;
  `,

  logoutButton: css`
    background: white;
    margin: 0;
    padding: 10px 20px;
    border: 1px solid #e1e4e8;
    border-top: none;
    border-right: none;
    float: right;
    cursor: pointer;
  `,

  content: css`
    flex-grow: 1;
    display: flex;
  `,
};

const Container = styled.div`
  ${styles.container}
`;

const Header = styled.div`
  ${styles.header}
`;

const LogoutButton = styled.button`
  ${styles.logoutButton}
`;

const Content = styled.div`
  ${styles.content}
`;

class PrivateRoute extends React.Component {
  renderRoute = (routeProps) => {
    const { authed, component: Component } = this.props;
    if (authed) return <Component {...routeProps} />;
    return (
      <Redirect
        to={{
          pathname: '/auth',
          state: { from: routeProps.location },
        }}
      />
    );
  }

  render() {
    const { component: Component, authed, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={this.renderRoute}
      />
    );
  }
}

class ScreensRoot extends React.Component {
  componentWillMount() {
    this.fetchAuthIfNeeded();

    services.rpc.registerHandlers({
      'app.command': this.handleCommand,
    });
  }

  handleCommand = (command) => {
    if (command.name === 'create') {
      this.props.history.push('/gist');
    } else if (command.name === 'edit') {
      const { gistId, gistName } = command.params;
      this.props.history.push(`/gist/${gistId}/${gistName}`);
    }
  }

  handleLogoutClick = () => {
    const confirmed = window.confirm('Do you really want to logout?');
    if (confirmed) {
      this.props.authActions.logout();
    }
  }

  fetchAuthIfNeeded() {
    if (!this.props.auth.fetched && !this.props.auth.fetching) {
      this.props.authActions.fetch();
    }
  }

  render() {
    const authed = this.props.auth.loggedIn;
    const loading = this.props.auth.fetching ||
      this.props.auth.loggingOut;

    return (
      <Container>
        {loading ? <Loading /> : ''}
        <Header>
          {authed ? <LogoutButton onClick={this.handleLogoutClick}>Logout</LogoutButton> : ''}
        </Header>
        <Content>
          <Switch>
            <Route path="/auth" component={AuthScreen} />
            <PrivateRoute authed={authed} path="/gist/:gistId?/:gistName?" component={GistScreen} />
            <Route path="/error/:errorType?" component={ErrorScreen} />

            <Route path="/" component={HomeScreen} />
          </Switch>
        </Content>
      </Container>
    );
  }
}

const stateToProps = ({ auth }) => ({
  auth,
});

const dispatchToProps = dispatch => ({
  authActions: bindActionCreators(authActions, dispatch),
});

// NOTE: keep withRouter as first one,
// otherwise updates will be blocked
// see https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/guides/blocked-updates.md
// TODO: refactor so this doesn't happen
export default withRouter(
  connect(stateToProps, dispatchToProps)(
    ScreensRoot,
  ),
);
