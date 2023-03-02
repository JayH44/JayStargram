import { useAuthUser } from '@react-query-firebase/auth';
import {
  useFirestoreDocument,
  useFirestoreDocumentMutation,
  useFirestoreQuery,
} from '@react-query-firebase/firestore';
import {
  arrayUnion,
  collection,
  doc,
  limit,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { auth, dbFirebase } from '../../firebase';
import ProfileBox from '../common/ProfileBox';
import { BiSend, BiArrowBack } from 'react-icons/bi';
import Input from '../common/Input';
import { v4 as uuidv4 } from 'uuid';
import { getTimeString } from '../Post/postfunction';
import Button from '../common/Button';
import SerachResultsForChat from '../common/SerachResultsForChat';
import { BsPersonFill } from 'react-icons/bs';

function MessageRoom() {
  console.log('msr');

  const { id: chatRoomId } = useParams();
  const [newMessage, setNewMessage] = useState('');
  const inputRef: React.ForwardedRef<HTMLInputElement> = useRef(null);
  const bottomListRef: React.RefObject<HTMLDivElement> = useRef(null);
  const [newUser, setNewUser] = useState('');
  const [showUsers, setShowUsers] = useState(false);
  const { isLoading: currentUserLoading, data: currnetUser } = useAuthUser(
    ['authUser'],
    auth
  );

  const chatRef = doc(dbFirebase, 'messages/' + chatRoomId);
  const chatRoomQuery = useFirestoreDocument(
    ['chatRoom', chatRoomId],
    chatRef,
    {
      subscribe: true,
    }
  );
  const chatRoomMutation = useFirestoreDocumentMutation(chatRef, {
    merge: true,
  });
  const { chatRoomName, chatUsers } = chatRoomQuery?.data?.data() ?? {};

  const messageColl = collection(
    dbFirebase,
    'messages/' + chatRoomId + '/submessages'
  );
  const messageQueryRef = query(
    messageColl,
    orderBy('created', 'desc'),
    limit(100)
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
  }, [inputRef]);

  useEffect(() => {
    if (bottomListRef.current) {
      bottomListRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [mutation]);

  useEffect(() => {
    if (newUser) {
      const newUserRef = doc(dbFirebase, 'users/' + newUser);
      updateDoc(newUserRef, {
        chatRoomId: arrayUnion(chatRoomId),
      }).then(() => {
        alert('사용자 초대가 완료되었습니다.');
      });
    }
  }, [newUser, chatRoomId]);

  if (currentUserLoading || isLoading) {
    return <div>메세지 불러오기중 ... </div>;
  }

  console.log(messageQuery);
  console.log(chatUsers);

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
            bottomListRef.current &&
              bottomListRef.current.scrollIntoView({ behavior: 'smooth' });
          },
        }
      );
    }
  };

  const handleChatUsers = () => {
    setShowUsers(!showUsers);
  };

  const addChatUser = (userId: string) => {
    console.log(userId);
    chatRoomMutation.mutate(
      {
        chatUsers: chatUsers.concat(userId),
      },
      {
        onSuccess() {
          alert(userId + '님이 초대가 되었습니다.');
          setNewUser(userId);
        },
      }
    );
  };

  return (
    <Container>
      <MessageHeader>
        <Link to='/message'>
          <BiArrowBack />
        </Link>
        <ChatRoomNameBox onClick={handleChatUsers}>
          <p>{chatRoomName}:</p>
          {showUsers && <SerachResultsForChat onClick={addChatUser} />}
        </ChatRoomNameBox>
        <ChatUserNameBox>
          {chatUsers.map((user: string) => (
            <ProfileBox key={user} userId={user} nameOnly />
          ))}
          <BsPersonFill />
          {chatUsers.length}
        </ChatUserNameBox>
      </MessageHeader>
      {chatUsers && chatUsers.length === 1 && (
        <NoUserBox>
          <p>대화상대를 추가해주세요</p>
          <Button text='대화상대 찾기' onClick={handleChatUsers}></Button>
        </NoUserBox>
      )}
      {sortMsg?.length !== 0 && (
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
      )}
      <InputForm onSubmit={handleOnSubmit}>
        <Input
          ref={inputRef}
          type='text'
          width='90%'
          active={newMessage.length > 0}
          value={newMessage}
          onChange={handleOnChange}
          customplaceholder='메세지를 입력하세요'
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
  top: 40px;

  width: 96%;
  height: 40px;
  max-width: 780px;

  background-color: ${({ theme }) => theme.bgColor};
  padding: 5px;

  svg {
    cursor: pointer;
    width: 25px;
    height: 25px;
  }
`;
const ChatRoomNameBox = styled.div`
  position: relative;
  font-weight: 600;
  cursor: pointer;
`;
const ChatUserNameBox = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  svg {
    width: 20px;
    height: 20px;
  }
`;
const NoUserBox = styled.div`
  margin-top: 40px;
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
    max-width: 70%;

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
  justify-content: space-between;

  position: fixed;
  bottom: 0;
  z-index: 100;
  width: 96%;
  max-width: 780px;
  padding: 10px 0;
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
