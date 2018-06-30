import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as mobxPropTypes } from 'mobx-react';
import styled, { css } from 'styled-components';
import { toJS, observable, computed } from 'mobx';
import TemplateSelect from './TemplateSelect';
import get from 'lodash/get';
import reduce from 'lodash/reduce';
import TemplateArea from './TemplateArea';
import { FlatButton, RaisedButton } from 'material-ui';
import ArrowDown from 'material-ui/svg-icons/navigation/arrow-drop-down';
import ImageLibrary from './ImageLibrary';
import SvgInstructions from './Instructions';
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
  margin-bottom: 0;
`;

const CollapseButtonArrow = styled(ArrowDown)`
  transition: transform 0.1s ease-out;
  ${({ open = false }) =>
    open
      ? `
    transform: rotate(180deg);
  `
      : ''};
`;

@observer
class ConfigureLayout extends Component {
  static propTypes = {
    onAddTemplate: PropTypes.func.isRequired,
    onSaveTemplate: PropTypes.func.isRequired,
    onRemoveTemplate: PropTypes.func.isRequired,
    onRemoveImage: PropTypes.func.isRequired,
    currentTemplate: PropTypes.object,
    templates: mobxPropTypes.arrayOrObservableArray,
    images: mobxPropTypes.arrayOrObservableArray,
    onSelectTemplate: PropTypes.func.isRequired,
  };

  static defaultProps = {
    templates: [],
    images: [],
    currentTemplate: null,
  };

  @observable
  sections = {
    layout: true,
    instructions: false,
  };

  @observable prevSavedTemplate = this.serializeCurrentTemplate();

  @computed
  get templateIsDirty() {
    const { currentTemplate } = this.props;
    const serializedTemplate = this.serializeCurrentTemplate(currentTemplate);

    const isDirty = serializedTemplate !== this.prevSavedTemplate;
    return isDirty;
  }

  componentDidUpdate() {
    const prevSaved = JSON.parse(this.prevSavedTemplate);

    if (!prevSaved) {
      return;
    }

    const currentTemplate = this.props.currentTemplate;

    if (get(prevSaved, 'id', 'different') !== get(currentTemplate, 'id', 'ids')) {
      this.prevSavedTemplate = this.serializeCurrentTemplate();
    }
  }

  toggle = which => e => {
    e.preventDefault();

    const current = this.sections[which];
    this.sections[which] = !current;
  };

  onSaveClick = e => {
    e.preventDefault();
    const { onSaveTemplate, currentTemplate } = this.props;
    const currentTemplatePlain = toJS(currentTemplate);

    onSaveTemplate(currentTemplatePlain).then(() => {
      this.prevSavedTemplate = this.serializeCurrentTemplate();
    });
  };

  serializeCurrentTemplate = (template = this.props.currentTemplate) => {
    const pickProps = ['id', 'label', 'images'];

    const currentTemplatePlain = reduce(
      toJS(template),
      (picked, value, key) => {
        if (pickProps.includes(key)) {
          // eslint-disable-next-line no-param-reassign
          picked[key] = value;
        }

        if (key === 'images') {
          // eslint-disable-next-line no-param-reassign
          picked.images = picked.images.map(({ name, size }) => ({ name, size }));
        }

        return picked;
      },
      {},
    );

    return JSON.stringify(currentTemplatePlain);
  };

  render() {
    const {
      templates,
      images,
      onSelectTemplate,
      onAddTemplate,
      onRemoveTemplate,
      onRemoveImage,
      currentTemplate,
    } = this.props;

    return (
      <Root>
        <LayoutHeading onClick={this.toggle('layout')}>
          Sommittelu{' '}
          <CollapseButtonArrow
            open={this.sections.layout}
            style={{ width: '30px', height: '30px' }}
          />
        </LayoutHeading>
        <TemplateControls>
          <Select
            templates={templates}
            selectedTemplate={get(currentTemplate, 'id', null)}
            onChange={onSelectTemplate}
          />
        </TemplateControls>
        <TemplateControls>
          <RaisedButton
            primary
            disabled={!this.templateIsDirty}
            onClick={this.onSaveClick}
            label="Tallenna sommittelu"
          />
          <FlatButton onClick={() => onAddTemplate()} label="Uusi sommittelu..." />
          <FlatButton
            backgroundColor="#ffcccc"
            onClick={() => onRemoveTemplate(get(currentTemplate, 'id'))}
            label="Poista sommittelu"
          />
        </TemplateControls>
        <InstructionsHeading onClick={this.toggle('instructions')}>
          Ohjeet{' '}
          <CollapseButtonArrow
            open={this.sections.instructions}
            style={{ width: '30px', height: '30px' }}
          />
        </InstructionsHeading>
        <Collapse isOpened={this.sections.instructions}>
          <SvgInstructions open={this.sections.instructions} />
        </Collapse>
        <ImageLibrary removeImage={onRemoveImage} images={images} />
        <TemplateArea template={currentTemplate} title="Footer" />
      </Root>
    );
  }
}

export default ConfigureLayout;
