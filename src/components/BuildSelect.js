import React from 'react';
import PropTypes from 'prop-types';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const BuildSelect = props => (
  <SelectField
    value={props.buildIdSelected}
    onChange={(e, i, value) => props.onChange(value)}
    style={{ flexGrow: 1 }}
  >
    {props.builds
      .filter(({ status }) => status === 'OPEN')
      .map(build => (
        <MenuItem key={build.id} value={build.id} primaryText={build.title} />
      ))}
  </SelectField>
);

BuildSelect.defaultProps = {
  buildIdSelected: null,
};

BuildSelect.propTypes = {
  buildIdSelected: PropTypes.string,
  builds: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default BuildSelect;
