import React, { Component } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import get from 'lodash/get';

const Item = styled.div`
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const UploadDrop = styled(Dropzone)`
  border: 0;
  width: 100%;
  height: 100%;
  pointer-events: all;
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

  onDrop = files => {
    const file = files[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = this.onFileLoaded(file.name);

    reader.readAsText(file);
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
