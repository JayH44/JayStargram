import { useFirestoreQuery } from '@react-query-firebase/firestore';
import { collection, orderBy, query } from 'firebase/firestore';
import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { dbFirebase } from '../../firebase';
import PostAuthorDetail from '../Post/PostAuthorDetail';
import PostItem from '../Post/PostItem';
import PostDetail from './PostDetail';

type AuthorProps = {};

function Author() {
  const { id: userId } = useParams();
  const authorRef = query(
    collection(dbFirebase, 'posts/' + userId + '/subposts'),
    orderBy('created', 'desc')
  );

  const { isLoading, data: snapshot } = useFirestoreQuery(
    ['authors', userId],
    authorRef,
    {
      subscribe: true,
    }
  );

  if (isLoading) {
    return <div>Document Loading....</div>;
  }

  return (
    <Container>
      {snapshot &&
        snapshot.docs.map((docSnapshot) => {
          const data = docSnapshot.data();
          return (
            <PostAuthorDetail
              key={docSnapshot.id}
              postIdParam={data.postId}
              userIdParam={data.userId}
            />
          );
        })}
    </Container>
  );
}
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 50px;
  padding-top: 20px;
`;

Author.defaultProps = {};

export default Author;
