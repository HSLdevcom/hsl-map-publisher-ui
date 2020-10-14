import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { configure, shallow, mount } from 'enzyme';
import { Provider } from 'mobx-react';
import { Tabs } from 'material-ui/Tabs';
import fetchMock from 'jest-fetch-mock';

import App from './components/App';
import Frame from './components/Frame';
import theme from './components/theme';
import ConfigureLayout from './components/ConfigureLayout';
import BuildDetails from './components/BuildDetails';
import Generator from './components/Generator';

import stores from './stores/stores';

configure({ adapter: new Adapter() });

fetchMock.enableMocks();

describe('App component tests', () => {
  it('App renders without crashing', () => {
    shallow(<App />);
  });
});

describe('Frame component tests', () => {
  fetch.mockResponse(
    JSON.stringify({
      isOk: true,
      email: 'testi@kayttaja.com',
    }),
  );

  stores.commonStore.selectedBuild = {
    id: '123456-65421',
    title: 'testi',
    status: 'OPEN',
    posters: [],
  };

  const mountedWrapper = mount(
    <Provider {...stores}>
      <MuiThemeProvider muiTheme={theme}>
        <Frame />
      </MuiThemeProvider>
    </Provider>,
  );

  it('Frame renders without crashing', () => {
    shallow(
      <Provider {...stores}>
        <MuiThemeProvider muiTheme={theme}>
          <Frame />
        </MuiThemeProvider>
      </Provider>,
    );
  });

  it('Frame contains BuildDetails', () => {
    mountedWrapper.update();
    expect(mountedWrapper.contains(BuildDetails)).toEqual(true);
  });

  it('Frame contains Generator', () => {
    expect(mountedWrapper.contains(Generator)).toEqual(true);
  });

  it('Frame contains Tabs', () => {
    expect(mountedWrapper.contains(Tabs)).toEqual(true);
  });

  it('Frame contains ConfigureLayout', () => {
    expect(mountedWrapper.contains(ConfigureLayout)).toEqual(true);
  });
});
