import React, { Component } from 'react';
import Chip from 'material-ui/Chip';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import AddCircle from 'material-ui/svg-icons/content/add-circle';
import { observer, PropTypes as mobxPropTypes } from 'mobx-react';
import PropTypes from 'prop-types';

import TemplateRuleSelectInput from './TemplateRuleSelectInput';

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

const properties = ['ZONE', 'CITY', 'MODE', 'ROUTE'];
const zones = ['A', 'B', 'C', 'D'];
const cities = ['H', 'V', 'E', 'Ka', 'Ke', 'Si', 'Tu', 'Ki', 'So'];
const modes = ['BUS', 'FERRY', 'RAIL', 'SUBWAY', 'TRAM'];
const operands = ['AND', 'OR', 'NOT'];

@observer
class TemplateRuleBlock extends Component {
  onNameSelectChange = (event, index, value) => {
    const { element } = this.props;
    const newType = operands.includes(value) ? 'OPER' : 'RULE';

    element.name = value;
    if (newType !== element.type) {
      element.type = newType;
    }
    element.value = newType === 'OPER' ? [{ type: 'RULE', name: '', value: '' }] : '';
  };

  onValueSelectChange = (event, index, value) => {
    this.props.element.value = value;
  };

  onValueTextChange = event => {
    this.props.element.value = event.target.value;
  };

  addSubElement = () => {
    this.props.element.value.push({ type: 'RULE', name: '', value: '' });
  };

  removeSubElement = index => {
    const { element, deleteElement } = this.props;
    if (element.value.length === 1) {
      deleteElement();
    } else {
      this.props.element.value.splice(index, 1);
    }
  };

  renderRuleOption() {
    const { element } = this.props;

    switch (element.name) {
      case 'ROUTE':
        return (
          <TextField
            name="route-input"
            defaultValue={element.value}
            onChange={this.onValueTextChange}
            style={{ width: 50 }}
            onKeyDown={e => e.stopPropagation()}
          />
        );
      case 'ZONE':
        return (
          <TemplateRuleSelectInput
            value={element.value}
            onSelect={this.onValueSelectChange}
            width={30}
            items={zones}
          />
        );
      case 'CITY':
        return (
          <TemplateRuleSelectInput
            value={element.value}
            onSelect={this.onValueSelectChange}
            width={50}
            items={cities}
          />
        );
      case 'MODE':
        return (
          <TemplateRuleSelectInput
            value={element.value}
            onSelect={this.onValueSelectChange}
            width={80}
            items={modes}
          />
        );
      default:
        return null;
    }
  }

  renderOperOption() {
    const { element } = this.props;
    return (
      <React.Fragment>
        {element.value.map((subElement, index) => (
          <div key={index}>
            <TemplateRuleBlock
              element={subElement}
              deleteElement={() => this.removeSubElement(index)}
            />
          </div>
        ))}
        {element.name !== 'NOT' && (
          <IconButton onClick={this.addSubElement}>
            <AddCircle color="#B3B3B3" />
          </IconButton>
        )}
      </React.Fragment>
    );
  }

  render() {
    const { element, deleteElement } = this.props;
    return (
      <Chip
        style={styles.chip}
        backgroundColor={element.type === 'RULE' ? '#FFCCCC' : undefined}
        onRequestDelete={element.type === 'RULE' ? deleteElement : null}>
        <div style={styles.wrapper}>
          <TemplateRuleSelectInput
            value={element.name}
            onSelect={this.onNameSelectChange}
            width={70}
            items={operands.concat(properties)}
          />
          {element.type === 'OPER' && this.renderOperOption()}
          {element.type === 'RULE' && <p>=</p>}
          {element.type === 'RULE' && this.renderRuleOption()}
        </div>
      </Chip>
    );
  }
}

TemplateRuleBlock.propTypes = {
  element: PropTypes.shape({
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, mobxPropTypes.arrayOrObservableArray]),
  }).isRequired,
  deleteElement: PropTypes.func.isRequired,
};

export default TemplateRuleBlock;
