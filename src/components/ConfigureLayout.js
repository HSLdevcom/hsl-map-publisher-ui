import React, { Component } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { blue50 } from 'material-ui/styles/colors';
import { computed, observable } from 'mobx';
import TemplateSelect from './TemplateSelect';
import get from 'lodash/get';

const Root = styled.div`
  display: flex;
  flex-direction: column;
`;

const AreaContainer = styled.div`
  padding: 1rem;
  background: ${blue50};

  h3 {
    margin-top: 0;
  }
`;

const Area = styled.div`
  margin-top: 1rem;
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: ${({ columns = '1fr 1fr 1fr' }) => columns};
  direction: ${({ direction = 'right' }) => direction};
  cursor: ${({ resizing = false }) => (resizing ? 'col-resize' : 'default')};
`;

const AreaSlot = styled.div`
  border-radius: 1rem;
  flex: none;
  border: 3px dashed white;
  position: relative;
  height: 15rem;
  overflow: hidden;

  svg {
    width: 100%;
    height: auto;
  }
`;

const Handle = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  padding: 1rem 0.5rem;
  height: 2rem;
  box-sizing: content-box;
  cursor: col-resize;

  &:before {
    content: '';
    width: 100%;
    height: 100%;
    display: block;
    background: red;
  }
`;

const HandleLeft = styled(Handle)`
  left: calc(-0.5rem + 3px);
`;

const HandleRight = styled(Handle)`
  right: calc(-0.5rem + 3px);
`;

const Item = styled.div`
  color: red;
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
    const currentTemplate = templates.find(
      template => template.id === selectedTemplate,
    );

    return currentTemplate || templates[0];
  }

  @computed
  get visibleImages() {
    const images = get(this, 'currentTemplate.images', []);
    return images.filter(image => image.size > 0);
  }

  @computed
  get imageCount() {
    return this.visibleImages.length;
  }

  @computed
  get currentTemplateColumns() {
    const columns = this.visibleImages.map(image => `${image.size}fr`);
    return columns.join(' ');
  }

  @observable currentlyResizingImage = null;

  onHandleMouseDown = (image, direction) => e => {
    const { left } = e.target.getBoundingClientRect();

    // eslint-disable-next-line
    image.resizing = {
      direction,
      start: left,
      value: 0,
    };

    this.currentlyResizingImage = image;
  };

  onHandleMouseMove = e => {
    if (!this.currentlyResizingImage) {
      return;
    }

    const image = this.currentlyResizingImage;
    const { start, direction } = image.resizing;
    const mouseX = e.clientX;
    const delta = direction === 'left' ? start - mouseX : mouseX - start;

    // eslint-disable-next-line
    image.resizing.value = this.imageCount > 1 ? Math.max(delta, 0) : delta;
  };

  onHandleMouseUp = e => {
    if (this.currentlyResizingImage && this.currentlyResizingImage.resizing) {
      const image = this.currentlyResizingImage;
      const { value, direction } = image.resizing;
      const { width } = e.target.getBoundingClientRect(); // Measure Area el

      const index = this.visibleImages.indexOf(image);
      
      const slotCount = this.visibleImages.reduce(
        (count, img) => count + img.size,
        0,
      );
      const slotWidth = width / slotCount;

      if (this.imageCount > 1 && value > slotWidth) {
        image.size = image.size + 1;
        const removeIdx =
          direction === 'left' && index > 0 ? index - 1 : index + 1;
        this.visibleImages[removeIdx].size = 0;
      } else {
      }
    }

    this.currentTemplate.images.forEach(img => {
      // eslint-disable-next-line
      img.resizing = null;
    });

    this.currentlyResizingImage = null;
  };

  render() {
    const { templates, selectedTemplate, onSelectTemplate } = this.props;
    const resizeDirection = get(
      this,
      'currentlyResizingImage.resizing.direction',
      'right',
    );

    const direction =
      resizeDirection === 'left' && this.imageCount === 1 ? 'rtl' : 'ltr';

    return (
      <Root>
        <h2>Templates</h2>
        <TemplateSelect
          templates={templates}
          selectedTemplate={selectedTemplate}
          onChange={onSelectTemplate}
        />
        <AreaContainer>
          <h3>Footer</h3>
          <Area
            direction={direction}
            resizing={!!this.currentlyResizingImage}
            onMouseUp={this.onHandleMouseUp}
            onMouseMove={this.onHandleMouseMove}
            columns={this.currentTemplateColumns}>
            {this.currentTemplate &&
              this.currentTemplate.images.map((image, idx, all) => {
                if (image.size === 0) {
                  return null;
                }

                const isFirst = idx === 0;
                const isLast = idx >= all.length - 1;
                const { resizing = null } = image;

                const resizeValue = get(resizing, 'value', 0);
                const resizeDir = get(resizing, 'direction', 'right');

                return (
                  <AreaSlot
                    style={{
                      transform:
                        resizeDir === 'left' && this.imageCount > 1
                          ? `translateX(-${resizeValue}px)`
                          : 'none',
                      width: `calc(100% + ${resizeValue}px)`,
                    }}
                    key={`template_slot_${this.currentTemplate.id}_${idx}`}>
                    {(!isFirst || this.visibleImages.length === 1) && (
                      <HandleLeft
                        onMouseDown={this.onHandleMouseDown(image, 'left')}
                      />
                    )}
                    {(!isLast || this.visibleImages.length === 1) && (
                      <HandleRight
                        onMouseDown={this.onHandleMouseDown(image, 'right')}
                      />
                    )}
                    <Item dangerouslySetInnerHTML={{ __html: image.svg }} />
                  </AreaSlot>
                );
              })}
          </Area>
        </AreaContainer>
      </Root>
    );
  }
}

export default ConfigureLayout;
