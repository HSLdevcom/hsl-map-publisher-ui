import React from 'react';
import PropTypes from 'prop-types';
import { PropTypes as ObservablePropTypes } from 'mobx-react';
import styled from 'styled-components';
import omit from 'lodash/omit';
import moment from 'moment';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';

import { downloadPoster } from '../util/api';

const Root = styled.div`
  overflow: auto;
`;

const PosterRoot = styled.div`
  margin-top: 20px;
  font-size: 0.95em;
`;

const TitleRow = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  margin-bottom: 10px;
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-flow: row wrap;
  min-height: 50px;
  margin-bottom: 10px;
`;

const PosterList = styled.div`
  margin: 20px 0;
`;

const labelsByStatus = {
  PENDING: 'Jonossa',
  READY: 'Valmis',
  FAILED: 'Epäonnistunut',
};

const Poster = props => (
  <PosterRoot>
    <TitleRow>
      <strong>Sivu #{props.index + 1}</strong>
      <em>Tila: {labelsByStatus[props.status]}</em>
    </TitleRow>

    <p>
      component: {props.component},{' '}
      {Object.keys(props.props)
        .map(key => `${key}: ${JSON.stringify(props.props[key])}`)
        .join(', ')}
    </p>

    <p>
      {props.events.filter(({ message }) => !!message).map(({ createdAt, type, message }) => (
        <span
          key={`${createdAt}${type}${message}`}
          style={type === 'ERROR' ? { color: 'red' } : null}>
          {moment(createdAt).format('D.M.YYYY HH:mm')} {message}
          <br />
        </span>
      ))}
    </p>

    <Buttons>
      <FlatButton
        disabled={props.status === 'PENDING' || props.disableEdit}
        onClick={() => props.onRemove()}
        label="Poista"
      />
      <FlatButton
        disabled={props.status !== 'READY'}
        onClick={() => downloadPoster({ id: props.id })}
        label="Lataa PDF"
        primary
      />
    </Buttons>
    <Divider />
  </PosterRoot>
);

Poster.propTypes = {
  index: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  component: PropTypes.string.isRequired,
  props: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  status: PropTypes.oneOf(['PENDING', 'READY', 'FAILED']).isRequired,
  events: ObservablePropTypes.observableArrayOf(
    PropTypes.shape({
      createdAt: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['ERROR', 'INFO']).isRequired,
      message: PropTypes.string.isRequired,
    }),
  ).isRequired,
  disableEdit: PropTypes.bool.isRequired,
  onRemove: PropTypes.func.isRequired,
};

const BuildDetails = props => (
  <Dialog
    onRequestClose={props.onClose}
    actions={[<FlatButton onClick={props.onClose} label="Sulje" />]}
    style={{ height: '90vh', width: '90vw' }}
    autoScrollBodyContent
    open>
    <Root>
      <h2>{props.title}</h2>
      <PosterList>
        {props.posters.map((poster, index) => (
          <Poster
            {...poster}
            index={index}
            key={poster.id}
            disableEdit={props.status !== 'OPEN'}
            onRemove={() => props.onRemovePoster(poster.id)}
          />
        ))}
      </PosterList>
    </Root>
  </Dialog>
);

BuildDetails.propTypes = {
  title: PropTypes.string.isRequired,
  status: PropTypes.oneOf(['OPEN', 'CLOSED', 'PRODUCTION']).isRequired,
  posters: ObservablePropTypes.observableArrayOf(
    PropTypes.shape(omit(Poster.propTypes, ['index', 'disableEdit', 'onRemove'])),
  ).isRequired,
  onRemovePoster: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
  onClose: PropTypes.func.isRequired,
};

export default BuildDetails;
