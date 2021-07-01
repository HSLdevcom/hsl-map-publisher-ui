import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import PropTypes from 'prop-types';

const styles = {
  selectIcon: {
    display: 'none',
  },
  selectLabel: {
    textAlign: 'center',
    padding: 0,
  },
};

const TemplateRuleSelectInput = ({ value, onSelect, width, items }) => (
  <SelectField
    value={value}
    onChange={onSelect}
    style={{ width }}
    labelStyle={styles.selectLabel}
    autoWidth
    iconStyle={styles.selectIcon}>
    {items.map((val, index) => (
      <MenuItem value={val} primaryText={val} key={index} />
    ))}
  </SelectField>
);

TemplateRuleSelectInput.propTypes = {
  value: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
  items: PropTypes.array.isRequired,
};

export default TemplateRuleSelectInput;
