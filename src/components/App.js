import React, { Component } from 'react';
import { observer, inject, PropTypes } from 'mobx-react';
import styled from 'styled-components';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CircularProgress from 'material-ui/CircularProgress';

import theme from './theme';
import Frame from './Frame';
import Login from './Login';
import { authorizeUsingCode, checkExistingSession } from '../util/auth/authService';
import { removeAuthParams } from '../util/urlManager';

const Loading = styled.div`
  height: 100vh;
  width: 100%;
`;

class App extends Component {
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
    const user = this.props.commonStore.getUser();

    return (
      <MuiThemeProvider muiTheme={theme}>
        <div>
          {this.state.loading && (
            <Loading>
              <CircularProgress
                size={200}
                style={{ display: 'block', margin: 'auto', top: '35%' }}
              />
            </Loading>
          )}
          {!this.state.loading && !user && <Login />}
          {!this.state.loading && user && <Frame />}
        </div>
      </MuiThemeProvider>
    );
  }
}

export default inject('commonStore')(observer(App));
