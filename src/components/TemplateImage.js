import React, { Component } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone/dist/es/index';
import get from 'lodash/get';

const Item = styled.div`
  width: 100%;
  height: 100%;
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

  onDrop = (files, _, e) => {
    const eventData = e.dataTransfer.getData('text');
    // Can pass stringified data through dataTransfer
    if (eventData) {
      const image = JSON.parse(eventData);
      this.props.onChange(image);
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
