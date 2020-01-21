import React, { Component } from 'react';
import { observer, inject, PropTypes } from 'mobx-react';
import styled from 'styled-components';
import { Tabs, Tab } from 'material-ui/Tabs';

import ConfirmDialog from './ConfirmDialog';
import PromptDialog from './PromptDialog';
import BuildDetails from './BuildDetails';
import Generator from './Generator';
import BuildList from './BuildList';
import ConfigureLayout from './ConfigureLayout';

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

class Frame extends Component {
  static propTypes = {
    commonStore: PropTypes.objectOrObservableObject.isRequired,
  };

  render() {
    const { confirm, prompt, selectedBuild } = this.props.commonStore;

    return (
      <Root>
        {confirm && <ConfirmDialog {...confirm} />}
        {prompt && <PromptDialog data-cy="prompt" {...prompt} />}
        {selectedBuild && (
          <BuildDetails
            {...selectedBuild}
            onRemovePoster={this.props.commonStore.removePoster}
            onClose={this.props.commonStore.clearBuild}
          />
        )}
        <Tabs>
          <Tab data-cy="generate" label="Generointi">
            <TabPane>
              <Generator />
            </TabPane>
          </Tab>
          <Tab data-cy="template" label="Sommittelu">
            <TabPane>
              <ConfigureLayout />
            </TabPane>
          </Tab>
          <Tab data-cy="list" label="Tulosteet">
            <TabPane>
              <BuildList />
            </TabPane>
          </Tab>
        </Tabs>
      </Root>
    );
  }
}

export default inject('commonStore')(observer(Frame));
