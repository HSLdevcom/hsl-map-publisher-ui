import React, { Component } from 'react';
import { observer, inject, PropTypes } from 'mobx-react';
import styled from 'styled-components';
import { logout } from '../util/auth/authService';

const LoginWrapper = styled.div`
  width: 100%;
  white-space: nowrap;
  display: flex;
  margin-bottom: 5px;
`;

const LogoutButton = styled.div`
  display: flex;
  color: #0077c7;
  cursor: pointer;
  flex-direction: column;
  flex-grow: 0;
  text-align: right;
  -webkit-transition: 0.3s;
  transition: 0.3s;
  border-radius: 5px;
  padding: 10px;
  :hover {
    border-radius: 5px;
    background-color: #0077c7;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), 0 3px 14px rgba(0, 0, 0, 0.4);
    cursor: pointer;
    color: #fff;
    -webkit-transition: 0.3s;
    transition: 0.3s;
  }
`;

const Username = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: center;
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
