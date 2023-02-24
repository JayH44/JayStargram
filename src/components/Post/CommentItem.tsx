import { useFirestoreDocument } from '@react-query-firebase/firestore';
import { doc } from 'firebase/firestore';
import React from 'react';
import styled from 'styled-components';
import { dbFirebase } from '../../firebase';
import ProfileBox from '../common/ProfileBox';

type CommentItemProps = {
  comment: any;
  handleCommentRep: (name: string, idx: string) => void;
};

function CommentItem({ comment, handleCommentRep }: CommentItemProps) {
  const userRef = doc(dbFirebase, 'users', comment.userId ?? '');
  const userQuery = useFirestoreDocument(['user', comment.userId], userRef, {
    subscribe: true,
  });

  if (userQuery.isLoading) {
    return <div>User Loading...</div>;
  }

  const userName = userQuery.data?.data()?.name;

  return (
    <Container>
      <ProfileBox userId={comment.userId} />
      <CommentText>
        {comment.text}
        <div
          onClick={() => handleCommentRep(`@${userName} `, comment.commentId)}
        >
          댓글달기
        </div>
      </CommentText>
    </Container>
  );
}

const Container = styled.li`
  display: flex;
  align-items: center;
  gap: 20px;
`;
const CommentText = styled.div`
  position: relative;
  div {
    font-size: 0.8rem;
    color: rgba(0, 0, 0, 0.5);
    cursor: pointer;
  }
`;

CommentItem.defaultProps = {};

export default CommentItem;
