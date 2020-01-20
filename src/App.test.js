import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { configure, shallow, mount } from 'enzyme';
import { Provider } from 'mobx-react';
import { Tabs } from 'material-ui/Tabs';
import App from './components/App';
import Frame from './components/Frame';
import theme from './components/theme';
import ConfigureLayout from './components/ConfigureLayout';
import stores from './stores/stores';

import BuildDetails from './components/BuildDetails';
import Generator from './components/Generator';

configure({ adapter: new Adapter() });

it('Renders without crashing', () => {
    shallow(<App />);
});

it('Frame renders without crashing', () => {
    shallow(
        <Provider {...stores}>
                <MuiThemeProvider muiTheme={theme}>
                    <Frame />
                </MuiThemeProvider>
        </Provider>
    );
});

const wrapper = mount(
    <Provider {...stores}>
            <MuiThemeProvider muiTheme={theme}>
                <Frame />
            </MuiThemeProvider>
    </Provider>
);

it('Frame contains BuildDetails', () => {
    expect(wrapper.contains(BuildDetails)).toEqual(true);
});

it('Frame contains Generator', () => {
    expect(wrapper.contains(Generator)).toEqual(true);
});

it('Frame contains BuildDetails', () => {
    expect(wrapper.contains(Tabs)).toEqual(true);
});

it('Frame contains ConfigureLayout', () => {
    expect(wrapper.contains(ConfigureLayout)).toEqual(true);
});

