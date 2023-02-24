import { useFirestoreDocument } from '@react-query-firebase/firestore';
import { doc } from 'firebase/firestore';
import React from 'react';
import styled from 'styled-components';
import { dbFirebase } from '../../firebase';

function ProfileBox({ userId }: { userId: string }) {
  const userRef = doc(dbFirebase, 'users', userId ?? '');
  const userQuery = useFirestoreDocument(['user', userId], userRef, {
    subscribe: true,
  });

  if (userQuery.isLoading) {
    return <div>ProfileBox Loading...</div>;
  }

  const userPhoto = userQuery.data?.data()?.photo;
  const userName = userQuery.data?.data()?.name;

  return (
    <Container>
      <img src={userPhoto} alt={userName} />
      <div>{userName}</div>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  height: 30px;
  min-width: 20%;

  img {
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }

  div {
    font-weight: 600;
  }
`;

export default ProfileBox;
