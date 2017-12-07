import React from 'react';
import { inject, observer, PropTypes } from 'mobx-react';
import styled from 'styled-components';

import Build from './Build';

const Root = styled.div`
  display: flex;
  flex-flow: column;
  flex-basis: 10px;
  max-width: 100%;
  height: 100%;
  padding: 10px 30px;
  margin: auto;
  box-sizing: border-box;
  overflow-y: auto;
`;

const BuildList = props => (
  <Root>
    {props.commonStore.builds.map(build => <Build key={build.id} {...build} />)}
  </Root>
);

BuildList.propTypes = {
  // eslint-disable-next-line react/no-typos
  commonStore: PropTypes.observableObject.isRequired,
};

export default inject('commonStore')(observer(BuildList));
