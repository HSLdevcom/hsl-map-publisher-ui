import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import App from './components/App';
import './styles/base.css';
import stores from './stores/stores';
import { AppContainer, setConfig } from 'react-hot-loader';

setConfig({ logLevel: 'debug' });

const { commonStore } = stores;

commonStore.getStops();
commonStore.getBuilds();
commonStore.getTemplates();
commonStore.getImages();

setInterval(() => {
  if (
    commonStore.builds.some(({ pending }) => pending > 0) &&
    document.visibilityState === 'visible'
  ) {
    commonStore.getBuilds();
  }
}, 5000);

const root = document.getElementById('root');

const render = Component => {
  ReactDOM.render(
    <Provider {...stores}>
      <AppContainer>
        <Component />
      </AppContainer>
    </Provider>,
    root,
  );
};

render(App);

if (module.hot) {
  module.hot.accept('./components/App', () => {
    // eslint-disable-next-line global-require
    const NextApp = require('./components/App').default;
    render(NextApp);
  });
}
