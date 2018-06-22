import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { toJS } from 'mobx';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import RemoveIcon from 'material-ui/svg-icons/content/remove-circle-outline';

const Root = styled.div`
  margin-bottom: 2rem;
`;

const ImagesContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  padding: 1rem;
`;

const ImageTrack = styled.div`
  overflow: hidden;
  overflow-x: scroll;
  border: 1px solid #ccc;
`;

const Image = styled.div`
  user-select: none;

  svg {
    display: block;
    width: 100%;
    height: auto;
  }
`;

const RemoveButton = styled.button`
  border-radius: 50%;
  display: none;
  padding: 0;
  width: 2rem;
  height: 2rem;
  text-align: center;
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  background: var(--grey);
  border: 0;
  appearance: none;
  cursor: pointer;
  color: white;
`;

const ImageWrapper = styled.div`
  width: 7.5rem;
  flex: none;
  margin-right: 1rem;
  position: relative;

  &:hover {
    ${RemoveButton} {
      display: block;
    }
  }

  &:active {
    ${RemoveButton} {
      display: none;
    }
  }
`;

const RemoveImage = styled.div`
  border: 2px dashed #ccc;
  width: 7.5rem;
  height: 7.5rem;
  border-radius: 20px;
  margin-right: 1rem;
  background: #efefef;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

@observer
class ImageLibrary extends Component {
  static propTypes = {
    images: PropTypes.array,
    removeImage: PropTypes.func.isRequired,
  };

  static defaultProps = {
    images: [],
  };

  onDragStart = image => e => {
    let dragImage = image;

    if (!image) {
      dragImage = {
        name: '',
        size: 1,
        svg: '',
      };
    }

    const file = JSON.stringify(toJS(dragImage));
    e.dataTransfer.setData('text/plain', file);
  };

  onRemoveImage = which => e => {
    e.preventDefault();
    this.props.removeImage(which);
  };

  render() {
    const { images } = this.props;

    // TODO: Add special item for removing an image from a slot.

    return (
      <Root>
        <h4>Kirjasto</h4>
        <ImageTrack>
          <ImagesContainer>
            <RemoveImage draggable onDragStart={this.onDragStart(false)}>
              <RemoveIcon style={{ width: '50px', height: '50px' }} color="#ccc" />
            </RemoveImage>
            {images.map((img, idx) => (
              <ImageWrapper key={`image_${img.id}_${idx}`}>
                <Image
                  draggable
                  onDragStart={this.onDragStart(img)}
                  dangerouslySetInnerHTML={{ __html: img.svg }}
                />
                <RemoveButton type="button" onClick={this.onRemoveImage(img.name)}>
                  <CloseIcon color="white" />
                </RemoveButton>
              </ImageWrapper>
            ))}
          </ImagesContainer>
        </ImageTrack>
      </Root>
    );
  }
}

export default ImageLibrary;
