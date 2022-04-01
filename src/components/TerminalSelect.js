import React from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as mobxPropTypes } from 'mobx-react';

import styled from 'styled-components';
import Select from 'react-select';

const SectionHeading = styled.h4`
  margin-bottom: 0.5rem;
`;

const TerminalSelect = props => {
  const mappedTerminals = props.terminals.map(t => ({
    option: t.terminalId,
    label: `${t.nameFi} (${t.terminalId})`,
  }));

  const selected = mappedTerminals.find(t => t.option === props.selectedTerminal);

  return (
    <div>
      <SectionHeading>Terminaali</SectionHeading>
      <Select
        placeholder="Valitse terminaali..."
        noOptionsMessage={() => 'Haulla ei löydy terminaalia.'}
        options={mappedTerminals}
        defaultValue={selected}
        onChange={value => (value ? props.onChange(value.option) : props.onChange(''))}
        isClearable
        isSearchable
      />
    </div>
  );
};

TerminalSelect.propTypes = {
  selectedTerminal: PropTypes.string.isRequired,
  terminals: mobxPropTypes.arrayOrObservableArray,
  onChange: PropTypes.func.isRequired,
};

TerminalSelect.defaultProps = {
  terminals: [],
};

export default observer(TerminalSelect);
