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
  flex-wrap: wrap;
  align-items: center;
  margin: 0 0 0.5rem 0;

  > * {
    flex: none;
    margin-right: 1rem;
  }
`;

@observer
class ConfigureLayout extends Component {
  static propTypes = {
    onAddTemplate: PropTypes.func.isRequired,
    onSaveTemplate: PropTypes.func.isRequired,
    onRemoveTemplate: PropTypes.func.isRequired,
    onRemoveImage: PropTypes.func.isRequired,
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
    const {
      templates,
      images,
      onSelectTemplate,
      onAddTemplate,
      onSaveTemplate,
      onRemoveTemplate,
    } = this.props;

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
            backgroundColor="#ffcccc"
            onClick={() => onRemoveTemplate(get(this, 'currentTemplate.id'))}
            label="Poista sommittelu"
          />
          <FlatButton onClick={() => onAddTemplate()} label="Uusi sommittelu..." />
          <RaisedButton
            primary
            onClick={() => onSaveTemplate(toJS(this.currentTemplate))}
            label="Tallenna sommittelu"
          />
        </TemplateControls>
        {images.length > 0 && <ImageLibrary images={images} />}
        <TemplateArea template={this.currentTemplate} title="Footer" />
      </Root>
    );
  }
}

export default ConfigureLayout;
