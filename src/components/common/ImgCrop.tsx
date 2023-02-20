import React, { useState } from 'react';
import { Cropper } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import styled from 'styled-components';
import Button from './Button';

type ImgCropProps = {
  files: File[];
  croppedFiles: File[];
  setCroppedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  setOpen: (value: React.SetStateAction<boolean>) => void;
};

async function dataURItoFile(dataURI: string, filename: string) {
  const res = await fetch(dataURI);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type });
}

function ImgCrop({
  files,
  croppedFiles,
  setCroppedFiles,
  setOpen,
}: ImgCropProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cropper, setCropper] = useState<Cropper>();

  const handleCrop = async () => {
    if (cropper) {
      const croppedImageData = cropper.getCroppedCanvas().toDataURL();
      const croppedImageFile = await dataURItoFile(
        croppedImageData,
        files[currentIndex].name
      );
      setCroppedFiles([...croppedFiles, croppedImageFile]);
      setCurrentIndex(currentIndex + 1);

      if (currentIndex + 1 === files.length) {
        setOpen(false);
      }
    }
  };

  return (
    <Background>
      <Cropper
        src={URL.createObjectURL(files[currentIndex])}
        onInitialized={(instance) => setCropper(instance)}
        style={{ width: 300, height: 300 }}
        aspectRatio={1}
      />
      <Button
        text='Crop'
        bgColor='red'
        width='200'
        height='30'
        handleOnclick={handleCrop}
      />
    </Background>
  );
}
const Background = styled.div`
  position: fixed;
  left: 0;
  top: 0;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;

  width: 100vw;
  height: 100vh;

  background-color: rgba(0, 0, 0, 0.4);
`;

ImgCrop.defaultProps = {};

export default ImgCrop;
