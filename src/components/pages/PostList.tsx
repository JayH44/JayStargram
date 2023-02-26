import { useFirestoreInfiniteQuery } from '@react-query-firebase/firestore';
import {
  collectionGroup,
  limit,
  orderBy,
  query,
  startAfter,
} from 'firebase/firestore';
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { dbFirebase } from '../../firebase';
import PostItem from '../Post/PostItem';

function PostList() {
  const bottom = useRef(null);
  const queryNumbers = 8;

  const collGruop = collectionGroup(dbFirebase, 'subposts');
  const ref = query(collGruop, orderBy('created', 'desc'), limit(queryNumbers));
  const postQuery = useFirestoreInfiniteQuery('posts', ref, (snapshot) => {
    const lastDocument = snapshot.docs[snapshot.docs.length - 1];
    return query(ref, startAfter(lastDocument));
  });

  const { data: snapshot } = postQuery;
  const currentSize = snapshot?.pages[snapshot?.pages.length - 1].size;

  useEffect(() => {
    if (bottom && bottom.current && currentSize === queryNumbers) {
      const observer = new IntersectionObserver(
        ([entry]) => entry.isIntersecting && postQuery.fetchNextPage(),
        { root: null, rootMargin: '0px', threshold: 0 }
      );
      observer.observe(bottom.current);
      return () => observer && observer.disconnect();
    }
  }, [bottom, postQuery, currentSize]);

  if (postQuery.isLoading) {
    return <div>Loading...</div>;
  }
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
      <div ref={bottom}></div>
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
