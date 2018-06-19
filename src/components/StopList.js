import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { AutoSizer, List } from 'react-virtualized';
import { ListItem } from 'material-ui/List';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import { observer } from 'mobx-react';
import { computed } from 'mobx';

const Root = styled.div`
  flex-grow: 1;
  display: flex;
  flex-flow: column;
  min-height: 300px;
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

function rowRenderer(rows, onCheck) {
  // eslint-disable-next-line react/prop-types
  return ({ key, index, style }) => {
    const { isChecked, title, subtitle } = rows[index];
    const callback = (event, value) => onCheck([rows[index]], value, index);

    return (
      <div key={key} style={style}>
        <ListItem
          leftCheckbox={<Checkbox checked={isChecked} onCheck={callback} />}
          primaryText={<PrimaryText title={title} subtitle={subtitle} />}
          style={{ fontSize: 15 }}
        />
      </div>
    );
  };
}

@observer
class StopList extends Component {
  static propTypes = {
    rows: PropTypes.arrayOf(
      PropTypes.shape({
        isChecked: PropTypes.bool.isRequired,
        title: PropTypes.string.isRequired,
        subtitle: PropTypes.string.isRequired,
      }),
    ).isRequired,
    onCheck: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
  };

  state = { visibleRows: this.props.rows, filterValue: '' };

  onFilterValueChange(value) {
    const shortIdRegexp = /([a-zA-Z]{1,2})\s*([0-9]{4})\s*,?\s+/g;
    const filterValue = value.replace(shortIdRegexp, '$1$2, ');

    this.setState({
      filterValue,
    });
  }

  @computed
  get visibleRows() {
    const { filterValue } = this.state;
    const { rows } = this.props;

    const keywords = filterValue
      .split(',')
      .map(keyword => keyword.trim())
      .filter(keyword => keyword.length > 0);

    if (keywords.length < 1) {
      return rows;
    }
    return rows.filter(({ title, subtitle }) =>
      keywords.some(keyword =>
        `${title}${subtitle}`.toLowerCase().includes(keyword.toLowerCase()),
      ),
    );
  }

  render() {
    const { filterValue } = this.state;
    const { onCheck, rows, onReset } = this.props;

    const renderer = rowRenderer(this.visibleRows, this.props.onCheck);

    return (
      <Root>
        <Row>
          <TextFieldContainer>
            <TextField
              onChange={(event, value) => this.onFilterValueChange(value)}
              value={filterValue}
              hintText="Suodata..."
              fullWidth
            />
            {filterValue && (
              <IconButton
                onClick={() => this.onFilterValueChange('')}
                style={{ position: 'absolute', right: 0 }}
              >
                <ClearIcon />
              </IconButton>
            )}
          </TextFieldContainer>
          <Spacer />
          <FlatButton
            disabled={!rows.some(({ isChecked }) => isChecked)}
            onClick={() => onReset()}
            label="Tyhjennä valinnat"
          />
          <Spacer />
          <FlatButton
            disabled={!filterValue.length}
            onClick={() => onCheck(this.state.visibleRows, true)}
            label="Valitse kaikki"
          />
        </Row>
        <ListContainer>
          <AutoSizer>
            {({ height, width }) => (
              <List
                width={width}
                height={height}
                rowCount={this.visibleRows.length}
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
}

export default StopList;
