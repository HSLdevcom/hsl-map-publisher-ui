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

const Root = styled.div`
  flex-grow: 1;
  display: flex;
  flex-flow: column;
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

class StopList extends Component {
  static getVisibleRows(rows, filterValue) {
    const keywords = filterValue
      .split(',')
      .map(keyword => keyword.trim())
      .filter(keyword => keyword.length > 0);
    if (keywords.length < 1) {
      return rows;
    }
    let filterord = [];
    for (const keyword of keywords) {
      filterord = filterord.concat(
        rows.filter(({ title, subtitle }) =>
          `${title}${subtitle}`.toLowerCase().includes(keyword.toLowerCase()),
        ),
      );
    }
    return filterord;
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

  onFilterValueChange(value) {
    const shortIdRegexp = /([a-zA-Z]{1,2})\s*([0-9]{4})\s*,?\s+/g;
    const filterValue = value.replace(shortIdRegexp, '$1$2, ');
    this.setState({
      visibleRows: StopList.getVisibleRows(this.props.rows, filterValue),
      filterValue,
    });
  }

  render() {
    const renderer = rowRenderer(this.state.visibleRows, this.props.onCheck);

    return (
      <Root>
        <Row>
          <TextFieldContainer>
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
          </TextFieldContainer>
          <Spacer />
          <FlatButton
            disabled={!this.props.rows.some(({ isChecked }) => isChecked)}
            onClick={() => this.props.onReset()}
            label="Tyhjennä valinnat"
          />
          <Spacer />
          <FlatButton
            disabled={!this.state.filterValue.length}
            onClick={() => this.props.onCheck(this.state.visibleRows, true)}
            label="Valitse kaikki"
          />
        </Row>
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
  onReset: PropTypes.func.isRequired,
};

export default StopList;
