import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import styled from 'styled-components';
import hslLogo from '../assets/hsl-logo.png';
import InfoIcon from './icons/InfoIcon';
import LoginIcon from './icons/LoginIcon';

const Root = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  background-image: url('./background.jpg');
  background-size: cover;
  background-position: center;
`;

const Wrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  width: 405px;
  height: 275px;
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

const LightTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: '#ffffffe6',
    color: '#3e3e3e',
    boxShadow: theme.shadows[1],
    'font-family': 'Gotham Rounded SSm A, Gotham Rounded SSm B, Arial, Georgia, Serif',
    'font-weight': 400,
    fontSize: 11,
  },
}))(Tooltip);

const LoginText = styled.span`
  margin-left: 10px;
`;

const Logo = styled.img`
  display: inline-block;
  height: 80px;
  text-align: center;
  vertical-align: middle;
`;

const Title = styled.div`
  padding-top: 15px;
`;

const InfoWrapper = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
`;

class Login extends Component {
  openLoginForm = () => {
    window.location.replace(
      `${process.env.REACT_APP_LOGIN_PROVIDER_URI}/openid/auth?client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&response_type=code&scope=email+https://oneportal.trivore.com/scope/groups.readonly`,
    );
  };

  render() {
    return (
      <Root>
        <Wrapper>
          <LightTooltip
            title={
              <React.Fragment>
                Käytä nimiavaruuteen kirjattua tunnusta. <br />
                {`Nimiavaruus: ${process.env.REACT_APP_NAMESPACE}`}
              </React.Fragment>
            }
            placement="right-end">
            <InfoWrapper>
              <InfoIcon />
            </InfoWrapper>
          </LightTooltip>

          <Header>
            <Logo src={hslLogo} alt="HSL Logo" />
            <Title>HSL Karttajulkaisin</Title>
          </Header>
          <LoginButton onClick={this.openLoginForm}>
            <LoginIcon />
            <LoginText>Kirjaudu (HSL ID)</LoginText>
          </LoginButton>
        </Wrapper>
      </Root>
    );
  }
}

export default Login;
