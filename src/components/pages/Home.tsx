import { useAuthUser } from '@react-query-firebase/auth';
import { useFirestoreDocument } from '@react-query-firebase/firestore';
import { doc } from 'firebase/firestore';
import React from 'react';
import styled from 'styled-components';
import { auth, dbFirebase } from '../../firebase';
import PostDetail from './PostDetail';

function Home() {
  console.log('hm');

  const { isLoading: authUserLoading, data: user } = useAuthUser(
    ['authUser'],
    auth
  );
  const currentUserRef = doc(dbFirebase, 'users', user?.uid ?? '');
  const currentUserQuery = useFirestoreDocument(
    ['currentUser', user?.uid],
    currentUserRef
  );

  const bookmarkPostIdArr = currentUserQuery.data?.data()?.bookmarkPostIdArr;
  const name = currentUserQuery.data?.data()?.name;

  if (authUserLoading || currentUserQuery.isLoading) {
    return <div>User Loading...</div>;
  }

  if (bookmarkPostIdArr) {
    bookmarkPostIdArr.sort(
      (a: any, b: any) => b.created?.seconds - a.created?.seconds
    );
  }

  return (
    <Container>
      <h2>
        <strong>{name}</strong> 님이 즐겨찾기한 게시물
      </h2>
      {bookmarkPostIdArr?.length > 0 &&
        bookmarkPostIdArr.map(
          (bookmark: { postId: string; userId: string }) => (
            <PostDetail
              key={bookmark.postId}
              postIdParam={bookmark.postId}
              userIdParam={bookmark.userId}
            />
          )
        )}
    </Container>
  );
}
const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;

  h2 {
    strong {
      font-weight: 600;
    }
  }
`;

Home.defaultProps = {};

export default Home;
