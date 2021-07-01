import React, { Component } from 'react';
import Chip from 'material-ui/Chip';
import RaisedButton from 'material-ui/RaisedButton';
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

import TemplateRuleBlock from './TemplateRuleBlock';

@observer
class TemplateRules extends Component {
  render() {
    console.log(this.props)
    return this.props.rules !== null ? (
      <div>
        <TemplateRuleBlock element={this.props.rules} />
      </div>
    ) : (
      <RaisedButton label="LUO SÄÄNTÖ" />
    );
  }
}

TemplateRules.propTypes = {
  rules: mobxPropTypes.objectOrObservableObject,
};

TemplateRules.defaultProps = {
  rules: {},
};

export default TemplateRules;
