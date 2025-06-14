import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { ListItem, TextField } from 'material-ui';

const SectionHeading = styled.h3`
  margin-bottom: 0.5rem;
`;

const ListItemTitle = styled.h4`
  display: inline;
  width: fit-content;
`;

const SelectedLinesTitle = styled.h3`
  font-size: 1.2rem;
`;

const ListContainer = styled.div`
  flex-grow: 1;
  max-height: 500px;
  overflow-y: scroll;
`;

const mapLineItems = (lines, onClick) => {
  if (lines.length > 0 && lines[0] !== null) {
    return lines.map((line, index) => (
      <ListItem onClick={() => onClick(line)} key={index}>
        <ListItemTitle>{line.lineIdParsed}</ListItemTitle> <p>{line.nameFi}</p>
      </ListItem>
    ));
  }
  return '';
};

const LineSelect = props => (
  <div>
    <SectionHeading>Linja-aikataulu</SectionHeading>
    <TextField
      id="line-select"
      hintText="Hae linjaa..."
      onChange={event =>
        event.target.value ? props.setLineQuery(event.target.value) : props.setLineQuery('')
      }
      value={props.lineQuery}
      style={{ width: '100%' }}
    />
    <ListContainer>{mapLineItems(props.lines, props.addLine)}</ListContainer>
    <div>
      <SelectedLinesTitle>Generoitavat linja-aikataulut</SelectedLinesTitle>
      {mapLineItems(props.selectedLines, props.removeLine)}
    </div>
  </div>
);

const SingleLineSelect = props => (
  <div>
    <SectionHeading>Linjahaku</SectionHeading>
    <TextField
      id="line-select"
      hintText="Hae linjaa..."
      onChange={event =>
        event.target.value ? props.setLineQuery(event.target.value) : props.setLineQuery('')
      }
      value={props.lineQuery}
      style={{ width: '100%' }}
    />
    <ListContainer>{mapLineItems(props.lines, props.setSelectedRoutePlateLine)}</ListContainer>
    <div>
      <SelectedLinesTitle>Valittu linja</SelectedLinesTitle>
      {mapLineItems([props.selectedRoutePlateLine], props.clearSelectedRoutePlateLine)}
    </div>
  </div>
);

LineSelect.propTypes = {
  setLineQuery: PropTypes.func.isRequired,
  lineQuery: PropTypes.string.isRequired,
  lines: PropTypes.object.isRequired,
  addLine: PropTypes.func.isRequired,
  removeLine: PropTypes.func.isRequired,
  selectedLines: PropTypes.object.isRequired,
};

SingleLineSelect.propTypes = {
  setLineQuery: PropTypes.func.isRequired,
  lineQuery: PropTypes.string.isRequired,
  lines: PropTypes.object.isRequired,
  selectedRoutePlateLine: PropTypes.object,
  setSelectedRoutePlateLine: PropTypes.func.isRequired,
  clearSelectedRoutePlateLine: PropTypes.func.isRequired,
};

SingleLineSelect.defaultProps = {
  selectedRoutePlateLine: null,
};

export const ObservedLineSelect = observer(LineSelect);
export const ObservedSingleLineSelect = observer(SingleLineSelect);

export default { ObservedLineSelect, ObservedSingleLineSelect };
