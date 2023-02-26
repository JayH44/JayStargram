import {
  useFirestoreInfiniteQuery,
  useFirestoreQuery,
} from '@react-query-firebase/firestore';
import {
  collectionGroup,
  limit,
  orderBy,
  query,
  startAfter,
} from 'firebase/firestore';
import React, { useState } from 'react';
import styled from 'styled-components';
import { dbFirebase } from '../../firebase';
import PostItem from '../Post/PostItem';

type PostListProps = {};

function PostList() {
  const ref = query(
    collectionGroup(dbFirebase, 'subposts'),
    orderBy('created', 'desc'),
    limit(4)
  );

  // const postQuery = useFirestoreQuery(['posts'], ref);

  const postQuery = useFirestoreInfiniteQuery('posts', ref, (snapshot) => {
    const lastDocument = snapshot.docs[snapshot.docs.length - 1];

    // Get the next 20 documents starting after the last document fetched.
    return query(ref, startAfter(lastDocument));
  });

  if (postQuery.isLoading) {
    return <div>Loading...</div>;
  }
  const snapshot = postQuery.data;
  console.log(snapshot);

  return (
    <Container>
      {snapshot &&
        snapshot.pages.map((page) =>
          page.docs.map((docSnapshot) => {
            const data = docSnapshot.data();
            return <PostItem key={docSnapshot.id} data={data} />;
          })
        )}
      <button
        disabled={
          postQuery.isLoading ||
          !postQuery.hasNextPage ||
          postQuery.isFetchingNextPage
        }
        onClick={() => postQuery.fetchNextPage()}>
        Load More
      </button>
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
