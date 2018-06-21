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
  width: 7.5rem;
  flex: none;
  margin-right: 1rem;

  svg {
    display: block;
    width: 100%;
    height: auto;
  }
`;

@observer
class ImageLibrary extends Component {
  static propTypes = {
    images: PropTypes.array,
  };

  static defaultProps = {
    images: [],
  };

  onDragStart = image => e => {
    const file = JSON.stringify(toJS(image));
    e.dataTransfer.setData('text/plain', file);
  };

  render() {
    const { images } = this.props;

    return (
      <Root>
        <h4>Kirjasto</h4>
        <ImageTrack>
          <ImagesContainer>
            {images.map(img => (
              <Image
                draggable
                onDragStart={this.onDragStart(img)}
                key={img.id}
                dangerouslySetInnerHTML={{ __html: img.svg }}
              />
            ))}
          </ImagesContainer>
        </ImageTrack>
      </Root>
    );
  }
}

export default ImageLibrary;
