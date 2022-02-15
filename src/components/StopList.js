import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import compose from 'lodash/flow';
import { AutoSizer, List } from 'react-virtualized';
import { ListItem } from 'material-ui/List';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import { observer, inject } from 'mobx-react';

const Root = styled.div`
  flex-grow: 1;
  display: flex;
  flex-flow: column;
  min-height: 300px;
  height: 70vh;
  margin-bottom: 1rem;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
`;

const TextFieldContainer = styled.div`
  position: relative;
  flex-grow: 1;
`;

const ListContainer = styled.div`
  flex-grow: 1;
`;

const Spacer = styled.div`
  width: 10px;
`;

const PrimaryText = ({ title, subtitle }) => (
  <span>
    {title} <span style={{ opacity: 0.7 }}>{subtitle}</span>
  </span>
);

PrimaryText.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
};

function rowRenderer(rows, checkedRows, onCheck) {
  // eslint-disable-next-line react/prop-types
  return ({ key, index, style }) => {
    const { rowId, title, subtitle } = rows[index];
    const callback = (event, value) => onCheck([rows[index]], value, index);

    const isChecked = checkedRows.includes(rowId);
    return (
      <div key={key} style={style}>
        <ListItem
          data-cy={rowId}
          leftCheckbox={<Checkbox checked={isChecked} onCheck={callback} />}
          primaryText={<PrimaryText title={title} subtitle={subtitle} />}
          style={{ fontSize: 15 }}
        />
      </div>
    );
  };
}

const enhance = compose(observer, inject('commonStore', 'generatorStore'));

function StopList(props) {
  const { generatorStore, commonStore } = props;
  const { rows, checkedRows } = generatorStore;
  const { showOnlyCheckedStops, setShowOnlyCheckedStops } = commonStore;
  const { stopFilter, setStopFilter } = commonStore;
  const renderer = rowRenderer(rows, checkedRows, props.onCheck);

  return (
    <Root>
      <Row>
        <TextFieldContainer>
          <TextField
            data-cy="filterInput"
            onChange={(event, value) => setStopFilter(value)}
            value={stopFilter}
            hintText="Suodata..."
            fullWidth
          />
          {stopFilter && (
            <IconButton
              onClick={() => setStopFilter('')}
              style={{ position: 'absolute', right: 0 }}>
              <ClearIcon />
            </IconButton>
          )}
        </TextFieldContainer>
        <Spacer />
        <FlatButton
          disabled={checkedRows.length === 0}
          onClick={() => props.onReset()}
          label="Tyhjennä valinnat"
          data-cy="clear-selection"
        />
        <Spacer />
        <FlatButton
          disabled={!stopFilter.length}
          onClick={() => props.onCheck(rows, true)}
          label="Valitse kaikki"
        />
        <FlatButton
          onClick={() => {
            setShowOnlyCheckedStops(!showOnlyCheckedStops);
            setStopFilter('');
          }}
          label={!showOnlyCheckedStops ? 'Näytä valitut' : 'Näytä kaikki'}
        />
      </Row>
      <ListContainer>
        <AutoSizer>
          {({ height, width }) => (
            <List
              width={width}
              height={height}
              rowCount={rows.length}
              rowHeight={35}
              rowRenderer={renderer}
              style={{ outlineWidth: 0 }}
            />
          )}
        </AutoSizer>
      </ListContainer>
    </Root>
  );
}

StopList.propTypes = {
  generatorStore: PropTypes.object.isRequired,
  commonStore: PropTypes.object.isRequired,
  onCheck: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};

export default enhance(StopList);
