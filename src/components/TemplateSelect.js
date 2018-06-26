import React from 'react';
import PropTypes from 'prop-types';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const TemplateSelect = props => (
  <SelectField
    className={props.className}
    value={props.selectedTemplate}
    onChange={(e, i, value) => props.onChange(value)}
    style={{ flexGrow: 1 }}>
    {props.templates.map(template => (
      <MenuItem
        key={`template_option_${template.id}`}
        value={template.id}
        primaryText={template.label}
      />
    ))}
  </SelectField>
);

TemplateSelect.defaultProps = {
  selectedTemplate: null,
  templates: [],
  className: '',
};

TemplateSelect.propTypes = {
  selectedTemplate: PropTypes.string,
  templates: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default TemplateSelect;
