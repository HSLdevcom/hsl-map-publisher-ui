import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as mobxPropTypes } from 'mobx-react';
import styled from 'styled-components';
import { toJS } from 'mobx';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import RemoveIcon from 'material-ui/svg-icons/content/remove-circle-outline';

const Root = styled.div``;

const ImagesContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 1rem;
`;

const ImageTrack = styled.div`
  overflow: hidden;
  overflow-y: scroll;
  border: 1px solid #ccc;
  max-height: 20rem;
`;

const Image = styled.div`
  user-select: none;
  margin-bottom: 0.5rem;

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

  &:hover {
    display: block !important;
  }
`;

const ImageWrapper = styled.div`
  width: 7.75rem;
  flex: none;
  margin-right: 1rem;
  position: relative;
  margin-bottom: 1rem;

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
  width: 7.75rem;
  height: 7.75rem;
  flex: none;
  border-radius: 20px;
  margin-right: 1rem;
  background: #efefef;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const ImageLabel = styled.div`
  font-size: 12px;
  text-align: center;
`;

@observer
class ImageLibrary extends Component {
  static propTypes = {
    images: mobxPropTypes.arrayOrObservableArray,
    removeImage: PropTypes.func.isRequired,
  };

  static defaultProps = {
    images: [],
  };

  onDragStart = image => e => {
    e.persist();
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

    return (
      <Root>
        <ImageTrack>
          <ImagesContainer>
            <RemoveImage draggable onDragStart={this.onDragStart(false)}>
              <RemoveIcon style={{ width: '50px', height: '50px' }} color="#ccc" />
            </RemoveImage>
            {images.map((img, idx) => (
              <ImageWrapper key={`image_${img.name}_${idx}`}>
                <Image
                  draggable
                  onDragStart={this.onDragStart(img)}
                  dangerouslySetInnerHTML={{ __html: img.svg }}
                />
                <ImageLabel>{img.name}</ImageLabel>
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
