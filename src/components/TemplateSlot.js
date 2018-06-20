import React, { Component } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import styled from 'styled-components';
import TemplateImage from './TemplateImage';

const AreaSlot = styled.div`
  border-radius: 1rem;
  flex: 0 0 auto;
  border: 3px dashed white;
  position: relative;
  height: 15rem;
  overflow: hidden;
  position: relative;
  transform: translateZ(0);
  width: 0;
  transition: all 0.1s ease-out;
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

@observer
class TemplateSlot extends Component {
  static propTypes = {
    image: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    totalImages: PropTypes.number.isRequired,
    onMouseDown: PropTypes.func.isRequired,
  };

  onChangeImage = ({ svg, src }) => {
    this.props.image.svg = svg;
    this.props.image.src = src;
  };

  render() {
    const { image, index, onMouseDown, totalImages } = this.props;

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
        <TemplateImage onChange={this.onChangeImage} svg={image.svg} />
      </AreaSlot>
    );
  }
}

export default TemplateSlot;
