import React, { Component } from 'react';
import { observer, inject, PropTypes } from 'mobx-react';
import styled from 'styled-components';
import { Tabs, Tab } from 'material-ui/Tabs';
import CircularProgress from 'material-ui/CircularProgress';

import ConfirmDialog from './ConfirmDialog';
import PromptDialog from './PromptDialog';
import BuildDetails from './BuildDetails';
import Generator from './Generator';
import BuildList from './BuildList';
import ConfigureLayout from './ConfigureLayout';
import Logout from './Logout';

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

const Loading = styled.div`
  height: 100vh;
  width: 100%;
`;

class Frame extends Component {
  constructor(props) {
    super(props);

    this.props.commonStore.getStops();
    this.props.commonStore.getTerminals();
    this.props.commonStore.getBuilds();
    this.props.commonStore.getTemplates();
    this.props.commonStore.getImages();

    setInterval(() => {
      if (
        this.props.commonStore.builds.some(({ pending }) => pending > 0) &&
        document.visibilityState === 'visible'
      ) {
        this.props.commonStore.getBuilds();
      }
    }, 5000);
  }

  static propTypes = {
    commonStore: PropTypes.objectOrObservableObject.isRequired,
  };

  render() {
    const { confirm, prompt, selectedBuild, stops } = this.props.commonStore;

    if (stops.length === 0) {
      // Still loading data, show spinner
      return (
        <Loading>
          <CircularProgress size={200} style={{ display: 'block', margin: 'auto', top: '35%' }} />
        </Loading>
      );
    }

    return (
      <Root>
        {confirm && <ConfirmDialog {...confirm} />}
        {prompt && <PromptDialog data-cy="prompt" {...prompt} />}
        {selectedBuild && (
          <BuildDetails
            {...selectedBuild}
            onRemovePoster={this.props.commonStore.removePoster}
            onClose={this.props.commonStore.clearBuild}
            onCancelPoster={this.props.commonStore.cancelPoster}
          />
        )}
        <Logout />
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
