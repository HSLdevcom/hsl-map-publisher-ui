import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

const BANNED_CHARACTERS = ['/', '\\', ':', '?', '"', '<', '>', '|'];

const Message = styled.div`
  color: red;
`;

class PromptDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.defaultValue,
      isNotValid: true,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ value: nextProps.defaultValue });
  }

  inputOnChange = (value) => {
    const isNotValid = (BANNED_CHARACTERS.some(c => value.includes(c)));
    this.setState({ value, isNotValid })
  }

  render() {
    return (
      <Dialog
        open={!!this.props.message}
        onRequestClose={() => this.props.callback({ isCancelled: true })}
        actions={[
          <FlatButton onClick={() => this.props.callback({ isCancelled: true })} label="Peruuta" />,
          <FlatButton
            disabled={this.state.isNotValid}
            onClick={() =>
              this.props.callback({
                isCancelled: false,
                value: this.state.value,
              })
            }
            label="OK"
            primary
          />,
        ]}>
        <p>{this.props.message}</p>
        <TextField
          name={this.props.message}
          value={this.state.value}
          onChange={(event, value) => this.inputOnChange(value)}
          fullWidth
        />
      {this.state.isNotValid && this.state.value.length > 0 &&
        <Message>Nimi ei saa sisältää merkkejä: {BANNED_CHARACTERS}</Message>
      }
      </Dialog>
    );
  }
}

PromptDialog.defaultProps = {
  defaultValue: '',
};

PromptDialog.propTypes = {
  message: PropTypes.string.isRequired,
  callback: PropTypes.func.isRequired,
  defaultValue: PropTypes.string,
};

export default PromptDialog;
