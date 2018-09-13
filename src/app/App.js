import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import './styles/style.scss';
import store from './store';
import { start as startServices } from './services';
import ScreensRoot from './screens/ScreensRoot';

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <ScreensRoot />
        </Router>
      </Provider>
    );
  }
}

startServices()
  .then(() => render(<App />, document.querySelector('#app')));
