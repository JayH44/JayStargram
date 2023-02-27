import { useAuthUser } from '@react-query-firebase/auth';
import {
  useFirestoreDocument,
  useFirestoreDocumentMutation,
  useFirestoreQuery,
} from '@react-query-firebase/firestore';
import { collection, doc, limit, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { auth, dbFirebase } from '../../firebase';
import ProfileBox from '../common/ProfileBox';
import { BiSend, BiArrowBack } from 'react-icons/bi';
import Input from '../common/Input';
import { v4 as uuidv4 } from 'uuid';
import { useQueryClient } from 'react-query';
import { getTimeString } from '../Post/postfunction';

function MessageRoom() {
  const { id: chatRoomId } = useParams();
  const [newMessage, setNewMessage] = useState('');
  const inputRef: React.RefObject<HTMLInputElement> = useRef(null);
  const bottomListRef: React.RefObject<HTMLDivElement> = useRef(null);
  const { data: currnetUser } = useAuthUser(['users'], auth);
  const queryClient = useQueryClient();

  const messageColl = collection(
    dbFirebase,
    'messages/' + chatRoomId + '/submessages'
  );

  const chatRef = doc(dbFirebase, 'messages/' + chatRoomId);
  const chatRoomQuery = useFirestoreDocument(['chatRoom', chatRoomId], chatRef);
  const chatRoomName = chatRoomQuery?.data?.data()?.chatRoomName;

  const messageQueryRef = query(
    messageColl,
    orderBy('created', 'desc'),
    limit(1000)
  );
  const messageQuery = useFirestoreQuery(
    ['messages', chatRoomId],
    messageQueryRef,
    {
      subscribe: true,
    }
  );
  const { isLoading, data: receivedMsg } = messageQuery;
  const sortMsg = receivedMsg?.docs
    .map((msg) => msg.data())
    .sort((a, b) => a.created?.seconds - b.created?.seconds);

  const mid = uuidv4();
  const mutationRef = doc(
    collection(dbFirebase, 'messages/' + chatRoomId + '/submessages'),
    mid
  );
  const mutation = useFirestoreDocumentMutation(mutationRef, {
    merge: true,
  });

  console.log(sortMsg);
  useEffect(() => {
    if (inputRef?.current) {
      inputRef.current.focus();
    }
    // mutation.mutate({});
  }, [inputRef]);

  useEffect(() => {
    if (bottomListRef.current) {
      bottomListRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [mutation]);

  if (isLoading) {
    return <div>메세지 불러오기중 ... </div>;
  }
  console.log(messageQuery);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedMessage = newMessage.trim();
    if (trimmedMessage) {
      const created = new Date(Date.now());
      mutation.mutate(
        {
          text: trimmedMessage,
          created,
          msgId: mutationRef.id,
          userId: currnetUser?.uid,
          isReadArr: [],
        },
        {
          onSuccess() {
            setNewMessage('');
            queryClient.invalidateQueries({
              queryKey: ['chatRoom', chatRoomId],
            });
            bottomListRef.current &&
              bottomListRef.current.scrollIntoView({ behavior: 'smooth' });
          },
        }
      );
    }
  };

  return (
    <Container>
      <MessageHeader>
        <Link to='/message'>
          <BiArrowBack />
        </Link>
        <div>채팅방이름: {chatRoomName}</div>, <div>대화참여중인 유저:</div>
      </MessageHeader>
      <MessageList>
        {sortMsg?.map((msg) => {
          const isOwner = msg.userId === currnetUser?.uid;
          return (
            <MessageItem key={msg.msgId} isOwner={isOwner}>
              {isOwner ? (
                <p>{msg.text}</p>
              ) : (
                <>
                  <ProfileBox userId={msg.userId} imgOnly /> <p>{msg.text}</p>
                </>
              )}
              {
                <>
                  {msg.isReadArr.indexOf(currnetUser?.uid) === -1 &&
                    isOwner && <div>1</div>}
                  {getTimeString(msg.created.seconds)}
                </>
              }
            </MessageItem>
          );
        })}
      </MessageList>
      <InputForm onSubmit={handleOnSubmit}>
        <input
          ref={inputRef}
          type='text'
          value={newMessage}
          onChange={handleOnChange}
          placeholder='메세지를 입력하세요'
        />
        <button type='submit' disabled={!newMessage}>
          <BiSend />
        </button>
      </InputForm>
      <div ref={bottomListRef} />
    </Container>
  );
}
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const MessageHeader = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;

  position: fixed;
  left: 0;
  width: 100%;
  height: 40px;
  background-color: ${({ theme }) => theme.bgColor};
  padding: 5px;
  border: 1px solid ${({ theme }) => theme.bdColor};

  svg {
    cursor: pointer;
    width: 25px;
    height: 25px;
  }
`;
const MessageList = styled.ul`
  margin-top: 40px;
`;
const MessageItem = styled.li<{ isOwner?: boolean }>`
  display: flex;
  flex-direction: ${({ isOwner }) => (isOwner ? 'row-reverse' : 'row')};
  align-items: center;
  gap: 10px;

  margin-bottom: 10px;

  p {
    border-radius: 10px;
    margin: 2px;
    padding: 5px;
    background-color: #f1e5e5;

    ${({ isOwner }) =>
      isOwner &&
      css`
        background-color: #df8004;
        color: white;
      `}
  }
`;

const InputForm = styled.form`
  display: flex;
  align-items: center;

  position: fixed;
  bottom: 0;
  z-index: 100;
  width: 94%;
  padding-bottom: 20px;
  background-color: ${({ theme }) => theme.bgColor};

  input {
    flex: 1;
    padding: 0 10px;
    border-radius: 10px;
  }
  button {
    svg {
      width: 25px;
      height: 25px;
    }
  }
`;

MessageRoom.defaultProps = {};

export default MessageRoom;
