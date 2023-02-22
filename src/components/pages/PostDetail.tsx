import { useFirestoreQuery } from '@react-query-firebase/firestore';
import { collectionGroup, query, where } from 'firebase/firestore';
import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { dbFirebase } from '../../firebase';
import PostDetailItem from '../Post/PostDetailItem';

type PostDetailProps = {};

function PostDetail() {
  const { id } = useParams();
  const ref = query(
    collectionGroup(dbFirebase, 'subposts'),
    where('postId', '==', id)
  );
  const postQuery = useFirestoreQuery(['post', id], ref);

  if (postQuery.isLoading) {
    return <div>Loading...</div>;
  }
  const snapshot = postQuery.data;

  return (
    <>
      {snapshot &&
        snapshot.docs.map((docSnapshot) => {
          const data = docSnapshot.data();
          return (
            <Container key={docSnapshot.id}>
              <AuthorBox>
                <img src={data.userPhoto} alt={data.name} />
                <p>{data.name}</p>
              </AuthorBox>
              <PostDetailItem data={data} />
              <PostTextBox>{data.text}</PostTextBox>
            </Container>
          );
        })}
    </>
  );
}
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const AuthorBox = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  height: 40px;

  overflow: hidden;

  img {
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
`;

const PostTextBox = styled.div``;

PostDetail.defaultProps = {};

export default PostDetail;
