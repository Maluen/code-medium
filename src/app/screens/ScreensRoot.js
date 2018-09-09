import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import AuthScreen from './AuthScreen';
import GistScreen from './GistScreen';

class ScreensRoot extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" component={AuthScreen} />
          <Route path="/auth" component={AuthScreen} />
          <Route path="/gist" component={GistScreen} />
        </Switch>
      </Router>
    );
  }
}

export default ScreensRoot;
