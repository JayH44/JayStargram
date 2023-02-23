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
      <p>{userName}</p>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  height: 30px;
  width: 30%;

  img {
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
`;

export default ProfileBox;
