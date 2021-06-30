import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import styled, { css } from 'styled-components';
import { observable } from 'mobx';
import get from 'lodash/get';
import TemplateArea from './TemplateArea';
import TemplateRules from './TemplateRules';
import ArrowDown from 'material-ui/svg-icons/navigation/arrow-drop-down';
import ImageLibrary from './ImageLibrary';
import Instructions from './Instructions';
import { SlideDown } from 'react-slidedown';
import 'react-slidedown/lib/slidedown.css';
import SelectTemplate from './SelectTemplate';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
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
  ${({ open = false }) => (open ? 'transform: rotate(180deg);' : '')};
`;

@inject('commonStore', 'generatorStore')
@observer
class ConfigureLayout extends Component {
  static propTypes = {
    commonStore: PropTypes.object,
  };

  static defaultProps = {
    commonStore: {},
  };

  @observable
  sections = {
    templateSelect: true,
    library: false,
    instructions: false,
    areas: true,
    rules: true,
  };

  componentDidUpdate() {
    const { commonStore } = this.props;
    const { setSavedTemplate, prevSavedTemplate, currentTemplate } = commonStore;

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
    const { commonStore } = this.props;

    const {
      templates,
      images,
      selectTemplate,
      saveTemplate,
      addTemplate,
      removeTemplate,
      removeImage,
      currentTemplate,
      templateIsDirty,
    } = commonStore;

    return (
      <Root>
        <SelectTemplate
          onSaveTemplate={saveTemplate}
          onAddTemplate={addTemplate}
          onRemoveTemplate={removeTemplate}
          templateIsDirty={templateIsDirty}
          currentTemplate={currentTemplate}
          templates={templates}
          onSelectTemplate={selectTemplate}
        />
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
          <ImageLibrary removeImage={removeImage} images={images} />
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
            <SectionHeading onClick={this.toggle('rules')}>
              Säännöt{' '}
              <CollapseButtonArrow
                open={this.sections.rules}
                style={{ width: '30px', height: '30px' }}
              />
            </SectionHeading>
            <SlideDown closed={!this.sections.rules}>
              <TemplateRules rules={currentTemplate.rules} />
            </SlideDown>
          </React.Fragment>
        )}
      </Root>
    );
  }
}

export default ConfigureLayout;
