import { useAuthUser } from '@react-query-firebase/auth';
import {
  useFirestoreDocument,
  useFirestoreDocumentMutation,
} from '@react-query-firebase/firestore';
import { collection, doc } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { auth, dbFirebase } from '../../firebase';
import Button from '../common/Button';
import Input from '../common/Input';
import CommentItem from './CommentItem';
import { v4 as uuidv4 } from 'uuid';

type CommentProps = {
  id: string;
  dropdown: boolean;
  setDropdown: React.Dispatch<React.SetStateAction<boolean>>;
};

function Comment({ id, dropdown, setDropdown }: CommentProps) {
  const { isLoading, data: user } = useAuthUser(['user'], auth);
  const [text, setText] = useState('');
  const [repId, setRepId] = useState<string | null>(null);
  const commentRef = doc(collection(dbFirebase, 'comments'), id);

  const commentsQuery = useFirestoreDocument(['comments', id], commentRef);
  const commentMutation = useFirestoreDocumentMutation(commentRef, {
    merge: true,
  });
  const commentArr = commentsQuery.data?.data()?.commentArr;
  const commentRep = commentsQuery.data?.data()?.commentRep;

  useEffect(() => {
    if (text === '') {
      setRepId(null);
    }
  }, [text]);

  console.log(commentsQuery);

  if (!user || !id || isLoading || commentsQuery.isLoading) {
    return <div>Comment Loading...</div>;
  }

  if (!commentArr) {
    commentMutation.mutate({
      commentArr: [],
    });
    return <div>Comment Initializing...</div>;
  }

  if (!commentRep) {
    commentMutation.mutate({
      commentRep: [],
    });
    return <div>CommentRep Initializing...</div>;
  }

  const handleSubmit = () => {
    if (text === '') {
      alert('댓글을 입력해주세요');
      return;
    }

    const created = new Date(Date.now());
    const commentId = uuidv4();
    if (repId !== null) {
      commentMutation.mutate(
        {
          commentRep: commentRep.concat({
            postId: id,
            commentRepId: repId,
            userId: user.uid,
            text: text,
            created,
          }),
        },
        {
          onSuccess() {
            setText('');
          },
        }
      );
      return;
    }

    if (repId === null) {
      commentMutation.mutate(
        {
          commentArr: commentArr.concat({
            postId: id,
            commentId: commentId,
            userId: user.uid,
            text,
            created,
          }),
        },
        {
          onSuccess() {
            setText('');
          },
        }
      );
      return;
    }
  };

  const handleCommentRep = (name: string, idx: string) => {
    setText(name);
    setRepId(idx);
  };

  return (
    <Container>
      <CommentList>
        {(commentArr.length === 1 || (!dropdown && commentArr.length > 1)) && (
          <CommentItem
            comment={commentArr[0]}
            commentRep={commentRep}
            handleCommentRep={handleCommentRep}
          />
        )}
        {dropdown &&
          commentArr.map((comment: any, idx: number) => (
            <CommentItem
              key={comment.commentId}
              comment={comment}
              commentRep={commentRep}
              handleCommentRep={handleCommentRep}
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
          name='comment'
          customplaceholder='댓글을 입력해 주세요'
          value={text}
          active={text.length > 0}
          onChange={(e) => setText(e.target.value)}
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
`;

const CommentList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const DropDown = styled.div`
  margin-top: 10px;
  cursor: pointer;
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
