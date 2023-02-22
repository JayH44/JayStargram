import { useFirestoreQuery } from '@react-query-firebase/firestore';
import { collectionGroup, orderBy, query } from 'firebase/firestore';
import React, { useState } from 'react';
import styled from 'styled-components';
import { dbFirebase } from '../../firebase';

type PostListProps = {};

function PostList() {
  const [idx, setIdx] = useState(0);
  const ref = query(
    collectionGroup(dbFirebase, 'subposts'),
    orderBy('created', 'desc')
  );

  const postQuery = useFirestoreQuery(['posts'], ref, {
    subscribe: true,
  });

  if (postQuery.isLoading) {
    return <div>Loading...</div>;
  }
  const snapshot = postQuery.data;

  return (
    <Container>
      {snapshot &&
        snapshot.docs.map((docSnapshot) => {
          const data = docSnapshot.data();
          return (
            <PostItem key={docSnapshot.id}>
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
            </PostItem>
          );
        })}
    </Container>
  );
}
const Container = styled.ul`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;
const PostItem = styled.li`
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

PostList.defaultProps = {};

export default PostList;
