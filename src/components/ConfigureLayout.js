import React, { Component } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { blue50 } from 'material-ui/styles/colors';
import { computed, observable, toJS } from 'mobx';
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
  cursor: ${({ resizing = false }) => (resizing ? 'col-resize' : 'default')};
  pointer-events: ${({ resizing = false }) => (resizing ? 'auto' : 'none')};
  user-select: none;
`;

const AreaSlot = styled.div`
  border-radius: 1rem;
  flex: 0 0 auto;
  border: 3px dashed white;
  position: relative;
  height: 15rem;
  overflow: hidden;
  position: relative;
  transform: translateZ(0);

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
  pointer-events: all;

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

function getSiblingIndex(index, direction) {
  const siblingIdx = direction === 'left' ? index - 1 : index + 1;
  return siblingIdx < 0 || siblingIdx > 2 ? 1 : siblingIdx;
}

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
    const { size = 1 } = image;
    const { start, direction } = image.resizing;
    const mouseX = e.clientX;
    const delta = direction === 'left' ? start - mouseX : mouseX - start;

    if (size > 1 && delta < 0) {
      image.resizing.value = Math.min(delta, -10);
    } else {
      image.resizing.value = Math.max(delta, 0);
    }
  };

  onHandleMouseUp = e => {
    e.stopPropagation();

    if (this.currentlyResizingImage) {
      const image = this.currentlyResizingImage;
      const { value, direction } = image.resizing;

      const slotCount = this.visibleImages.reduce((count, img) => count + img.size, 0);
      // TODO: Measure slot width
      const slotWidth = 880 / slotCount;
      const actionAreaWidth = slotWidth / 2;

      if (this.imageCount > 1 && value > actionAreaWidth) {
        const index = this.visibleImages.indexOf(image);
        const affectedSiblingIdx = getSiblingIndex(index, direction);

        image.size = image.size + 1;
        const siblingSize = get(this, `visibleImages[${affectedSiblingIdx}].size`, 0);
        this.visibleImages[affectedSiblingIdx].size = siblingSize - 1;
      } else if (value < -actionAreaWidth && image.size > 1) {
        const absoluteIndex = get(this, 'currentTemplate.images', []).indexOf(image);
        const affectedSiblingIdx = getSiblingIndex(absoluteIndex, direction);

        image.size = image.size - 1;
        const siblingSize = get(this, `currentTemplate.images[${affectedSiblingIdx}].size`, 0);
        this.currentTemplate.images[affectedSiblingIdx].size = siblingSize + 1;
      }
    }

    this.resetResize();
  };

  resetResize = () => {
    this.currentTemplate.images.forEach(img => {
      // eslint-disable-next-line
      img.resizing = null;
    });

    this.currentlyResizingImage = null;
  };

  render() {
    const { templates, onSelectTemplate } = this.props;
    /*const resizeDirection = get(this, 'currentlyResizingImage.resizing.direction', 'right');
    const direction = this.imageCount === 1 && resizeDirection === 'left' ? 'rtl' : 'ltr';*/

    return (
      <Root>
        <h2>Templates</h2>
        <TemplateSelect
          templates={templates}
          selectedTemplate={get(this, 'currentTemplate.id', null)}
          onChange={onSelectTemplate}
        />
        <AreaContainer>
          <h3>Footer</h3>
          <Area
            resizing={!!this.currentlyResizingImage}
            onMouseUp={this.onHandleMouseUp}
            onMouseMove={this.onHandleMouseMove}
            columns={this.currentTemplateColumns}>
            {this.visibleImages.map((image, idx, all) => {
              if (image.size === 0) {
                return null;
              }

              const isFirst = idx === 0;
              const isLast = idx >= all.length - 1;
              const { resizing = null } = image;

              const resizeValue = get(resizing, 'value', 0);
              const resizeDir = get(resizing, 'direction', 'right');

              const resizeStyle = {
                left: resizeDir === 'left' && resizeValue > 0 ? `-${resizeValue}px` : 'auto',
                right: resizeDir === 'left' && resizeValue < 0 ? `${resizeValue}px` : 'auto',
                width: `calc(100% + ${resizeValue}px)`,
              };

              return (
                <AreaSlot
                  style={resizeStyle}
                  resizeValue={resizeValue}
                  key={`template_slot_${this.currentTemplate.id}_${idx}`}>
                  {(!isFirst || image.size > 1) && (
                    <HandleLeft onMouseDown={this.onHandleMouseDown(image, 'left')} />
                  )}
                  {(!isLast || image.size > 1) && (
                    <HandleRight onMouseDown={this.onHandleMouseDown(image, 'right')} />
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
