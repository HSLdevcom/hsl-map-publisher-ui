import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import styled from 'styled-components';
import hslLogo from '../assets/hsl-logo.png';

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

const InfoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width="25"
    height="25"
    viewBox="0 0 172 172">
    <g>
      <path d="M0,172v-172h172v172z" fill="none" />
      <g fill="#ffffff">
        <path d="M86,6.88c-43.65603,0 -79.12,35.46397 -79.12,79.12c0,43.65603 35.46397,79.12 79.12,79.12c43.65603,0 79.12,-35.46397 79.12,-79.12c0,-43.65603 -35.46397,-79.12 -79.12,-79.12zM86,13.76c39.93779,0 72.24,32.30221 72.24,72.24c0,39.93779 -32.30221,72.24 -72.24,72.24c-39.93779,0 -72.24,-32.30221 -72.24,-72.24c0,-39.93779 32.30221,-72.24 72.24,-72.24zM86,37.84c-5.69958,0 -10.32,4.62042 -10.32,10.32c0,5.69958 4.62042,10.32 10.32,10.32c5.69958,0 10.32,-4.62042 10.32,-10.32c0,-5.69958 -4.62042,-10.32 -10.32,-10.32zM72.24,72.24v6.88h3.44h3.44v44.72h-3.44h-3.44v6.88h3.44h3.44h13.76h3.44h3.44v-6.88h-3.44h-3.44v-51.6h-3.44h-13.76z" />
      </g>
    </g>
  </svg>
);

const InfoWrapper = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
`;

class Login extends Component {
  openLoginForm = () => {
    window.location.replace(
      `https://hslid-uat.cinfra.fi/openid/auth?client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&response_type=code&scope=email+https://oneportal.trivore.com/scope/groups.readonly`,
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
            placement="right-start">
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
