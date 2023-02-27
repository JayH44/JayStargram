import { useFirestoreDocument } from '@react-query-firebase/firestore';
import { doc } from 'firebase/firestore';
import React from 'react';
import styled from 'styled-components';
import { dbFirebase } from '../../firebase';

type ProfileBoxProps = {
  userId: string;
  imgOnly: boolean;
  nameOnly: boolean;
};

function ProfileBox({ userId, imgOnly, nameOnly }: ProfileBoxProps) {
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
    <Container imgOnly={imgOnly}>
      {!nameOnly && <img src={userPhoto} alt={userName} />}
      {!imgOnly && <div>{userName}</div>}
    </Container>
  );
}

const Container = styled.div<{ imgOnly: boolean }>`
  display: flex;
  align-items: center;
  gap: 20px;
  height: 30px;
  min-width: ${({ imgOnly }) => (imgOnly ? '0' : '20%')};

  img {
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }

  div {
    font-weight: 600;
  }
`;

ProfileBox.defaultProps = {
  imgOnly: false,
  nameOnly: false,
};

export default ProfileBox;
