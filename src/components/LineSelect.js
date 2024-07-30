import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import styled from 'styled-components';
import { TextField } from 'material-ui';

const SectionHeading = styled.h4`
  margin-bottom: 0.5rem;
`;

const LineSelect = props => (
  <div>
    <SectionHeading>Linja</SectionHeading>
    <TextField
      id="line-select"
      placeholder="Kirjoita linjan tunnus (esim. 6211U)"
      onChange={event =>
        event.target.value ? props.onChange(event.target.value) : props.onChange('')
      }
      style={{ width: '100%' }}
    />
  </div>
);

LineSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default observer(LineSelect);
