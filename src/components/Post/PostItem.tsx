import { DocumentData } from 'firebase/firestore';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

type PostItemProps = {
  data: DocumentData;
};

function PostItem({ data }: PostItemProps) {
  const [idx, setIdx] = useState(0);
  console.log(data);
  return (
    <Container>
      <Link to={`${data.postId}?userId=${data.userId}`}>
        <PostItemWrapper idx={idx}>
          {data.photo.map((url: string, idx: number) => (
            <img key={idx} src={url} alt={`${data.name}-${idx}`} />
          ))}
        </PostItemWrapper>
      </Link>
      <BtnBox>
        {data.photo.map((_: null, bidx: number) => (
          <KeyButton
            key={bidx}
            onClick={() => setIdx(bidx)}
            active={bidx === idx}
          ></KeyButton>
        ))}
      </BtnBox>
    </Container>
  );
}
const Container = styled.li`
  display: flex;
  overflow: hidden;
  position: relative;
  border-radius: 10px;

  a {
    display: flex;
    overflow: hidden;
    width: 45vw;
    position: relative;
    -webkit-user-drag: none;
  }
`;

const PostItemWrapper = styled.div<{ idx: number }>`
  display: flex;
  width: 100%;
  transform: translateX(${({ idx }) => -idx * 100}%);
  transition: transform 0.4s;

  img {
    width: 100%;
    object-fit: cover;
    -webkit-user-drag: none;
  }
`;
const BtnBox = styled.div`
  position: absolute;
  width: 100%;
  height: 20px;
  bottom: 5%;
  left: 50%;
  transform: translate(-50%);

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const KeyButton = styled.div<{ active: boolean }>`
  width: 10px;
  height: 10px;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 50%;

  ${({ active }) =>
    active &&
    css`
      background-color: rgba(0, 0, 0, 0.7);
    `}
`;

PostItem.defaultProps = {};

export default PostItem;
