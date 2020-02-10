import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PropTypes as ObservablePropTypes } from 'mobx-react';
import styled from 'styled-components';
import omit from 'lodash/omit';
import moment from 'moment';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';

import { downloadPoster, downloadBuildSection } from '../util/api';

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

const TextFieldContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const TextWrapper = styled.div`
  padding-top: 8px;
  align-self: center;
  font-family: Gotham Rounded SSm A, Gotham Rounded SSm B, Arial, Georgia, Serif;
`;

const InputWrapper = styled.div`
  padding-left: 5px;
  padding-right: 5px;
  padding-top: 8px;
  align-self: center;
`;

const InputItem = styled.input`
  width: 100%;
  border: 1px solid rgb(190, 190, 190);
  border-radius: 5px;
  outline: none;
  cursor: pointer;
  padding: 5px;
  width: 35px;
  align-self: center;
  :focus {
    border: 1.5px solid rgb(0, 122, 201);
  }
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
      {props.events
        .filter(({ message }) => !!message)
        .map(({ createdAt, type, message }) => (
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

class BuildDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first: {
        value: 1,
        isValid: true,
      },
      last: {
        value: this.props.posters.length,
        isValid: true,
      },
    };
  }

  firstOnChange = e => {
    const value = e.target.value;
    const last = parseInt(this.state.last.value, 10);
    const isValid = value > 0 && value <= this.props.posters.length && value <= last;
    this.setState({ first: { value, isValid } });
  };

  lastOnChange = e => {
    const value = e.target.value;
    const first = parseInt(this.state.first.value, 10);
    const isValid = value >= first && value <= this.props.posters.length;
    this.setState({ last: { value, isValid } });
  };

  render() {
    const buildDownloadEnabled = this.state.first.isValid && this.state.last.isValid;
    return (
      <Dialog
        onRequestClose={this.props.onClose}
        actions={[
          <FlatButton
            data-cy="build-details-close-button"
            onClick={this.props.onClose}
            label="Sulje"
          />,
        ]}
        style={{ height: '90vh', width: '90vw' }}
        autoScrollBodyContent
        open>
        <Root>
          <h2>{this.props.title}</h2>
          <PosterList data-cy={`${this.props.title}-buildDetails`}>
            {this.props.posters.map((poster, index) => (
              <Poster
                {...poster}
                index={index}
                key={poster.id}
                disableEdit={this.props.status !== 'OPEN'}
                onRemove={() => this.props.onRemovePoster(poster.id)}
              />
            ))}
          </PosterList>
          <h2>Lataa osa listasta</h2>
          <TextWrapper>{`Listassa yhteensä ${this.props.posters.length} sivua.`}</TextWrapper>
          <TextFieldContainer>
            <TextWrapper>Valitaan sivut:</TextWrapper>
            <InputWrapper>
              <InputItem
                value={this.state.first.value}
                onChange={value => this.firstOnChange(value)}
              />
            </InputWrapper>
            <InputWrapper> - </InputWrapper>
            <InputWrapper>
              <InputItem
                value={this.state.last.value}
                onChange={value => this.lastOnChange(value)}
              />
              {buildDownloadEnabled &&
                ` (${this.state.last.value - this.state.first.value + 1} sivua valittuna.)`}
            </InputWrapper>
          </TextFieldContainer>
          <Buttons>
            <RaisedButton
              disabled={!buildDownloadEnabled}
              onClick={() =>
                downloadBuildSection({
                  id: this.props.id,
                  first: this.state.first.value - 1,
                  last: this.state.last.value,
                })
              }
              label="Lataa PDF"
              primary
            />
          </Buttons>
        </Root>
      </Dialog>
    );
  }
}

Poster.propTypes = {
  index: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  component: PropTypes.string.isRequired,
  props: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  status: PropTypes.oneOf(['PENDING', 'READY', 'FAILED']).isRequired,
  events: ObservablePropTypes.observableArrayOf(
    PropTypes.shape({
      createdAt: PropTypes.string,
      type: PropTypes.oneOf(['ERROR', 'INFO']),
      message: PropTypes.string,
    }),
  ).isRequired,
  disableEdit: PropTypes.bool.isRequired,
  onRemove: PropTypes.func.isRequired,
};

BuildDetails.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  status: PropTypes.oneOf(['OPEN', 'CLOSED', 'PRODUCTION']).isRequired,
  posters: ObservablePropTypes.observableArrayOf(
    PropTypes.shape(omit(Poster.propTypes, ['index', 'disableEdit', 'onRemove'])),
  ).isRequired,
  onRemovePoster: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
  onClose: PropTypes.func.isRequired,
};

export default BuildDetails;
