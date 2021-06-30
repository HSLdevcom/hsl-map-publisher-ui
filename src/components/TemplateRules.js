import React, { Component } from 'react';
import Chip from 'material-ui/Chip';
import IconButton from 'material-ui/IconButton';
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
};

const Rule = ({ name, value }) => (
  <Chip
    style={styles.chip}
    backgroundColor="#FFCCCC"
    onRequestDelete={() => console.log('Rule will be deleted')}
    onClick={() => console.log('Rule clicked')}>
    {`${name}=${value}`}
  </Chip>
);

const Operand = ({ name, value }) => (
  <Chip
    style={styles.chip}
    onRequestDelete={() => console.log('Operand will be deleted')}
    onClick={() => console.log('Operand clicked')}>
    <div style={styles.wrapper}>
      {name}
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
