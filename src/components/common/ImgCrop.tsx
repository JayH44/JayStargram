import React from 'react';
import { Cropper } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import styled from 'styled-components';

type ImgCropProps = {};

function ImgCrop({ file }: { file: File | null }) {
  return (
    <Background>
      <Cropper />
    </Background>
  );
}
const Background = styled.div`
  position: fixed;
  left: 0;
  top: 0;

  width: 100vw;
  height: 100vh;

  background-color: rgba(0, 0, 0, 0.4);
`;

ImgCrop.defaultProps = {};

export default ImgCrop;
