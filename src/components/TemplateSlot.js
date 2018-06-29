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
  position: absolute;
  transform: translateZ(0);
  height: 228px;
  background: green;
  transition: all ${({ resizing = false }) => (resizing ? '0.1s' : '0.1s')} ease-out;
  display: flex;
  align-items: center;
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

function getSiblingIndex(index, direction) {
  const siblingIdx = direction === 'left' ? index - 1 : index + 1;
  return siblingIdx < 0 ? 0 : siblingIdx > 2 ? 2 : siblingIdx;
}

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

    isAffected =
      isAffected &&
      Math.abs(resizeValue) > distanceFromResizing * 20 + slotWidth * (distanceFromResizing - 1);

    if (isResizing) {
      resizeValue = resizeValue;
    } else if (isAffected) {
      resizeValue = -resizeValue;
    } else {
      resizeValue = 0;
    }

    const minOrMaxValue = slotWidth * size - 80;
    resizeValue = resizeValue !== 0 ? Math.max(-minOrMaxValue, resizeValue) : 0;

    // Reverse direction if affected
    const resizeDir = !isAffected ? direction : direction === 'left' ? 'right' : 'left';
    const actualWidth = slotWidth * size + resizeValue;
    const nextWidth = actualWidth / slotWidth;
    const isVisible = nextWidth > 0.5;

    const resizeStyle = {
      left: resizeDir === 'left' && resizeValue > 0 ? `${resizeValue}px` : 'auto',
      right: resizeDir === 'left' && resizeValue < 0 ? `-${resizeValue}px` : 'auto',
      opacity: isVisible ? nextWidth * 1 : 0,
      borderWidth: isVisible ? 3 : 0,
      marginRight: !isVisible || index === totalImages - 1 ? 0 : '32px', // 2rem margin if not the last one and visible.
      width: !isVisible ? 0 : `${actualWidth}px`,
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
