import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { AutoSizer, List } from 'react-virtualized';
import { ListItem } from 'material-ui/List';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import Checkbox from 'material-ui/Checkbox';
import ClearIcon from 'material-ui/svg-icons/content/clear';

const Root = styled.div`
  position: relative;
  flex-grow: 1;
  display: flex;
  flex-flow: column;
`;

const ListContainer = styled.div`
  flex-grow: 1;
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
    const callback = (event, value) => onCheck(rows[index], value, index);

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

class StopList extends Component {
  static getVisibleRows(rows, filterValue) {
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

  constructor(props) {
    super(props);
    this.state = { visibleRows: props.rows, filterValue: '' };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      visibleRows: StopList.getVisibleRows(
        nextProps.rows,
        this.state.filterValue,
      ),
    });
  }

  onFilterValueChange(filterValue) {
    this.setState({
      visibleRows: StopList.getVisibleRows(this.props.rows, filterValue),
      filterValue,
    });
  }

  render() {
    const renderer = rowRenderer(this.state.visibleRows, this.props.onCheck);

    return (
      <Root>
        <TextField
          onChange={(event, value) => this.onFilterValueChange(value)}
          value={this.state.filterValue}
          hintText="Suodata..."
          fullWidth
        />
        {this.state.filterValue && (
          <IconButton
            onClick={() => this.onFilterValueChange('')}
            style={{ position: 'absolute', right: 0 }}
          >
            <ClearIcon />
          </IconButton>
        )}
        <ListContainer>
          <AutoSizer>
            {({ height, width }) => (
              <List
                width={width}
                height={height}
                rowCount={this.state.visibleRows.length}
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

StopList.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      isChecked: PropTypes.bool.isRequired,
      title: PropTypes.string.isRequired,
      subtitle: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onCheck: PropTypes.func.isRequired,
};

export default StopList;
