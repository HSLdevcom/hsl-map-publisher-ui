import React, { Component } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { computed, toJS } from 'mobx';
import TemplateSelect from './TemplateSelect';
import get from 'lodash/get';
import TemplateArea from './TemplateArea';
import { FlatButton, RaisedButton } from 'material-ui';
import ImageLibrary from './ImageLibrary';

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

@observer
class ConfigureLayout extends Component {
  static propTypes = {
    onAddTemplate: PropTypes.func.isRequired,
    onSaveTemplate: PropTypes.func.isRequired,
    selectedTemplate: PropTypes.string,
    templates: PropTypes.array,
    images: PropTypes.array,
    onSelectTemplate: PropTypes.func.isRequired,
  };

  static defaultProps = {
    templates: [],
    images: [],
    selectedTemplate: null,
  };

  @computed
  get currentTemplate() {
    const { selectedTemplate, templates } = this.props;
    const currentTemplate = templates.find(template => template.id === selectedTemplate);

    return currentTemplate || templates[0];
  }

  render() {
    const { templates, images, onSelectTemplate, onAddTemplate, onSaveTemplate } = this.props;

    return (
      <Root>
        <h2>Sommittelut</h2>
        <TemplateControls>
          <TemplateSelect
            templates={templates}
            selectedTemplate={get(this, 'currentTemplate.id', null)}
            onChange={onSelectTemplate}
          />
          <FlatButton
            onClick={() => onAddTemplate()}
            label="Uusi sommittelu..."
            style={{ height: 40, marginLeft: 10 }}
          />
          <RaisedButton
            primary
            onClick={() => onSaveTemplate(toJS(this.currentTemplate))}
            label="Tallenna sommittelu"
            style={{ height: 40, marginLeft: 10 }}
          />
        </TemplateControls>
        {images.length > 0 && (
          <ImageLibrary images={ images } />
        )}
        <TemplateArea template={this.currentTemplate} title="Footer" />
      </Root>
    );
  }
}

export default ConfigureLayout;
