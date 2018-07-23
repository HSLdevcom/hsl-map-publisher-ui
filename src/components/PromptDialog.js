import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

class PromptDialog extends Component {
  constructor(props) {
    super(props);
    this.state = { value: props.defaultValue };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ value: nextProps.defaultValue });
  }

  render() {
    return (
      <Dialog
        open={!!this.props.message}
        onRequestClose={() => this.props.callback({ isCancelled: true })}
        actions={[
          <FlatButton onClick={() => this.props.callback({ isCancelled: true })} label="Peruuta" />,
          <FlatButton
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
          onChange={(event, value) => this.setState({ value })}
          fullWidth
        />
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
