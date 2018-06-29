import React, { Component } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import styled from 'styled-components';
import TemplateImage from './TemplateImage';

const AreaSlot = styled.div`
  border-radius: 25px;
  flex: none;
  border: 3px dashed white;
  transform: translateZ(0);
  position: relative;
  height: 228px;
  transition: opacity 0.1s ease-out;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  justify-content: center;
  overflow: hidden;
  ${({ resizing = false }) => (resizing ? 'z-index: 10' : '')};

  svg {
    transition: opacity 0.1s ease-out;
  }
`;

const Handle = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 2px;
  padding: 1rem 0.5rem;
  height: 5rem;
  box-sizing: content-box;
  cursor: col-resize;
  pointer-events: all;
  z-index: 10;

  &:before {
    content: '';
    width: 100%;
    height: 100%;
    display: block;
    background: #888;
  }
`;

const HandleLeft = styled(Handle)`
  left: calc(-0.5rem + 4px);
`;

const HandleRight = styled(Handle)`
  right: calc(-0.5rem + 4px);
`;

const IndexDisplay = styled.span`
  position: absolute;
  bottom: -3px;
  left: -3px;
  background: white;
  border-top-right-radius: 23px;
  border-bottom-left-radius: 23px;
  color: #888;
  padding: 0.5rem 1rem 0.6rem 0.9rem;
`;

@observer
class TemplateSlot extends Component {
  static propTypes = {
    image: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    order: PropTypes.number.isRequired,
    totalImages: PropTypes.number.isRequired,
    onMouseDown: PropTypes.func.isRequired,
    slotWidth: PropTypes.number.isRequired,
    resize: PropTypes.any.isRequired,
  };

  onChangeImage = ({ svg, name }) => {
    const { image } = this.props;

    image.svg = svg;
    image.name = name;
  };

  render() {
    const { image, index, order, onMouseDown, totalImages, slotWidth, resize } = this.props;

    const isFirst = index === 0;
    const isLast = index >= totalImages - 1;
    const { size, svg } = image;
    const { index: resizeIndex, direction } = resize;

    const isResizing = resizeIndex === index;
    const distanceFromResizing = Math.abs(resizeIndex - index);
    let isAffected = direction === 'left' ? resizeIndex > index : resizeIndex < index;
    let resizeValue = get(resize, 'value', 0);
    const distantResizeValueModifier = slotWidth * (distanceFromResizing - 1);

    isAffected = isAffected && Math.abs(resizeValue) > distantResizeValueModifier;

    if (isAffected) {
      resizeValue = -(resizeValue - distantResizeValueModifier);
    } else if (!isResizing) {
      resizeValue = 0;
    }

    // Reverse direction if affected
    const resizeDir = !isAffected ? direction : direction === 'left' ? 'right' : 'left';

    // Calculate the actual width that the slot is including the resize value.
    const absoluteWidth = size * slotWidth;
    const actualWidth = absoluteWidth + resizeValue;

    // TODO make limits work
    
    if (isResizing) {
      resizeValue = resizeValue > 0 ? Math.min(resizeValue, slotWidth * 2) : resizeValue;
      resizeValue =
        resizeValue < 0
          ? Math.max(resizeValue, -(absoluteWidth - slotWidth * (size - 2)))
          : resizeValue;
    }

    // Figure out what the next size will be for this element.
    // If it's under 0.5 it will be hidden (size 0) at drag end.
    const nextSize = actualWidth / slotWidth;
    const isVisible = nextSize > 0.5;

    // If the element will not be visible, don't bother rendering it.
    // This will stop it from occupying a column in the grid.
    if (!isVisible) {
      return null;
    }

    const resizeStyle = {
      left: resizeDir === 'left' && resizeValue > 0 ? `${-resizeValue}px` : 'auto',
      right: resizeDir === 'left' && resizeValue < 0 ? `${resizeValue}px` : 'auto',
      opacity: isVisible ? nextSize * 1 : 0,
      borderWidth: isVisible ? 3 : 0,
      width: !isVisible ? 0 : isResizing || isAffected ? `calc(100% + ${resizeValue}px)` : '100%',
    };

    return (
      <AreaSlot resizing={isResizing} style={resizeStyle}>
        {(!isFirst || size > 1) && <HandleLeft onMouseDown={onMouseDown(index, 'left')} />}
        {(!isLast || size > 1) && <HandleRight onMouseDown={onMouseDown(index, 'right')} />}
        <TemplateImage onChange={this.onChangeImage} svg={svg} />
        <IndexDisplay>{order}</IndexDisplay>
      </AreaSlot>
    );
  }
}

export default TemplateSlot;
