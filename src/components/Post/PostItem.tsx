import React from 'react';
import styled, { useState } from 'styled-components';

type PostItemProps = {
  data: DocumentData;
};

function PostItem({ data }: PostItemProps) {
  const [idx, setIdx] = useState(0);

  return (
    <Container>
      <PostItemWrapper idx={idx}>
        {data.photo.map((url: string, idx: number) => (
          <img key={idx} src={url} alt={`${data.name}-${idx}`} />
        ))}
      </PostItemWrapper>
      <BtnBox>
        {data.photo.map((_: null, idx: number) => (
          <div key={idx} onClick={() => setIdx(idx)}></div>
        ))}
      </BtnBox>
    </Container>
  );
}
const Container = styled.li`
  display: flex;
  overflow: hidden;
  width: 45vw;
  position: relative;

  cursor: pointer;
`;

const PostItemWrapper = styled.div<{ idx: number }>`
  display: flex;
  width: 100%;
  transform: translateX(${({ idx }) => -idx * 100}%);
  transition: transform 0.4s;

  img {
    width: 100%;
    object-fit: cover;
    border-radius: 10px;
  }
`;
const BtnBox = styled.div`
  position: absolute;
  width: 80%;
  height: 20px;
  bottom: 5%;
  left: 50%;
  transform: translate(-50%);

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  div {
    width: 10px;
    height: 10px;
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 50%;
  }
`;

PostItem.defaultProps = {};

export default PostItem;
