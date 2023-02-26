import { useAuthUser } from '@react-query-firebase/auth';
import { useFirestoreDocument } from '@react-query-firebase/firestore';
import {
  collection,
  collectionGroup,
  doc,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import React from 'react';
import styled from 'styled-components';
import { auth, dbFirebase } from '../../firebase';
import PostDetail from './PostDetail';

type HomeProps = {};

function Home() {
  const { isLoading: authUserLoading, data: user } = useAuthUser('user', auth);
  const currentUserRef = doc(dbFirebase, 'users', user?.uid ?? '');
  const currentUserQuery = useFirestoreDocument(
    ['users', user?.uid],
    currentUserRef
  );

  const bookmarkPostIdArr = currentUserQuery.data?.data()?.bookmarkPostIdArr;
  const name = currentUserQuery.data?.data()?.name;

  console.log(bookmarkPostIdArr);

  // const bookmarkPostIdRef = query(
  //   collectionGroup(dbFirebase, 'subposts'),
  //   where(postId, '==', postId),
  //   orderBy('created', 'desc')
  // );

  if (authUserLoading || currentUserQuery.isLoading) {
    return <div>User Loading...</div>;
  }

  return (
    <Container>
      <h2>{name} 님이 즐겨찾기한 게시물</h2>
      {bookmarkPostIdArr?.length > 0 &&
        bookmarkPostIdArr.map(
          (bookmark: { postId: string; userId: string }) => (
            <PostDetail
              postIdParam={bookmark.postId}
              userIdParam={bookmark.userId}
            />
          )
        )}
    </Container>
  );
}
const Container = styled.div`
  h2 {
    text-align: center;
    margin: 10px;
  }
`;

Home.defaultProps = {};

export default Home;
