import React, { Component } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import styled from 'styled-components';
import TemplateImage from './TemplateImage';

const AreaSlot = styled.div`
  border-radius: 23px;
  flex: 0 0 auto;
  border: 3px dashed white;
  position: relative;
  transform: translateZ(0);
  width: 100%;
  height: 250px;
  transition: all 0.1s ease-out;
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ resizing = false }) => (resizing ? 'z-index: 10' : '')};

  > div {
    overflow: hidden;
    border-radius: 23px;
  }

  svg {
    width: 100%;
    height: auto;
    display: block;
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

const ImageComponent = styled(TemplateImage)``;

@observer
class TemplateSlot extends Component {
  static propTypes = {
    image: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    absoluteIndex: PropTypes.number.isRequired,
    totalImages: PropTypes.number.isRequired,
    onMouseDown: PropTypes.func.isRequired,
  };

  onChangeImage = ({ svg, name }) => {
    const { image } = this.props;

    image.svg = svg;
    image.name = name;
    // Wipe the ID from the image if it is changed
    image.id = '';
  };

  render() {
    const { image, index, absoluteIndex, onMouseDown, totalImages } = this.props;

    if (image.size === 0) {
      return null;
    }

    const isFirst = index === 0;
    const isLast = index >= totalImages - 1;
    const { resizing = null } = image;

    const resizeValue = get(resizing, 'value', 0);
    const resizeDir = get(resizing, 'direction', 'right');

    const resizeStyle = {
      left: resizeDir === 'left' && resizeValue > 0 ? `-${resizeValue}px` : 'auto',
      right: resizeDir === 'left' && resizeValue < 0 ? `${resizeValue}px` : 'auto',
      width: `calc(100% + ${resizeValue}px)`,
    };

    return (
      <AreaSlot resizing={!!resizing} style={resizeStyle} resizeValue={resizeValue}>
        {(!isFirst || image.size > 1) && <HandleLeft onMouseDown={onMouseDown(image, 'left')} />}
        {(!isLast || image.size > 1) && <HandleRight onMouseDown={onMouseDown(image, 'right')} />}
        <ImageComponent onChange={this.onChangeImage} svg={image.svg} />
        <IndexDisplay>{absoluteIndex + 1}</IndexDisplay>
      </AreaSlot>
    );
  }
}

export default TemplateSlot;
