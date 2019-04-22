import React, { Component } from 'react';
import styled from 'styled-components';
import hslLogo from '../assets/hsl-logo.png';

const Root = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  background-image: url("./background.jpg");
`;

const Wrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  padding: 30px 90px;
  transform: translate(-50%,-50%);
  box-shadow: 0 0 0 1px rgba(0,0,0,.1), 0 3px 14px rgba(0,0,0,.4);
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

const LoginButton = styled.div`
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
  :hover {
    background-color: #FFF;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), 0 3px 14px rgba(0, 0, 0, 0.4);
`;

const LoginText = styled.div`

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

class Login extends Component {
  openLoginForm = () => {
    window.location.replace(
      `https://hslid-uat.cinfra.fi/openid/auth?client_id=2507101457541763&redirect_uri=http://localhost:3000&response_type=code&scope=email+https://oneportal.trivore.com/scope/groups.readonly`
    );
  };

  render() {
    return (
      <Root>
        <Wrapper>
          <Header>
            <Logo src={hslLogo} alt='HSL Logo'/>
            <Title>HSL Karttajulkaisin</Title>
          </Header>
          <LoginButton
            onClick={this.openLoginForm}
            >
            <LoginText>Kirjaudu (HSL ID)</LoginText>
          </LoginButton>

        </Wrapper>
      </Root>
    )
  }
};

export default Login;
