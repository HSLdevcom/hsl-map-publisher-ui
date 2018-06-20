import React, { Component } from 'react';
import { observer } from 'mobx-react';
import get from 'lodash/get';
import { blue50 } from 'material-ui/styles/colors';
import { computed, observable } from 'mobx';
import styled from 'styled-components';
import PropTypes from 'prop-types';

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
  transition: width ${({ resizing = false }) => (resizing ? '0.1s' : '0.25s')} ease-out,
    left 0.1s ease-out, right 0.1s ease-out;
  ${({ resizing = false }) => (resizing ? 'z-index: 10' : '')};

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
class TemplateArea extends Component {
  static propTypes = {
    template: PropTypes.object,
    title: PropTypes.string,
  };

  static defaultProps = {
    template: {},
    title: 'Untitled area',
  };

  @computed
  get images() {
    return get(this.props.template, 'images', []);
  }

  @computed
  get visibleImages() {
    return this.images.filter(image => image.size > 0);
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
      image.resizing.value = delta < -20 ? delta : 0;
    } else {
      image.resizing.value = delta > 20 ? delta : 0;
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
        const absoluteIndex = get(this, 'images', []).indexOf(image);
        const affectedSiblingIdx = getSiblingIndex(absoluteIndex, direction);

        image.size = image.size - 1;
        const siblingSize = get(this, `images[${affectedSiblingIdx}].size`, 0);
        this.images[affectedSiblingIdx].size = siblingSize + 1;
      }
    }

    this.resetResize();
  };

  resetResize = () => {
    this.images.forEach(img => {
      // eslint-disable-next-line
      img.resizing = null;
    });

    this.currentlyResizingImage = null;
  };

  render() {
    const { title, template } = this.props;

    return (
      <AreaContainer>
        <h3>{title}</h3>
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
                resizing={!!resizing}
                style={resizeStyle}
                resizeValue={resizeValue}
                key={`template_slot_${template.id}_${idx}`}>
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
    );
  }
}

export default TemplateArea;
