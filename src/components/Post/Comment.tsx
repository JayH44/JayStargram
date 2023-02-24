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
import CommentItem from './CommentItem';

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

    const created = new Date(Date.now());
    commentMutation.mutate(
      {
        commentArr: commentArr?.concat({
          postId: id,
          userId: user.uid,
          text,
          created,
          commentRep: [],
        }),
      },
      {
        onSuccess() {
          setText('');
        },
      }
    );
  };

  const handleComment = () => {};

  return (
    <Container>
      <CommentList>
        {(commentArr.length === 1 || (!dropdown && commentArr.length > 1)) && (
          <CommentItem comment={commentArr[0]} handleComment={handleComment} />
        )}
        {dropdown &&
          commentArr.map((comment: any, idx: number) => (
            <CommentItem
              key={idx}
              comment={comment}
              handleComment={handleComment}
            />
          ))}
        {commentArr.length > 1 && (
          <DropDown onClick={() => setDropdown(!dropdown)}>
            {dropdown ? '댓글올리기' : '댓글더보기'}
          </DropDown>
        )}
      </CommentList>
      <WriteBox>
        <img src={user.photoURL ?? ''} alt={user.displayName ?? ''} />
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
  }
`;

const CommentList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const DropDown = styled.div`
  margin-top: 10px;
`;

const WriteBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
`;

Comment.defaultProps = {};

export default Comment;
