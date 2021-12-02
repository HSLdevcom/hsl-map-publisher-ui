import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { observer, PropTypes as mobxPropTypes } from 'mobx-react';
import { isEmpty } from 'lodash';

import TemplateRuleBlock from './TemplateRuleBlock';

@observer
class TemplateRules extends Component {
  addRules = () => {
    const { template } = this.props;
    template.rules = { type: 'RULE', name: '', value: '' };
  };

  deleteRules = () => {
    this.props.template.rules = {};
  };

  render() {
    const { template } = this.props;
    return (
      <div
        style={{
          width: 'max-content',
          maxWidth: '100%',
          marginBottom: '20px',
        }}>
        {!isEmpty(template.rules) ? (
          <TemplateRuleBlock element={template.rules} deleteElement={this.deleteRules} />
        ) : (
          <RaisedButton label="LUO SÄÄNTÖ" onClick={this.addRules} />
        )}
      </div>
    );
  }
}

TemplateRules.propTypes = {
  template: mobxPropTypes.observableObject.isRequired,
};

export default TemplateRules;
