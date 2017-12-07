import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Tabs, Tab } from 'material-ui/Tabs';

import Generator from './Generator';
import BuildList from './BuildList';
import theme from './theme';

const Root = styled.div`
  display: flex;
  flex-flow: column;
  width: 100%;
  max-width: 1000px;
  height: 100vh;
  padding: 10px 30px;
  margin: auto;
  box-sizing: border-box;
`;

const TabPane = styled.div`
  height: calc(100vh - 70px);
`;

const App = () => (
  <MuiThemeProvider muiTheme={theme}>
    <Root>
      <Tabs>
        <Tab label="Generointi">
          <TabPane>
            <Generator />
          </TabPane>
        </Tab>
        <Tab label="Tulosteet">
          <TabPane>
            <BuildList />
          </TabPane>
        </Tab>
      </Tabs>
    </Root>
  </MuiThemeProvider>
);

export default observer(App);
