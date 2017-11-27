import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import './styles/base.css';

injectTapEventPlugin();

const root = document.getElementById('root');

ReactDOM.render(<App />, root);

registerServiceWorker();

if (module.hot) {
  module.hot.accept('./components/App', () => {
    // eslint-disable-next-line global-require
    const NextApp = require('./components/App').default;
    ReactDOM.render(<NextApp />, root);
  });
}
