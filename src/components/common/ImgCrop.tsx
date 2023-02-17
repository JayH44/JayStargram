import React from 'react';
import { Cropper } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import styled from 'styled-components';

type ImgCropProps = {};

function ImgCrop() {
  return (
    <Background>
      <Cropper />
    </Background>
  );
}
const Background = styled.div``;

ImgCrop.defaultProps = {};

export default ImgCrop;
