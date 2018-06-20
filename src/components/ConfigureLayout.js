import React, { Component } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { computed } from 'mobx';
import TemplateSelect from './TemplateSelect';
import get from 'lodash/get';
import TemplateArea from './TemplateArea';

const Root = styled.div`
  display: flex;
  flex-direction: column;
`;

@observer
class ConfigureLayout extends Component {
  static propTypes = {
    selectedTemplate: PropTypes.string,
    templates: PropTypes.array,
    onSelectTemplate: PropTypes.func.isRequired,
  };

  static defaultProps = {
    templates: [],
    selectedTemplate: null,
  };

  @computed
  get currentTemplate() {
    const { selectedTemplate, templates } = this.props;
    const currentTemplate = templates.find(template => template.id === selectedTemplate);

    return currentTemplate || templates[0];
  }

  render() {
    const { templates, onSelectTemplate } = this.props;

    return (
      <Root>
        <h2>Templates</h2>
        <TemplateSelect
          templates={templates}
          selectedTemplate={get(this, 'currentTemplate.id', null)}
          onChange={onSelectTemplate}
        />
        <TemplateArea template={this.currentTemplate} title="Footer" />
      </Root>
    );
  }
}

export default ConfigureLayout;
