import React from 'react';
import PropTypes from 'prop-types';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

const ConfirmDialog = props => (
  <Dialog
    open={!!props.message}
    onRequestClose={() => props.callback({ isCancelled: true })}
    actions={[
      props.allowCancel && (
        <FlatButton onClick={() => props.callback({ isCancelled: true })} label="Peruuta" />
      ),
      <FlatButton onClick={() => props.callback({ isCancelled: false })} label="OK" primary />,
    ]}>
    <p>{props.message}</p>
  </Dialog>
);

ConfirmDialog.propTypes = {
  message: PropTypes.string.isRequired,
  callback: PropTypes.func.isRequired,
  allowCancel: PropTypes.bool.isRequired,
};

export default ConfirmDialog;
