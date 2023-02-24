import React from 'react';
import styled from 'styled-components';
import ProfileBox from '../common/ProfileBox';

type CommentItemProps = {
  comment: any;
  handleComment?: React.MouseEventHandler<HTMLDivElement>;
};

function CommentItem({ comment, handleComment }: CommentItemProps) {
  return (
    <Container>
      <ProfileBox userId={comment.userId} />
      <CommentText>
        {comment.text}
        <div onClick={handleComment}>댓글달기</div>
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
