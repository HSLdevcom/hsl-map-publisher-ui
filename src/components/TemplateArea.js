import React, { Component } from 'react';
import { observer } from 'mobx-react';
import get from 'lodash/get';
import { blue50 } from 'material-ui/styles/colors';
import { computed, observable } from 'mobx';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import TemplateSlot from './TemplateSlot';

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

  @observable currentlyResizingImage = null;
  areaRef = React.createRef();

  // This method sets the initial resize values on the image
  // object, which is observable through MobX.
  onHandleMouseDown = (image, direction) => e => {
    // The current left position of the handle
    const { left } = e.target.getBoundingClientRect();

    // eslint-disable-next-line
    image.resizing = {
      direction,
      start: left,
      value: 0,
    };

    // Make sure the other drag methods can also access the data.
    this.currentlyResizingImage = image;
  };
  onHandleMouseMove = e => {
    if (!this.currentlyResizingImage) {
      return;
    }

    const image = this.currentlyResizingImage;
    const { size = 1 } = image;
    const { start, direction } = image.resizing;
    // The current horizontal mouse position
    const mouseX = e.clientX;
    // The resize delta. No matter the direction, if we want to grow a lot
    // the delta must be positive, and if we want to shrink it the delta
    // should be negative.
    const delta = direction === 'left' ? start - mouseX : mouseX - start;

    // Only allow shrink if the size is more than one.
    if (size > 1 && delta < 0) {
      // Start the action after 20 px.
      image.resizing.value = delta < -20 ? delta : 0;
    } else {
      // Same, but in the grow direction.
      image.resizing.value = delta > 20 ? delta : 0;
    }
  };
  onHandleMouseUp = e => {
    e.stopPropagation();

    // Check that we are currently resizing
    if (this.currentlyResizingImage) {
      const image = this.currentlyResizingImage;
      const { value, direction } = image.resizing;

      const slotCount = this.visibleImages.reduce((count, img) => count + img.size, 0);
      // Measure the area that contains the slots
      const { width: areaWidth } = this.areaRef.current.getBoundingClientRect();
      // Figure out how wide a slot is
      const slotWidth = areaWidth / slotCount;
      // The action area is the distance the slot edge must be dragged
      // until the resize takes effect.
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
          // If there is still one potential sibling next to this one, grow that instead.
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
        // Get the index of the current slot in the array of visible slots.
        const index = this.visibleImages.indexOf(image);

        while (growBy > 0) {
          // Grow the current slot.
          image.size = image.size + 1;

          // Get a valid sibling and shrink it.
          modifySibling(-1, index, this.visibleImages);

          growBy = growBy - 1;
        }

        // If the current slot is larger than one size unit and the resize value
        // is under the action area, we want to SHRINK the current slot one unit.
      } else if (value < -actionAreaWidth && image.size > 1) {
        // Get the total amount we want to shrink this by
        const shrinkByTotal = Math.min(Math.round(Math.abs(value) / slotWidth), 2);
        // Loop counter
        let shrinkBy = shrinkByTotal;
        // Get the index of this slot from ALL the slots, not just the visible ones.
        const absoluteIndex = this.images.indexOf(image);

        while (shrinkBy > 0) {
          // Shrink the current slot one size down
          image.size = image.size - 1;

          // Get a valid sibling and shrink it.
          modifySibling(1, absoluteIndex, this.images);

          shrinkBy = shrinkBy - 1;
        }
      }
    }

    this.resetResize();
  };
  resetResize = () => {
    this.images.forEach(img => {
      // Remove the resizing prop as best as we can.
      // Do not use delete here as mobx will stop tracking it if you do that.
      // eslint-disable-next-line
      img.resizing = undefined;
    });

    // Reset the currently resixing image.
    this.currentlyResizingImage = null;
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
    const { title, template } = this.props;

    return (
      <AreaContainer>
        <h3>{title}</h3>
        <Area
          innerRef={this.areaRef}
          resizing={!!this.currentlyResizingImage}
          onMouseUp={this.onHandleMouseUp}
          onMouseMove={this.onHandleMouseMove}
          onMouseLeave={this.resetResize}
          columns={this.currentTemplateColumns}>
          {this.visibleImages.map((image, idx, all) => (
            <TemplateSlot
              absoluteIndex={this.images.indexOf(image)}
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
