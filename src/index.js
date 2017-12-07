import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';

import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import './styles/base.css';

import commonStore from './store/commonStore';
import generatorStore from './store/generatorStore';

const stores = {
  commonStore,
  generatorStore,
};

const root = document.getElementById('root');

ReactDOM.render(
  <Provider {...stores}>
    <App />
  </Provider>,
  root,
);

registerServiceWorker();

if (module.hot) {
  module.hot.accept('./components/App', () => {
    // eslint-disable-next-line global-require
    const NextApp = require('./components/App').default;
    ReactDOM.render(
      <Provider {...stores}>
        <NextApp />
      </Provider>,
      root,
    );
  });
}
