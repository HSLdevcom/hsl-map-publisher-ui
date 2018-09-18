import React, { Component } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import get from 'lodash/get';
import invoke from 'lodash/invoke';

const Item = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100px;
  pointer-events: none;
  overflow: hidden;
  border-radius: 25px;

  svg {
    width: 100%;
    height: auto;
    display: block;
  }
`;

const UploadDrop = styled(Dropzone)`
  border: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  pointer-events: all;
  position: static;
`;

@observer
class TemplateImage extends Component {
  static propTypes = {
    svg: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string,
  };

  static defaultProps = {
    svg: '',
    className: '',
  };

  onDrop = (files, dataTransferItems) => {
    // The second argument to this method is actually "rejected files", but the
    // dataTransfer item that we're interested in also gets put here. The third
    // arg is the event, but React won't let me use the dataTransfer prop on it.
    if (dataTransferItems[0] instanceof DataTransferItem && files.length === 0) {
      invoke(dataTransferItems, '[0].getAsString', data => {
        try {
          const image = JSON.parse(data);
          this.props.onChange(image);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn('No valid data found in dragged item.');
        }
      });
    } else {
      const file = files[0];

      if (!file) {
        return;
      }

      const reader = new FileReader();
      reader.onload = this.onFileLoaded(file.name);

      reader.readAsText(file);
    }
  };

  onFileLoaded = fileName => e => {
    const content = get(e, 'target.result', '');
    this.props.onChange({ svg: content, name: fileName });
  };

  render() {
    const { svg, className } = this.props;

    return (
      <UploadDrop className={className} onDrop={this.onDrop} name="footer_image" disablePreview>
        <Item dangerouslySetInnerHTML={{ __html: svg }} />
      </UploadDrop>
    );
  }
}

export default TemplateImage;
