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
  static filterRows(rows, filterValue) {
    return rows.filter(({ title, subtitle }) =>
      `${title}${subtitle}`.toLowerCase().includes(filterValue.toLowerCase()),
    );
  }

  constructor(props) {
    super(props);
    this.state = { rows: props.rows, filterValue: '' };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      rows: StopList.filterRows(nextProps.rows, this.state.filterValue),
    });
  }

  onFilterValueChange(filterValue) {
    this.setState({
      rows: StopList.filterRows(this.props.rows, filterValue),
      filterValue,
    });
  }

  render() {
    const renderer = rowRenderer(this.state.rows, this.props.onCheck);

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
                rowCount={this.state.rows.length}
                rowHeight={35}
                rowRenderer={renderer}
                tabIndex="none"
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
