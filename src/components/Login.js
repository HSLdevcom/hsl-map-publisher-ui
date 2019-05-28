import React, { Component } from 'react';
import styled from 'styled-components';
import hslLogo from '../assets/hsl-logo.png';

// const CLIENT_ID = process.env.CLIENT_ID;
// const REDIRECT_URI = process.env.REDIRECT_URI;

const Root = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  background-image: url('./background.jpg');
`;

const Wrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  padding: 30px 90px;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), 0 3px 14px rgba(0, 0, 0, 0.4);
  border-radius: 2px;
  text-align: center;
  overflow-y: auto;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  color: #fff;
  background-color: #007ac9a6;
`;

const Header = styled.div`
  padding: 10px 0px 10px 0px;
  user-select: none;
`;

const LoginButton = styled.span`
  display: flex;
  flex-basis: 50px;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  user-select: none;
  width: $formWidth;
  cursor: pointer;
  border-radius: 2px;
  background-color: #ffffffe6;
  color: #3e3e3e;
  padding: 15px;
  width: 225px;
  :hover {
    background-color: #FFF;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), 0 3px 14px rgba(0, 0, 0, 0.4);
`;

const LoginText = styled.span`
  margin-left: 10px;
`;

const Logo = styled.img`
  display: inline-block;
  height: 80px;
  text-align: center;
  vertical-align: middle;
`;

const Title = styled.h2`
  margin-top: 10px 0px 10px 0px;
`;

const LoginIcon = () => (
  <svg
    className="line-icon"
    version="1.1"
    id="Layer_1"
    x="0px"
    y="0px"
    viewBox="0 0 448 512"
    height="1em"
    preserveAspectRatio="xMidYMid meet">
    <g fill="#3e3e3e">
      <path
        d="M400 224h-24v-72C376 68.2 307.8 0 224 0S72 68.2 72 152v72H48c-26.5 0-48 21.5-48 48v192c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V272c0-26.5-21.5-48-48-48zm-104 0H152v-72c0-39.7 32.3-72 72-72s72 32.3 72 72v72z"
        id="Fill-1"
      />
    </g>
  </svg>
);

class Login extends Component {
  openLoginForm = () => {
    window.location.replace(
      `https://hslid-uat.cinfra.fi/openid/auth?client_id=0573682632536260&redirect_uri=https://dev-kartat.hsldev.com/julkaisin&response_type=code&scope=email+https://oneportal.trivore.com/scope/groups.readonly`,
    );
  };

  openRegisterForm = () => {
    window.location.replace(
      `https://hslid-uat.cinfra.fi/openid/auth?client_id=0573682632536260&redirect_uri=https://dev-kartat.hsldev.com/julkaisin&response_type=code&scope=email+https://oneportal.trivore.com/scope/groups.readonly&nur`,
    );
  };

  render() {
    return (
      <Root>
        <Wrapper>
          <Header>
            <Logo src={hslLogo} alt="HSL Logo" />
            <Title>HSL Karttajulkaisin</Title>
          </Header>
          <p>
            <LoginButton onClick={this.openLoginForm}>
              <LoginIcon />
              <LoginText>Kirjaudu (HSL ID)</LoginText>
            </LoginButton>
          </p>
          <p>
            <LoginButton onClick={this.openRegisterForm}>
              <LoginIcon />
              <LoginText>Luo uusi käyttäjä</LoginText>
            </LoginButton>
          </p>
        </Wrapper>
      </Root>
    );
  }
}

export default Login;
