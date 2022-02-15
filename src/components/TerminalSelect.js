import React from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as mobxPropTypes } from 'mobx-react';

import styled from 'styled-components';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const SectionHeading = styled.h4`
  margin-bottom: 0;
`;

const SelectDiv = styled.div`
  display: flex;
  padding: 0 0 0.5rem 0;
  > * {
    flex: none;
  }
`;

const TerminalSelect = observer(props => (
  <div>
    <SectionHeading>Terminaali</SectionHeading>
    <SelectDiv>
      <SelectField
        hintText="Valitse terminaali..."
        value={props.selectedTerminal}
        onChange={(e, i, value) => props.onChange(value)}
        style={{ flexGrow: 1 }}>
        {props.terminals.map(terminal => (
          <MenuItem
            data-cy={terminal.terminalId}
            key={`template_option_${terminal.terminalId}`}
            value={terminal.terminalId}
            primaryText={`${terminal.nameFi} (${terminal.terminalId})`}
          />
        ))}
      </SelectField>
    </SelectDiv>
  </div>
));

TerminalSelect.propTypes = {
  selectedTerminal: PropTypes.string.isRequired,
  terminals: mobxPropTypes.arrayOrObservableArray,
  onChange: PropTypes.func.isRequired,
};

export default TerminalSelect;
