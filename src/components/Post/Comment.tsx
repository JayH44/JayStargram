import { useAuthUser } from '@react-query-firebase/auth';
import {
  useFirestoreDocument,
  useFirestoreDocumentMutation,
} from '@react-query-firebase/firestore';
import { collection, doc } from 'firebase/firestore';
import React, { useState } from 'react';
import styled from 'styled-components';
import { auth, dbFirebase } from '../../firebase';
import Button from '../common/Button';
import Input from '../common/Input';
import ProfileBox from '../common/ProfileBox';

type CommentProps = {
  id: string;
  dropdown: boolean;
  setDropdown: React.Dispatch<React.SetStateAction<boolean>>;
};

function Comment({ id, dropdown, setDropdown }: CommentProps) {
  const { isLoading, data } = useAuthUser(['user'], auth);
  const user = data;
  const [text, setText] = useState('');
  const commentRef = doc(collection(dbFirebase, 'comments'), id);

  const commentsQuery = useFirestoreDocument(['comments', id], commentRef, {
    subscribe: true,
  });
  const commentMutation = useFirestoreDocumentMutation(commentRef);
  const commentArr = commentsQuery.data?.data()?.commentArr;

  if (!user || !id || commentsQuery.isLoading || !commentArr) {
    return <div>Comment Loading...</div>;
  }

  console.log('rr');
  const handleSubmit = () => {
    if (text === '') {
      alert('댓글을 입력해주세요');
      return;
    }

    commentMutation.mutate(
      {
        commentArr: commentArr?.concat({
          postId: id,
          commentId: commentArr.length,
          userId: user.uid,
          userName: user.displayName,
          userPhoto: user.photoURL,
          text,
        }),
      },
      {
        onSuccess() {
          setText('');
        },
      }
    );
  };
  return (
    <Container>
      <CommentList>
        {(commentArr.length === 1 || (!dropdown && commentArr.length > 1)) && (
          <CommentItem>
            <ProfileBox userId={commentArr[0].userId} />
            <p>{commentArr[0].text}</p>
          </CommentItem>
        )}
        {dropdown &&
          commentArr.map((comment: any, idx: number) => (
            <CommentItem key={idx}>
              <ProfileBox userId={comment.userId} />
              <p>{comment.text}</p>
            </CommentItem>
          ))}
        {commentArr.length > 1 && (
          <DropDown onClick={() => setDropdown(!dropdown)}>
            {dropdown ? '댓글올리기' : '댓글더보기'}
          </DropDown>
        )}
      </CommentList>
      <WriteBox>
        <Input
          type='text'
          text='comment'
          placeholder='댓글을 입력해 주세요'
          value={text}
          active={text.length > 0}
          handleInputs={(e) => setText(e.target.value)}
        />
        <Button
          width='50px'
          text='작성'
          bgColor='rgba(0,0,0,0.6)'
          handleOnclick={handleSubmit}
        />
      </WriteBox>
    </Container>
  );
}
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  p {
    cursor: pointer;
  }
`;

const CommentList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const CommentItem = styled.li`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const LeftBox = styled.div`
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

const DropDown = styled.div``;

const WriteBox = styled.div`
  display: flex;
  gap: 10px;
`;

Comment.defaultProps = {};

export default Comment;
