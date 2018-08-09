import React, { Component } from 'react';
import { observer, PropTypes as mobxPropTypes } from 'mobx-react';
import get from 'lodash/get';
import { computed, observable, toJS } from 'mobx'; // eslint-disable-line no-unused-vars
import styled from 'styled-components';
import PropTypes from 'prop-types';
import TemplateSlot from './TemplateSlot';

const AreaContainer = styled.div`
  background-color: ${({ background = '#ccc' }) => background};

  > * {
    margin-top: 0;
  }

  h3 {
    padding-top: 1.5rem;
    padding-left: 2rem;
    margin-bottom: 0;
    color: white;
  }
`;

const Area = styled.div`
  padding: 2rem;
  position: relative;
  ${({ orientation = 'horizontal', resizeable = true, columns = '1fr 1fr 1fr' }) =>
    resizeable
      ? `
    display: grid;
    grid-gap: 32px; // 2rem
    justify-items: start;
    align-items: start;
    align-content: start;
    grid-template-columns: ${columns};
    cursor: ${({ resizing = false }) => (resizing ? 'col-resize' : 'default')};
    pointer-events: ${({ resizing = false }) => (resizing ? 'auto' : 'none')};
  `
      : `
    display: flex;
    flex-direction: ${orientation === 'horizontal' ? 'row' : 'column'};
    flex-wrap: nowrap;
    
    > *:not(:last-child) {
      margin-bottom: 32px;
    }
  `};
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
    area: PropTypes.shape({
      resizeable: PropTypes.bool,
      key: PropTypes.string,
      orientation: PropTypes.string,
      background: PropTypes.string,
      slots: mobxPropTypes.observableArrayOf(
        PropTypes.shape({
          size: PropTypes.number,
          image: PropTypes.shape({
            name: PropTypes.string,
            svg: PropTypes.string,
          }),
        }),
      ),
    }),
  };

  static defaultProps = {
    area: {},
  };

  @observable
  resizing = {
    direction: '',
    start: 0,
    value: 0,
    index: -1,
  };

  @observable
  slotWidth = 0;

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
    this.resizing.index = index; // The index among visible slots that the current image has.
  };
  onHandleMouseMove = e => {
    if (this.resizing.index === -1) {
      return;
    }

    const { index, direction, start } = this.resizing;
    const { size = 1 } = this.visibleSlots[index];
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
      const image = this.visibleSlots[index];

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
      if (this.slotCount > 1 && value > actionAreaWidth) {
        // Get the total amount we want to grow this by
        const growByTotal = Math.min(Math.round(Math.abs(value) / slotWidth), 2);
        // Loop counter
        let growBy = growByTotal;
        const collection = this.visibleSlots;

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
        const collection = this.slots;
        const absoluteIndex = this.slots.indexOf(image);

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
    const slotCount = this.slots.reduce((count, slot) => count + slot.size, 0);
    const visibleSlotCount = this.visibleSlots.length;
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

  // Shorthand for accessing the slots (or an empty array) of the current template.
  @computed
  get slots() {
    return get(this.props.area, 'slots', []);
  }

  // Get all the slots that should be visible, ie with a size of more than one.
  @computed
  get visibleSlots() {
    return this.slots.filter(slot => slot.size > 0);
  }

  // The number of visible slots.
  @computed
  get slotCount() {
    return this.visibleSlots.length;
  }

  // Get the CSS grid template value for the slot layout.
  @computed
  get currentAreaColumns() {
    const columns = this.visibleSlots.map(slot => `${slot.size}fr`);
    return columns.join(' ');
  }

  componentDidMount() {
    this.slotWidth = this.getSlotWidth();
  }

  render() {
    const { area } = this.props;

    return (
      <AreaContainer background={area.background}>
        <h3>{area.key}</h3>
        <Area
          resizeable={area.resizeable}
          orientation={area.orientation}
          innerRef={this.areaRef}
          resizing={area.resizeable && this.resizing.index !== -1}
          onMouseUp={this.onHandleMouseUp}
          onMouseMove={this.onHandleMouseMove}
          onMouseLeave={this.resetResize}
          columns={this.currentAreaColumns}>
          {this.slots.map((slot, idx) => {
            const visibleIndex = this.visibleSlots.indexOf(slot);

            return (
              <TemplateSlot
                slot={slot}
                isResizeable={area.resizeable}
                resize={this.resizing}
                slotWidth={this.slotWidth}
                order={idx + 1}
                key={`template_image_${area.key}_${idx}`}
                index={visibleIndex}
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
