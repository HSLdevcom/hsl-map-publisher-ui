import React, { Component } from 'react';
import Chip from 'material-ui/Chip';
import IconButton from 'material-ui/IconButton';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import AddCircle from 'material-ui/svg-icons/content/add-circle';
import { observer, PropTypes as mobxPropTypes } from 'mobx-react';
import get from 'lodash/get';
import { computed, observable, toJS } from 'mobx'; // eslint-disable-line no-unused-vars
import styled from 'styled-components';
import PropTypes from 'prop-types';

const styles = {
  chip: {
    margin: 4,
    border: '2px solid #636363',
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  selectIcon: {
    display: 'none',
  },
  selectLabel: {
    textAlign: 'center',
    padding: 0,
  },
};

const zones = ['A', 'B', 'C', 'D'];
const cities = ['H', 'V', 'E', 'Ka', 'Ke', 'Si', 'Tu', 'Ki', 'So'];
const modes = ['BUS', 'FERRY', 'RAIL', 'SUBWAY', 'TRAM'];

const CustomSelect = ({ value, width, children }) => (
  <SelectField
    value={value}
    style={{ width }}
    labelStyle={styles.selectLabel}
    autoWidth
    iconStyle={styles.selectIcon}>
    {children}
  </SelectField>
);

const Rule = ({ name, value }) => (
  <Chip
    style={styles.chip}
    backgroundColor="#FFCCCC"
    onRequestDelete={() => console.log('Rule will be deleted')}>
    <div style={styles.wrapper}>
      <CustomSelect value={name} width={70}>
        <MenuItem value="ZONE" primaryText="ZONE" />
        <MenuItem value="CITY" primaryText="CITY" />
        <MenuItem value="MODE" primaryText="MODE" />
        <MenuItem value="ROUTE" primaryText="ROUTE" />
      </CustomSelect>
      = {name === 'ROUTE' && <TextField defaultValue={value} style={{ width: 50 }} />}
      {name === 'ZONE' && (
        <CustomSelect value={value} width={30}>
          {zones.map(z => (
            <MenuItem value={z} primaryText={z} />
          ))}
        </CustomSelect>
      )}
      {name === 'CITY' && (
        <CustomSelect value={value} width={50}>
          {cities.map(z => (
            <MenuItem value={z} primaryText={z} />
          ))}
        </CustomSelect>
      )}
      {name === 'MODE' && (
        <CustomSelect value={value} width={80}>
          {modes.map(z => (
            <MenuItem value={z} primaryText={z} />
          ))}
        </CustomSelect>
      )}
    </div>
  </Chip>
);

const Operand = ({ name, value }) => (
  <Chip style={styles.chip} onRequestDelete={() => console.log('Operand will be deleted')}>
    <div style={styles.wrapper}>
      <CustomSelect value={name} width={60}>
        <MenuItem value="AND" primaryText="AND" />
        <MenuItem value="OR" primaryText="OR" />
        <MenuItem value="NOT" primaryText="NOT" />
      </CustomSelect>
      {value.map(element => (
        <div>
          {element.type === 'OPER' && <Operand name={element.name} value={element.value} />}
          {element.type === 'RULE' && <Rule name={element.name} value={element.value} />}
        </div>
      ))}
      {name !== 'NOT' && (
        <IconButton onClick={() => console.log('New item will be added')}>
          <AddCircle color="#B3B3B3" />
        </IconButton>
      )}
    </div>
  </Chip>
);

class TemplateRules extends Component {
  render() {
    return this.props.rules !== null ? (
      <div>
        {this.props.rules.type === 'OPER' && (
          <Operand name={this.props.rules.name} value={this.props.rules.value} />
        )}
        {this.props.rules.type === 'RULE' && (
          <Rule name={this.props.rules.name} value={this.props.rules.value} />
        )}
      </div>
    ) : (
      <p>Ei sääntöjä.</p>
    );
  }
}

CustomSelect.propTypes = {
  value: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
};

Rule.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

Operand.propTypes = {
  name: PropTypes.string.isRequired,
  value: mobxPropTypes.arrayOrObservableArray.isRequired,
};

TemplateRules.propTypes = {
  rules: mobxPropTypes.objectOrObservableObject,
};

TemplateRules.defaultProps = {
  rules: {},
};

export default TemplateRules;
