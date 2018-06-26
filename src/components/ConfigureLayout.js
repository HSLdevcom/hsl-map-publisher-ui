import React, { Component } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { toJS, observable } from 'mobx';
import TemplateSelect from './TemplateSelect';
import get from 'lodash/get';
import TemplateArea from './TemplateArea';
import { FlatButton, RaisedButton } from 'material-ui';
import ArrowDown from 'material-ui/svg-icons/navigation/arrow-drop-down';
import ImageLibrary from './ImageLibrary';
import SvgInstructions from './SvgInstructions';
import { Collapse } from 'react-collapse';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const TemplateControls = styled.div`
  display: flex;
  padding: 0 0 0.5rem 0;

  > * {
    flex: none;
  }
`;

const Select = styled(TemplateSelect)`
  width: 100%;
`;

const CollapseButton = css`
  cursor: pointer;

  & > svg {
    vertical-align: middle;
    width: 30px;
    heigth: 30px;
  }
`;

const LayoutHeading = styled.h2`
  ${CollapseButton};
`;

const InstructionsHeading = styled.h4`
  ${CollapseButton};
`;

@observer
class ConfigureLayout extends Component {
  static propTypes = {
    onAddTemplate: PropTypes.func.isRequired,
    onSaveTemplate: PropTypes.func.isRequired,
    onRemoveTemplate: PropTypes.func.isRequired,
    onRemoveImage: PropTypes.func.isRequired,
    currentTemplate: PropTypes.object,
    templates: PropTypes.array,
    images: PropTypes.array,
    onSelectTemplate: PropTypes.func.isRequired,
  };

  static defaultProps = {
    templates: [],
    images: [],
    currentTemplate: null,
  };

  @observable
  sections = {
    layout: false,
    instructions: false,
  };

  toggle = which => e => {
    e.preventDefault();

    const current = this.sections[which];
    this.sections[which] = !current;
  };

  render() {
    const {
      templates,
      images,
      onSelectTemplate,
      onAddTemplate,
      onSaveTemplate,
      onRemoveTemplate,
      onRemoveImage,
      currentTemplate,
    } = this.props;

    return (
      <Root>
        <LayoutHeading onClick={this.toggle('layout')}>
          Sommittelu <ArrowDown style={{ width: '30px', height: '30px' }} />
        </LayoutHeading>
        <TemplateControls>
          <Select
            templates={templates}
            selectedTemplate={get(currentTemplate, 'id', null)}
            onChange={onSelectTemplate}
          />
        </TemplateControls>
        <Collapse isOpened={this.sections.layout} hasNestedCollapse>
          <TemplateControls>
            <RaisedButton
              primary
              onClick={() => onSaveTemplate(toJS(currentTemplate))}
              label="Tallenna sommittelu"
            />
            <FlatButton secondary onClick={() => onAddTemplate()} label="Uusi sommittelu..." />
            <FlatButton
              backgroundColor="#ffcccc"
              onClick={() => onRemoveTemplate(get(currentTemplate, 'id'))}
              label="Poista sommittelu"
            />
          </TemplateControls>
          <InstructionsHeading onClick={ this.toggle('instructions') }>
            Ohjeet <ArrowDown style={ { width: '30px', height: '30px' } } />
          </InstructionsHeading>
          <Collapse isOpened={ this.sections.instructions }>
            <SvgInstructions open={ this.sections.instructions } />
          </Collapse>
          <ImageLibrary removeImage={onRemoveImage} images={images} />
          <TemplateArea template={currentTemplate} title="Footer" />
        </Collapse>
      </Root>
    );
  }
}

export default ConfigureLayout;
