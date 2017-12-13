import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';

import CircularProgress from 'material-ui/CircularProgress';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';

import { downloadBuild } from '../util/api';

const Root = styled.div`
  width: calc(100vw - 120px);
  max-width: 880px;
  margin-top: 10px;
  white-space: nowrap;
`;

const Row = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.div`
  flex: 1;
  padding-right: 10px;
  margin: 20px 0;
  font-weight: 500;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const Text = styled.div`
  flex: 1;
  padding-right: 10px;
  text-overflow: ellipsis;
  opacity: 0.75;
  overflow: hidden;
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-flow: row wrap;
  min-height: 50px;
  margin-bottom: 10px;
`;

const Build = props => {
  const total = props.pending + props.failed + props.ready;
  return (
    <Root>
      <Row>
        <Title title={props.title}>{props.title}</Title>
        <div>{moment(props.createdAt).format('D.M.YYYY HH:mm')}</div>
      </Row>

      <Row>
        <Text>
          {`${props.ready} / ${total} sivua generoitu`}
          {props.failed > 0 && ` (${props.failed} epäonnistunut)`}
        </Text>
      </Row>

      <Buttons>
        <SelectField
          floatingLabelText="Tila"
          value={props.status}
          onChange={(event, key, value) => props.onStatusChange(value)}
          style={{ marginBottom: 15 }}
        >
          <MenuItem value="OPEN" primaryText="Sisältö muokattavissa" />
          <MenuItem value="CLOSED" primaryText="Sisältö lukittu" />
          <MenuItem value="PRODUCTION" primaryText="Lähetty painoon" />
        </SelectField>
        {props.pending < 1 &&
          props.ready > 0 && (
            <RaisedButton
              onClick={() => downloadBuild({ id: props.id })}
              label="Lataa PDF"
              style={{ marginLeft: 10 }}
              primary
            />
          )}
        {props.pending > 0 && (
          <CircularProgress size={30} style={{ margin: '0 15px' }} />
        )}
      </Buttons>
      <Divider />
    </Root>
  );
};

Build.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  pending: PropTypes.number.isRequired,
  failed: PropTypes.number.isRequired,
  ready: PropTypes.number.isRequired,
  status: PropTypes.oneOf(['OPEN', 'CLOSED', 'PRODUCTION']).isRequired,
  onStatusChange: PropTypes.func.isRequired,
};

export default Build;
