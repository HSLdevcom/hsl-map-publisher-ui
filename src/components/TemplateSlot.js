import React, { Component } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import styled from 'styled-components';
import TemplateImage from './TemplateImage';

const AreaSlot = styled.div`
  border-radius: 25px;
  flex: 0 0 auto;
  border: 3px dashed white;
  position: relative;
  transform: translateZ(0);
  width: 100%;
  height: 228px;
  transition: opacity 0.1s ease-out;
  display: flex;
  align-items: center;
  justify-content: center;
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

    const isResizing = resize.index === index;

    let resizeValue = isResizing ? get(resize, 'value', 0) : 0;
    const minOrMaxValue = slotWidth * image.size - 100;

    resizeValue = resizeValue !== 0 ? Math.max(-minOrMaxValue, resizeValue) : 0;

    const resizeDir = get(
      resize,
      'direction',
      'left' // siblingResizeDirection === 'left' ? 'right' : 'left',
    );

    const widthValue = Math.min(resizeValue, minOrMaxValue + slotWidth);

    const resizeStyle = {
      left: resizeDir === 'left' && resizeValue > 0 ? `-${widthValue}px` : 'auto',
      right: resizeDir === 'left' && resizeValue < 0 ? `${widthValue}px` : 'auto',
      opacity: 1, // siblingResizeValue > slotWidth / 2 ? (image.size - 1) * 0.5 : 1,
      width: `calc(100% + ${widthValue}px)`,
    };

    return (
      <AreaSlot resizing={resize.index !== -1} style={resizeStyle}>
        {(!isFirst || image.size > 1) && <HandleLeft onMouseDown={onMouseDown(index, 'left')} />}
        {(!isLast || image.size > 1) && <HandleRight onMouseDown={onMouseDown(index, 'right')} />}
        <TemplateImage onChange={this.onChangeImage} svg={image.svg} />
        <IndexDisplay>{order}</IndexDisplay>
      </AreaSlot>
    );
  }
}

export default TemplateSlot;
