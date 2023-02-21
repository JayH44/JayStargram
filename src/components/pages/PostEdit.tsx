import React, { useEffect, useState } from 'react';
import { IoMdAddCircleOutline } from 'react-icons/io';
import styled, { css } from 'styled-components';
import Button from '../common/Button';
import ImgCrop from '../common/ImgCrop';

type PostEditProps = {};

function PostEdit() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [croppedFiles, setCroppedFiles] = useState<File[]>([]);
  const [idx, setIdx] = useState(0);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const fileList = Array.from(e.target.files);
      setFiles(fileList);
      setOpen(true);
    }
  };

  const handleIndex = (e: React.MouseEvent<HTMLDivElement>, idx: number) => {
    e.stopPropagation();
    setIdx(idx);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  //Input Cancel시 애니메이션 원래대로
  useEffect(() => {
    const listen = () => {
      setTimeout(() => setActive(false), 1000);
    };
    if (active) {
      window.addEventListener('focus', listen);
    } else {
      return window.removeEventListener('focus', listen);
    }
  }, [active]);

  return (
    <Container onSubmit={handleSubmit}>
      <Preview htmlFor='image' onClick={() => setActive(true)}>
        <input
          type='file'
          multiple
          hidden
          id='image'
          onChange={handleImage}
          accept='image/*'
        />
        <PreviewWrapper active={active} idx={idx}>
          {croppedFiles.length > 0 ? (
            croppedFiles.map((file, idx) => (
              <img key={idx} src={URL.createObjectURL(file)} alt={`[${idx}]`} />
            ))
          ) : (
            <IoMdAddCircleOutline />
          )}
        </PreviewWrapper>
        <BtnBox>
          {croppedFiles.length > 0 &&
            croppedFiles.map((_, idx) => (
              <div key={idx} onClick={(e) => handleIndex(e, idx)}></div>
            ))}
        </BtnBox>
      </Preview>
      <Post></Post>
      <Button text='등록' type='submit' round />
      <PreviewSmall>
        {croppedFiles.length > 0 &&
          croppedFiles.map((file, idx) => (
            <ImgBox key={idx}>
              <img src={URL.createObjectURL(file)} alt={`[${idx + 1}]`} />
              <p>{idx + 1}</p>
            </ImgBox>
          ))}
      </PreviewSmall>
      {open && (
        <ImgCrop
          files={files}
          croppedFiles={croppedFiles}
          setCroppedFiles={setCroppedFiles}
          setOpen={setOpen}
        />
      )}
    </Container>
  );
}
const Container = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding-top: 20px;
`;

const Preview = styled.label`
  width: ${({ theme }) => theme.comWidth};
  height: 200px;
  overflow: hidden;
  border: 2px solid ${({ theme }) => theme.bdColor};
  border-radius: 10px;
  position: relative;
  cursor: pointer;
`;

const PreviewWrapper = styled.div<{ active: boolean; idx: number }>`
  display: flex;
  height: 100%;
  transform: translateX(${({ idx }) => -idx * 100}%);

  img {
    width: 100%;
    object-fit: cover;
    object-position: center;
  }

  svg {
    width: 50%;
    height: 50%;
    transform: rotate(0);
    transition: transform 0.4s;

    ${({ active }) =>
      active &&
      css`
        transform: rotate(45deg);
      `}
  }
`;

const BtnBox = styled.div`
  position: absolute;
  left: 50%;
  bottom: 5%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 10;
  cursor: pointer;

  div {
    width: 10px;
    height: 10px;
    background-color: black;
    border-radius: 50%;
  }
`;

const Post = styled.textarea`
  width: ${({ theme }) => theme.comWidth};
  height: 200px;
  border-radius: 10px;
  padding: 15px;
  outline: none;
  resize: none;
  background: transparent;
`;

const PreviewSmall = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin: 20px;
`;

const ImgBox = styled.div`
  img {
    display: block;
    border: 2px solid black;
    width: 100px;
    height: 100px;
  }

  p {
    text-align: center;
  }
`;

PostEdit.defaultProps = {};

export default PostEdit;
