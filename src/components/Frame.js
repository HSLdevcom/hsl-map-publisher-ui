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
import Login from './Login';
import Logout from './Logout';
import { authorizeUsingCode, checkExistingSession } from '../util/auth/authService';
import { removeAuthParams } from '../util/urlManager';

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
    this.state = {
      loading: true,
    };
  }

  static propTypes = {
    commonStore: PropTypes.objectOrObservableObject.isRequired,
  };

  componentDidMount() {
    const url = new URL(window.location.href).searchParams;
    let code = null;
    if (url) {
      code = url.get('code');
    }

    checkExistingSession().then(json => {
      if (json && json.isOk && json.email) {
        this.props.commonStore.setUser(json.email);
        this.setState({ loading: false });
      } else {
        this.props.commonStore.setUser(null);
        if (code) {
          removeAuthParams();
          authorizeUsingCode(code).then(res => {
            if (res && res.isOk && res.email) this.props.commonStore.setUser(res.email);
            this.setState({ loading: false });
          });
        } else {
          this.setState({ loading: false });
        }
      }
    });
  }

  render() {
    const { confirm, prompt, selectedBuild } = this.props.commonStore;
    const user = this.props.commonStore.getUser();

    return (
      <div>
        {this.state.loading && (
          <Loading>
            <CircularProgress size={200} style={{ display: 'block', margin: 'auto', top: '35%' }} />
          </Loading>
        )}
        {!this.state.loading && !user && <Login />}
        {!this.state.loading && user && (
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
        )}
      </div>
    );
  }
}

export default inject('commonStore')(observer(Frame));
