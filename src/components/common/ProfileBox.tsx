import { useFirestoreDocument } from '@react-query-firebase/firestore';
import { doc } from 'firebase/firestore';
import React from 'react';
import styled, { css } from 'styled-components';
import { dbFirebase } from '../../firebase';

type ProfileBoxProps = {
  userId: string;
  imgOnly: boolean;
  nameOnly: boolean;
  userNum?: number;
  height?: string;
  noMargin?: boolean;
};

function ProfileBox({
  userId,
  imgOnly,
  nameOnly,
  height,
  userNum,
  noMargin,
}: ProfileBoxProps) {
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
    <Container
      imgOnly={imgOnly}
      nameOnly={nameOnly}
      height={height}
      userNum={userNum}
      noMargin={noMargin}>
      {!nameOnly && <img src={userPhoto} alt={userName} />}
      {!imgOnly && <div>{userName}</div>}
    </Container>
  );
}

const Container = styled.div<{
  imgOnly: boolean;
  nameOnly: boolean;
  height?: string;
  userNum?: number;
  noMargin?: boolean;
}>`
  display: flex;
  align-items: center;
  /* gap: 20px; */
  height: ${({ height }) => (height ? height : '30')}px;
  min-width: ${({ imgOnly, nameOnly, noMargin }) =>
    imgOnly || noMargin || nameOnly ? '0%' : '20%'};

  ${({ userNum }) =>
    userNum &&
    userNum > 1 &&
    css`
      transform: scale(0.8);
    `}

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
