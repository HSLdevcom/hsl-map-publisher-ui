import React, { Component } from 'react';
import { observer } from 'mobx-react';
import get from 'lodash/get';
import { blue50 } from 'material-ui/styles/colors';
import { computed, observable } from 'mobx';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import TemplateImage from './TemplateImage';

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
          {this.visibleImages.map((image, idx, all) => (
            <TemplateImage
              key={`template_image_${template.id}_${idx}`}
              image={image}
              index={idx}
              totalImages={all.length}
              onMouseDown={this.onHandleMouseDown}
            />
          ))}
        </Area>
      </AreaContainer>
    );
  }
}

export default TemplateArea;
