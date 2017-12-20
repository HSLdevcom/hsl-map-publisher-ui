import React from 'react';
import { observer, inject, PropTypes } from 'mobx-react';
import styled from 'styled-components';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Tabs, Tab } from 'material-ui/Tabs';

import ConfirmDialog from './ConfirmDialog';
import PromptDialog from './PromptDialog';
import BuildDetails from './BuildDetails';
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

const App = props => {
  const { confirm, prompt, selectedBuild } = props.commonStore;
  return (
    <MuiThemeProvider muiTheme={theme}>
      <Root>
        {confirm && <ConfirmDialog {...confirm} />}
        {prompt && <PromptDialog {...prompt} />}
        {selectedBuild && (
          <BuildDetails
            {...selectedBuild}
            onRemovePoster={props.commonStore.removePoster}
            onClose={props.commonStore.clearBuild}
          />
        )}
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
};

App.propTypes = {
  // eslint-disable-next-line react/no-typos
  commonStore: PropTypes.observableObject.isRequired,
};

export default inject('commonStore')(observer(App));
