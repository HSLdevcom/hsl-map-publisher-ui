import React, { Component } from 'react';
import { observer } from 'mobx-react';
import get from 'lodash/get';
import { computed, observable, toJS } from 'mobx'; // eslint-disable-line no-unused-vars
import styled from 'styled-components';
import PropTypes from 'prop-types';
import TemplateSlot from './TemplateSlot';

const AreaContainer = styled.div`
  background: hsl(204, 100%, 39%);

  > * {
    margin-top: 0;
  }
`;

const Area = styled.div`
  padding: 2rem;
  position: relative;
  display: grid;
  grid-gap: 32px; // 2rem
  grid-template-columns: ${({ columns = '1fr 1fr 1fr' }) => columns};
  cursor: ${({ resizing = false }) => (resizing ? 'col-resize' : 'default')};
  pointer-events: ${({ resizing = false }) => (resizing ? 'auto' : 'none')};
  user-select: none;
  overflow: hidden;
  white-space: nowrap;

  ${({ resizing = false }) =>
    resizing
      ? `
    svg {
      opacity: 0;
    }
  `
      : ''};
`;

function getSiblingIndex(index, direction) {
  const siblingIdx = direction === 'left' ? index - 1 : index + 1;
  return siblingIdx < 0 ? 0 : siblingIdx > 2 ? 2 : siblingIdx;
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

  @observable
  resizing = {
    direction: '',
    start: 0,
    value: 0,
    index: -1,
  };

  areaRef = React.createRef();

  // This method sets the initial resize values on the image
  // object, which is observable through MobX.
  onHandleMouseDown = (index, direction) => e => {
    // The current left position of the handle
    const { left } = e.target.getBoundingClientRect();

    // Base resizing data
    this.resizing.direction = direction; // The side of the handle that is being dragged
    this.resizing.start = left; // The starting position
    this.resizing.value = 0; // The value of how much has been dragged
    this.resizing.index = index; // The index among visible images that the current image has.
  };
  onHandleMouseMove = e => {
    if (this.resizing.index === -1) {
      return;
    }

    const { index, direction, start } = this.resizing;
    const { size = 1 } = this.visibleImages[index];
    // The current horizontal mouse position
    const mouseX = e.clientX;
    // The resize delta. No matter the direction, if we want to grow a lot
    // the delta must be positive, and if we want to shrink it the delta
    // should be negative.
    const delta = direction === 'left' ? start - mouseX : mouseX - start;

    // Only allow shrink if the size is more than one.
    if (size > 1 && delta < 0) {
      // Start the action after 20 px.
      this.resizing.value = delta < -20 ? delta : 0;
    } else {
      // Same, but in the grow direction.
      this.resizing.value = delta > 20 ? delta : 0;
    }
  };

  onHandleMouseUp = e => {
    e.stopPropagation();

    // Check that we are currently resizing
    if (this.resizing.index !== -1) {
      const { value, direction, index } = this.resizing;
      const image = this.visibleImages[index];

      const slotWidth = this.getSlotWidth();
      const actionAreaWidth = slotWidth / 2;

      const modifySibling = (modifyVal, currentImageIndex, collection) => {
        const affectedSiblingIdx = getSiblingIndex(currentImageIndex, direction);
        const siblingSize = get(collection, `[${affectedSiblingIdx}].size`, 0);

        // Make sure the sibling can be modified
        if (
          (modifyVal > 0 && siblingSize < collection.length) ||
          (modifyVal < 0 && siblingSize > 0)
        ) {
          // Modify the affected sibling.
          // eslint-disable-next-line
          collection[affectedSiblingIdx].size = siblingSize + modifyVal;
        } else if (affectedSiblingIdx > 0 && affectedSiblingIdx < collection.length - 1) {
          // If there is still one potential sibling next to this one, modify that instead.
          modifySibling(modifyVal, affectedSiblingIdx, collection);
        }
      };

      // If there is more than one image and the resize value
      // has been dragged beyond the action area, we want to
      // GROW the current slot one size unit.
      if (this.imageCount > 1 && value > actionAreaWidth) {
        // Get the total amount we want to grow this by
        const growByTotal = Math.min(Math.round(Math.abs(value) / slotWidth), 2);
        // Loop counter
        let growBy = growByTotal;
        const collection = this.visibleImages;

        while (growBy > 0) {
          // Grow the current slot.
          image.size = image.size + 1;

          // Get a valid sibling and shrink it.
          modifySibling(-1, index, collection);

          growBy = growBy - 1;
        }

        // If the current slot is larger than one size unit and the resize value
        // is under the action area, we want to SHRINK the current slot one unit.
      } else if (value < -actionAreaWidth && image.size > 1) {
        // Get the total amount we want to shrink this by
        const shrinkByTotal = Math.min(Math.round(Math.abs(value) / slotWidth), 2);
        // Loop counter
        let shrinkBy = shrinkByTotal;
        const collection = this.images;
        const absoluteIndex = this.images.indexOf(image);

        while (shrinkBy > 0) {
          // Shrink the current slot one size down
          image.size = image.size - 1;

          // Get a valid sibling and shrink it.
          modifySibling(1, absoluteIndex, collection);

          shrinkBy = shrinkBy - 1;
        }
      }
    }

    this.resetResize();
  };

  getSlotWidth = () => {
    const slotCount = this.images.reduce((count, img) => count + img.size, 0);
    const visibleSlotCount = this.visibleImages.length;
    // Measure the area that contains the slots
    const { width: areaWidth } = this.areaRef.current.getBoundingClientRect();
    // Figure out how wide a slot is. Subtract horizontal padding
    // on parent and slots to get a more accurate value.
    return (areaWidth - 32 * (visibleSlotCount - 1)) / slotCount;
  };

  resetResize = () => {
    // Reset the currently resizing image.
    this.resizing.index = -1;
    this.resizing.value = 0;
    this.resizing.start = 0;
    this.resizing.direction = '';
  };

  // Shorthand for accessing the images (or an empty array) of the current template.
  @computed
  get images() {
    return get(this.props.template, 'images', []);
  }

  // Get all the slots that should be visible, ie with a size of more than one.
  @computed
  get visibleImages() {
    return this.images.filter(image => image.size > 0);
  }

  // The number of visible slots.
  @computed
  get imageCount() {
    return this.visibleImages.length;
  }

  // Get the CSS grid template value for the slot layout.
  @computed
  get currentTemplateColumns() {
    const columns = this.visibleImages.map(image => `${image.size}fr`);
    return columns.join(' ');
  }

  render() {
    const { template } = this.props;

    return (
      <AreaContainer>
        <Area
          innerRef={this.areaRef}
          resizing={this.resizing.index !== -1}
          onMouseUp={this.onHandleMouseUp}
          onMouseMove={this.onHandleMouseMove}
          onMouseLeave={this.resetResize}
          columns={this.currentTemplateColumns}>
          {this.images.map((image, idx) => {
            const visibleIndex = this.visibleImages.indexOf(image);

            return (
              <TemplateSlot
                resize={this.resizing}
                slotWidth={this.getSlotWidth()}
                order={idx + 1}
                key={`template_image_${template.id}_${idx}`}
                image={image}
                index={visibleIndex}
                totalImages={this.visibleImages.length}
                onMouseDown={this.onHandleMouseDown}
              />
            );
          })}
        </Area>
      </AreaContainer>
    );
  }
}

export default TemplateArea;
