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

const MOCK_DATA = {
  build: {
    id: '123456-65421',
    title: 'testi',
    status: 'OPEN',
    posters: [],
    createdAt: '2022-08-23T18:55:52.988Z',
    updatedAt: '2022-08-23T18:55:52.988Z',
    pending: 0,
    failed: 0,
    ready: 0,
  },
  template: {
    id: 'test',
    label: 'test',
    areas: [],
    created_at: '2022-09-06T12:56:28.539Z',
    updated_at: '2022-09-06T12:56:28.539Z',
    rules: {
      type: 'RULE',
      name: 'ZONE',
      value: 'A',
    },
  },
  stop: {
    distributionArea: 'alue1',
    distributionOrder: 104,
    drivebyTimetable: 1,
    nameFi: 'Meritullinkatu',
    posterCount: 0,
    shortId: 'H 2014',
    stopId: '1010107',
    stopTariff: '01',
    stopType: '04',
    stopZone: 'A',
  },
};

configure({ adapter: new Adapter() });

fetchMock.enableMocks();

describe('App component tests', () => {
  stores.commonStore.selectedBuild = MOCK_DATA.build;
  stores.commonStore.stops = [MOCK_DATA.stop];

  it('App renders without crashing', () => {
    shallow(
      <Provider {...stores}>
        <App />
      </Provider>,
    );
  });
});

describe('Frame component tests', () => {
  fetch.mockResponses(
    [JSON.stringify({ data: { allStops: { nodes: [MOCK_DATA.stop] } } }), { status: 200 }],
    [JSON.stringify([]), { status: 200 }],
    [JSON.stringify([MOCK_DATA.build]), { status: 200 }],
    [JSON.stringify([MOCK_DATA.template]), { status: 200 }],
    [JSON.stringify([]), { status: 200 }],
  );

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
