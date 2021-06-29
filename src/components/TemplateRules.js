import React, { Component } from 'react';
import { observer, PropTypes as mobxPropTypes } from 'mobx-react';
import get from 'lodash/get';
import { computed, observable, toJS } from 'mobx'; // eslint-disable-line no-unused-vars
import styled from 'styled-components';
import PropTypes from 'prop-types';

class TemplateRules extends Component {
  render() {
    return <p>{JSON.stringify(this.props.rules)}</p>;
  }
}

TemplateRules.propTypes = {
  rules: PropTypes.object,
};

TemplateRules.defaultProps = {
  rules: {},
};

export default TemplateRules;
