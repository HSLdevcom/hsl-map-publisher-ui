import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { computed, toJS } from 'mobx';
import TemplateSelect from './TemplateSelect';
import get from 'lodash/get';
import TemplateArea from './TemplateArea';
import { FlatButton, RaisedButton } from 'material-ui';

const Root = styled.div`
  display: flex;
  flex-direction: column;
`;

const TemplateControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 0 0.5rem 0;
`;

@inject('commonStore')
@observer
class ConfigureLayout extends Component {
  static propTypes = {
    commonStore: PropTypes.object.isRequired,
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
    const { templates, onSelectTemplate, commonStore } = this.props;

    return (
      <Root>
        <h2>Templates</h2>
        <TemplateControls>
          <TemplateSelect
            templates={templates}
            selectedTemplate={get(this, 'currentTemplate.id', null)}
            onChange={onSelectTemplate}
          />
          <FlatButton
            onClick={() => commonStore.addTemplate()}
            label="Uusi sommittelu..."
            style={{ height: 40, marginLeft: 10 }}
          />
          <RaisedButton
            primary
            onClick={() => commonStore.saveTemplate(toJS(this.currentTemplate))}
            label="Tallenna sommittelu"
            style={{ height: 40, marginLeft: 10 }}
          />
        </TemplateControls>
        <TemplateArea template={this.currentTemplate} title="Footer" />
      </Root>
    );
  }
}

export default ConfigureLayout;
