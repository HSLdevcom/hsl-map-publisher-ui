import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { toJS } from 'mobx';

const Root = styled.div`
  margin-bottom: 2rem;
`;

const ImagesContainer = styled.div`
  display: grid;
  padding: 1rem;
  border: 1px solid #ccc;
  grid-template-columns: repeat(auto-fill, 7.5rem);
  grid-gap: 1rem;
`;

const ImageTrack = styled.div`
  overflow: hidden;
  overflow-x: scroll;
`;

const Image = styled.div`
  user-select: none;

  svg {
    display: block;
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
