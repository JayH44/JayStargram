import { useFirestoreInfiniteQuery } from '@react-query-firebase/firestore';
import {
  collection,
  limit,
  orderBy,
  query,
  startAfter,
} from 'firebase/firestore';
import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { dbFirebase } from '../../firebase';
import PostDetail from './PostDetail';

function Author() {
  const { id: userId } = useParams();
  const bottom = useRef(null);
  const queryNumbers = 3;

  const authorRef = query(
    collection(dbFirebase, 'posts/' + userId + '/subposts'),
    orderBy('created', 'desc'),
    limit(queryNumbers)
  );

  const authorQuery = useFirestoreInfiniteQuery(
    ['authors', userId],
    authorRef,
    (snapshot) => {
      const lastDocument = snapshot.docs[snapshot.docs.length - 1];
      return query(authorRef, startAfter(lastDocument));
    }
  );
  const { isLoading, data: snapshot } = authorQuery;

  const currentSize = snapshot?.pages[snapshot?.pages.length - 1].size;

  useEffect(() => {
    if (bottom && bottom.current && currentSize === queryNumbers) {
      const observer = new IntersectionObserver(
        ([entry]) => entry.isIntersecting && authorQuery.fetchNextPage(),
        { root: null, rootMargin: '0px', threshold: 0 }
      );
      observer.observe(bottom.current);
      return () => observer && observer.disconnect();
    }
  }, [bottom, authorQuery, currentSize]);

  if (isLoading) {
    return <div>Document Loading....</div>;
  }

  console.log(currentSize);

  // if (snapshot?.empty) {
  //   return <div>사용자 이름으로 작성된 포스트가 없습니다.</div>;
  // }

  return (
    <Container>
      {snapshot &&
        snapshot.pages.map((page) =>
          page.docs.map((docSnapshot) => {
            const data = docSnapshot.data();
            return (
              <PostDetail
                key={docSnapshot.id}
                postIdParam={data.postId}
                userIdParam={data.userId}
              />
            );
          })
        )}
      <div ref={bottom}></div>
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
