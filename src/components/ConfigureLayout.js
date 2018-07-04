import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as mobxPropTypes } from 'mobx-react';
import styled, { css } from 'styled-components';
import { toJS, observable } from 'mobx';
import TemplateSelect from './TemplateSelect';
import get from 'lodash/get';
import TemplateArea from './TemplateArea';
import { FlatButton, RaisedButton } from 'material-ui';
import ArrowDown from 'material-ui/svg-icons/navigation/arrow-drop-down';
import ImageLibrary from './ImageLibrary';
import Instructions from './Instructions';
import { SlideDown } from 'react-slidedown';
import 'react-slidedown/lib/slidedown.css';

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

const SlideDownButton = css`
  cursor: pointer;

  & > svg {
    vertical-align: middle;
    width: 30px;
    heigth: 30px;
  }
`;

const SectionHeading = styled.h4`
  ${SlideDownButton};
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
    setSavedTemplate: PropTypes.func.isRequired,
    prevSavedTemplate: PropTypes.any,
    templateIsDirty: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    templates: [],
    images: [],
    prevSavedTemplate: null,
    currentTemplate: null,
  };

  @observable
  sections = {
    templateSelect: true,
    library: false,
    instructions: false,
    areas: true,
  };

  componentDidUpdate() {
    const { setSavedTemplate, prevSavedTemplate, currentTemplate } = this.props;
    const prevSaved = JSON.parse(prevSavedTemplate);
    // Check if the template changed. If the ID is not found on the object,
    // it means that the value was null and we always want to replace it.
    if (get(prevSaved, 'id', '123') !== get(currentTemplate, 'id', 'abc')) {
      // Replace the prev saved template with the currently chosen one.
      setSavedTemplate();
    }
  }

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
      onSaveTemplate,
      onAddTemplate,
      onRemoveTemplate,
      onRemoveImage,
      currentTemplate,
      templateIsDirty,
    } = this.props;

    return (
      <Root>
        <h2>Sommittelu</h2>
        <SectionHeading onClick={this.toggle('templateSelect')}>
          Valitse sommittelu{' '}
          <CollapseButtonArrow
            open={this.sections.templateSelect}
            style={{ width: '30px', height: '30px' }}
          />
        </SectionHeading>
        <SlideDown closed={!this.sections.templateSelect}>
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
              disabled={!templateIsDirty}
              onClick={() => onSaveTemplate(toJS(currentTemplate))}
              label="Tallenna sommittelu"
            />
            <FlatButton onClick={() => onAddTemplate()} label="Uusi sommittelu..." />
            <FlatButton
              backgroundColor="#ffcccc"
              onClick={() => onRemoveTemplate(get(currentTemplate, 'id'))}
              label="Poista sommittelu"
            />
          </TemplateControls>
        </SlideDown>
        <SectionHeading onClick={this.toggle('instructions')}>
          Ohjeet{' '}
          <CollapseButtonArrow
            open={this.sections.instructions}
            style={{ width: '30px', height: '30px' }}
          />
        </SectionHeading>
        <SlideDown closed={!this.sections.instructions}>
          <Instructions />
        </SlideDown>
        <SectionHeading onClick={this.toggle('library')}>
          Kirjasto{' '}
          <CollapseButtonArrow
            open={this.sections.library}
            style={{ width: '30px', height: '30px' }}
          />
        </SectionHeading>
        <SlideDown closed={!this.sections.library}>
          <ImageLibrary removeImage={onRemoveImage} images={images} />
        </SlideDown>
        {currentTemplate && (
          <React.Fragment>
            <SectionHeading onClick={this.toggle('areas')}>
              Alueet{' '}
              <CollapseButtonArrow
                open={this.sections.areas}
                style={{ width: '30px', height: '30px' }}
              />
            </SectionHeading>
            <SlideDown closed={!this.sections.areas}>
              {currentTemplate.areas.map((area, key) => (
                <TemplateArea area={area} key={`template_area_${key}`} />
              ))}
            </SlideDown>
          </React.Fragment>
        )}
      </Root>
    );
  }
}

export default ConfigureLayout;
