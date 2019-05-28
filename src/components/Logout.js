import React, { Component } from 'react';
import { observer, inject, PropTypes } from 'mobx-react';
import styled from 'styled-components';
import { logout } from '../util/auth/authService';

const LoginWrapper = styled.div`
  width: 100%;
  white-space: nowrap;
  display: flex;
`;

const LogoutButton = styled.div`
  display:flex;
  color: #0077c7;
  cursor: pointer;
  flex-direction: column;
  flex-grow: 0;
  text-align: right;
  :hover {
    color: rgb(51, 51, 51);
`;

const Username = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
`;

class Logout extends Component {
  static propTypes = {
    commonStore: PropTypes.objectOrObservableObject.isRequired,
  };

  logout = () => {
    logout().then(response => {
      if (response.status === 200) {
        this.props.commonStore.setUser(null);
        window.location.replace(window.location.href);
      }
    });
  };

  render() {
    const user = this.props.commonStore.getUser();
    return (
      <LoginWrapper>
        <Username>{user}</Username>
        <LogoutButton onClick={this.logout}>Kirjaudu ulos</LogoutButton>
      </LoginWrapper>
    );
  }
}

export default inject('commonStore')(observer(Logout));
