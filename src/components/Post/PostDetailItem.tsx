import { DocumentData } from 'firebase/firestore';
import React, { useState } from 'react';
import styled, { css } from 'styled-components';

type PostDetailItemProps = {
  data: DocumentData;
};

function PostDetailItem({ data }: PostDetailItemProps) {
  const [idx, setIdx] = useState(0);
  return (
    <Container>
      <ImgBoxWrapper idx={idx}>
        {data.photo.map((url: string, idx: string) => (
          <img key={idx} src={url} alt={data.name}></img>
        ))}
        {data.text}
      </ImgBoxWrapper>
      <BtnBox>
        {data.photo.map((url: string, bidx: number) => (
          <LabelBtn
            active={bidx === idx}
            onClick={() => setIdx(bidx)}
          ></LabelBtn>
        ))}
      </BtnBox>
    </Container>
  );
}
const Container = styled.ul`
  position: relative;
  overflow: hidden;
`;

const ImgBoxWrapper = styled.div<{ idx: number }>`
  display: flex;
  transform: translateX(${({ idx }) => -idx * 100}%);
  transition: transform 0.4s;

  img {
    min-width: 100%;
  }
`;
const BtnBox = styled.div`
  position: absolute;
  width: 100%;
  bottom: 5%;
  left: 50%;
  transform: translateX(-50%);

  display: flex;
  gap: 15px;
  align-items: center;
  justify-content: center;
`;
const LabelBtn = styled.div<{ active: boolean }>`
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.4);

  ${({ active }) =>
    active &&
    css`
      background-color: rgba(0, 0, 0, 0.8);
    `}
`;

PostDetailItem.defaultProps = {};

export default PostDetailItem;
