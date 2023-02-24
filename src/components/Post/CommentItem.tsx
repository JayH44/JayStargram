import { useFirestoreDocument } from '@react-query-firebase/firestore';
import { doc } from 'firebase/firestore';
import React from 'react';
import styled, { css } from 'styled-components';
import { dbFirebase } from '../../firebase';
import ProfileBox from '../common/ProfileBox';
import { getTimeElapsed } from './postfunction';

type CommentItemProps = {
  comment: any;
  commentRep: any;
  handleCommentRep: (name: string, idx: string) => void;
  rep?: boolean;
};

function CommentItem({
  comment,
  commentRep,
  handleCommentRep,
  rep,
}: CommentItemProps) {
  const userRef = doc(dbFirebase, 'users', comment.userId ?? '');
  const userQuery = useFirestoreDocument(['user', comment.userId], userRef, {
    subscribe: true,
  });

  if (userQuery.isLoading) {
    return <div>User Loading...</div>;
  }

  const findRep = commentRep.filter(
    (rep: any) => rep.commentRepId === comment.commentId
  );

  const userName = userQuery.data?.data()?.name;
  const userPhoto = userQuery.data?.data()?.photo;

  return (
    <>
      <Container rep={rep}>
        <img src={userPhoto} alt={userName} />
        <CommentTextBox>
          <Username>
            <div>{userName}</div>
            <div>{getTimeElapsed(comment.created.seconds)}</div>
          </Username>
          <CommentText>{comment.text}</CommentText>
          <CommentButtonBox
            onClick={() => handleCommentRep(`@${userName} `, comment.commentId)}
          >
            댓글달기
          </CommentButtonBox>
        </CommentTextBox>
      </Container>
      {findRep.length > 0 &&
        findRep.map((comment: any) => (
          <Container key={comment.userId} rep>
            <ProfileBox userId={comment.userId} />
            <CommentTextBox>
              <CommentText rep>{comment.text}</CommentText>
            </CommentTextBox>
          </Container>
        ))}
    </>
  );
}

const Container = styled.li<{ rep?: boolean }>`
  display: flex;
  gap: 20px;
  width: 100%;

  img {
    padding-top: 5px;
    height: 30px;
    object-fit: cover;
    border-radius: 50%;
  }

  ${({ rep }) =>
    rep &&
    css`
      padding-left: 10%;
    `}
`;
const CommentTextBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Username = styled.div`
  font-size: 0.8rem;
  margin-bottom: 5px;
  display: flex;
  gap: 10px;
`;

const CommentText = styled.div<{ rep?: boolean }>`
  max-width: ${({ rep }) => (rep ? '60%' : '80%')};
`;

const CommentButtonBox = styled.div`
  font-size: 0.8rem;
  color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
`;

CommentItem.defaultProps = {};

export default CommentItem;
