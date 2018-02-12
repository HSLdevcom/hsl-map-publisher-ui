import React from 'react';
import MaterialCheckbox from 'material-ui/Checkbox';
import { PropTypes } from 'prop-types';

const Checkbox = props => (
  <MaterialCheckbox
    label={props.label}
    checked={props.defaultValueTrue}
    onCheck={(event, value) => {
      props.onChange(value);
    }}
  />
);

Checkbox.defaultProps = {
  defaultValueTrue: false,
};

Checkbox.propTypes = {
  label: PropTypes.string.isRequired,
  defaultValueTrue: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

export default Checkbox;
