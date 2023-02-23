import { useFirestoreQuery } from '@react-query-firebase/firestore';
import { collectionGroup, orderBy, query } from 'firebase/firestore';
import React, { useState } from 'react';
import styled from 'styled-components';
import { dbFirebase } from '../../firebase';
import PostItem from '../Post/PostItem';

type PostListProps = {};

function PostList() {
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
          return <PostItem key={docSnapshot.id} data={data} />;
        })}
    </Container>
  );
}
const Container = styled.ul`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  user-select: none;
`;

PostList.defaultProps = {};

export default PostList;
