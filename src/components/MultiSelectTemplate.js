import React from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as mobxPropTypes } from 'mobx-react';
import styled from 'styled-components';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';


const SectionHeading = styled.h4`
  margin-bottom: 0;
`;


const MultiSelectTemplate = observer(props => (
  <div>
    <SectionHeading>Valitse vaihtoehtoiset sommittelut</SectionHeading>
    <SelectField
      multiple
      value={props.selectedRuleTemplates}
      onChange={(e, i, values) => props.setSelectedRuleTemplates(values)}
      style={{ flexGrow: 1, width: '100%' }}>
      {props.templates.map(template => (
        <MenuItem
          data-cy={template.label}
          key={`template_option_${template.id}`}
          checked={props.selectedRuleTemplates && props.selectedRuleTemplates.indexOf(template.id) > -1}
          value={template.id}
          primaryText={template.label}
        />
      ))}
    </SelectField>
  </div>
));

MultiSelectTemplate.defaultProps = {
  selectedRuleTemplates: [],
  templates: [],
};

MultiSelectTemplate.propTypes = {
  selectedRuleTemplates: mobxPropTypes.arrayOrObservableArray,
  templates: mobxPropTypes.arrayOrObservableArray,
  setSelectedRuleTemplates: PropTypes.func.isRequired,
};

export default MultiSelectTemplate;
