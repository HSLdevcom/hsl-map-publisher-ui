import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { toJS } from 'mobx';

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
  padding: 0.5rem 0.75rem;
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  background: red;
  border: 0;
  appearance: none;
  cursor: pointer;
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
    const file = JSON.stringify(toJS(image));
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
        <h4>Kirjasto</h4>
        <ImageTrack>
          <ImagesContainer>
            {images.map((img, idx) => (
              <ImageWrapper key={`image_${img.id}_${idx}`}>
                <Image
                  draggable
                  onDragStart={this.onDragStart(img)}
                  dangerouslySetInnerHTML={{ __html: img.svg }}
                />
                <RemoveButton type="button" onClick={this.onRemoveImage(img.name)}>
                  X
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
